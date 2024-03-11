import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames/bind";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

import { Category } from "~/api/categoryAPI";
import { PagingItemType } from "~/components/Paging";
import { Table } from "~/components/Table";
import { routes } from "~/config/routes";
import { CommonPage } from "~/pages/CommonPage";
import { RootState, useAppDispatch } from "~/store";
import { getCategories } from "~/thunk/categoryThunk";
import style from './Categories.module.scss';

const cx = classNames.bind(style);

function ConfigCategoriesPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const category = useSelector((state: RootState) => state.category);

    const [paging, setPaging] = useState<Array<PagingItemType>>([] as Array<PagingItemType>);
    const [currentItems, setCurrentItems] = useState<Array<Category>>([] as Array<Category>);
    const [searchResult, setSearchResult] = useState<Array<Category>>([] as Array<Category>);
    const [itemsPerPage, setItemsPerPage] = useState<string>('8');
    const [actionData, setActionData] = useState<any[]>([] as any[]);

    useEffect(() => {
        document.title = 'Thông tin tác phẩm';
        
        setPaging([
            {
                title: 'Trang chủ',
                to: routes.ConfigCategories,
                active: true
            }, {
                title: 'Cài đặt hệ thống',
                to: '#',
                active: true
            }
        ]);

        setActionData([
            {
                icon: <FontAwesomeIcon icon={faEdit} />,
                title: 'Chỉnh sửa',
                onClick: () => navigate(routes.EditCategories)
            }
        ]);

        dispatch(getCategories());
    }, []);

    useEffect(() => {
        setSearchResult(category.categoryList);
    }, [category]);

    const handleSetCurrentItems = useCallback((items: Array<any>) => {
        setCurrentItems(items);
    }, []);

    const handleChange = useCallback((value: string) => {
        setItemsPerPage(value);
    }, []);

    return (
        <CommonPage
            title='Thông tin tác phẩm'
            pagingData={paging}
            actionData={actionData}
        >
            <div className={cx('category-container')}>
                <p>Thể loại tác phẩm</p>
                <Table
                    paginate={{
                        dataForPaginate: searchResult,
                        setCurrentItems: handleSetCurrentItems
                    }}
                    loading={category.loading}
                    itemsPerPage={itemsPerPage}
                    setItemsPerPage={handleChange}
                    thead={['STT', 'Tên thể loại', 'Mô tả']}
                    className={cx('category-container__table')}
                    paginateClass={cx('table__row__paginate')}
                >
                    {currentItems.map((item, index) => (
                        <tr key={item.id} style={{ height: '46px' }}>
                            <td><p>{index + 1}</p></td>
                            <td><p>{item.name}</p></td>
                            <td><p>{item.description}</p></td>
                        </tr>
                    ))}
                </Table>
            </div>
        </CommonPage>
    );
}

export default ConfigCategoriesPage;