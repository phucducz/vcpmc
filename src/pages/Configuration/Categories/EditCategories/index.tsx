import classNames from "classnames/bind";
import { useFormik } from "formik";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

import { Category } from "~/api/categoryAPI";
import { Button } from "~/components/Button";
import { Form } from "~/components/Form";
import { Input } from "~/components/Input";
import { PagingItemType } from "~/components/Paging";
import { Table } from "~/components/Table";
import { routes } from "~/config/routes";
import { Icon, editAltIcon } from "~/icons";
import { CommonPage } from "~/pages/CommonPage";
import { RootState, useAppDispatch } from "~/store";
import { addCategory, getCategories, updateCategories } from "~/thunk/categoryThunk";
import style from './EditCategories.module.scss';

const cx = classNames.bind(style);

function EditCategoriesPage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const category = useSelector((state: RootState) => state.category);

    const [paging, setPaging] = useState<Array<PagingItemType>>([] as Array<PagingItemType>);
    const [currentItems, setCurrentItems] = useState<Array<Category>>([] as Array<Category>);
    const [itemActive, setItemActive] = useState<Category>({
        id: '',
        name: '',
        description: ''
    });
    const [itemsPerPage, setItemsPerPage] = useState<string>('10');
    const [actionData, setActionData] = useState<any[]>([] as any[]);
    const [pageNum, setPageNum] = useState(1);

    const categoryFormik = useFormik({
        initialValues: {
            categories: [] as Array<Category>,
            type: 'edit'
        },
        onSubmit: async (values) => {
            if (values.type === 'edit') {
                dispatch(updateCategories({
                    categories: values.categories,
                    navigate: () => navigate(routes.ConfigCategories)
                }));
                return;
            }

            await dispatch(addCategory({ category: itemActive }));
            categoryFormik.setFieldValue('type', 'edit');

            categoryFormik.setErrors(categoryFormik.initialErrors);
            categoryFormik.setTouched(categoryFormik.initialTouched);
        }
    });

    const handleAddNewCategory = useCallback((categories: Array<Category>) => {
        const newCategory = { id: '0', name: '', description: '' };

        categoryFormik.setValues({ categories: [...categories, newCategory], type: 'add' });
        setItemActive(newCategory);
        setActionData([]);
        setPageNum(1);
    }, []);

    useEffect(() => {
        setPaging([
            {
                title: 'Cài đặt hệ thống',
                to: routes.ConfigCategories,
                active: true
            }, {
                title: 'Chỉnh sửa thông tin',
                to: '#',
                active: true
            }
        ]);

        category.categoryList.length <= 0 && dispatch(getCategories());
    }, []);

    useEffect(() => {
        setActionData([
            {
                icon: <Icon icon={editAltIcon} />,
                title: 'Thêm mới',
                onClick: () => handleAddNewCategory(categoryFormik.values.categories)
            }
        ]);
    }, [categoryFormik.values]);

    useEffect(() => {
        categoryFormik.setFieldValue('categories', category.categoryList);
        setItemActive(category.categoryList[0]);
    }, [category.categoryList]);

    useEffect(() => {
        if (!categoryFormik.values.categories.length) return;

        categoryFormik.setFieldValue('categories', categoryFormik.values.categories.map(category => {
            if (category.id === itemActive.id)
                return itemActive;
            return category;
        }));
    }, [itemActive]);

    const handleSetCurrentItems = useCallback((items: Array<any>) => {
        setCurrentItems(items);
    }, []);

    const handleChange = useCallback((value: string) => {
        setItemsPerPage(value);
    }, []);

    const handleCancelAction = useCallback(() => {
        categoryFormik.values.type === 'edit'
            ? navigate(routes.ConfigCategories)
            : categoryFormik.setValues({
                type: 'edit',
                categories: categoryFormik.values.categories.filter(category => category.id !== '0')
            })
    }, [categoryFormik.values.type]);

    return (
        <CommonPage
            title='Thông tin tác phẩm'
            pagingData={paging}
            actionData={categoryFormik.values.type === 'edit' ? actionData : []}
        >
            <Form className={cx('category-form')} visible={true} onSubmit={categoryFormik.handleSubmit}>
                <p>Thể loại tác phẩm</p>
                <Table
                    paginate={{
                        dataForPaginate: categoryFormik.values.categories,
                        setCurrentItems: handleSetCurrentItems
                    }}
                    loading={category.loading}
                    itemsPerPage={itemsPerPage}
                    setItemsPerPage={handleChange}
                    thead={['STT', 'Tên thể loại', 'Mô tả']}
                    className={cx('category-form__table')}
                    paginateClass={cx('table__row__paginate')}
                >
                    {currentItems.map((item, index) => {
                        return (
                            itemActive.id !== item.id
                                ? <tr
                                    key={item.id}
                                    style={{ height: '46px' }}
                                    onClick={() => setItemActive(item)}
                                >
                                    <td><p>{index + 1}</p></td>
                                    <td><p>{item.name}</p></td>
                                    <td><p>{item.description}</p></td>
                                </tr>
                                : <tr key={item.id} style={{ height: '46px' }} className={cx('table__row__edit')}>
                                    <td><p>{index + 1}</p></td>
                                    <td><Input
                                        value={itemActive.name}
                                        onChange={(e: any) => setItemActive({ ...itemActive, name: e.target.value })}
                                    /></td>
                                    <td><Input
                                        as='textarea'
                                        cols={120}
                                        value={itemActive.description}
                                        onChange={(e: any) => setItemActive({ ...itemActive, description: e.target.value })}
                                        className={cx('category-description')}
                                    /></td>
                                </tr>
                        )
                    })}
                </Table>
                <div className={cx('category-form__action')}>
                    <Button
                        outline
                        type='button'
                        onClick={handleCancelAction}
                    >
                        Hủy
                    </Button>
                    <Button type='submit'>Lưu</Button>
                </div>
            </Form>
        </CommonPage>
    );
}

export default EditCategoriesPage;