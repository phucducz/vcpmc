import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames/bind";
import { useFormik } from "formik";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

import { ETMContractType } from "~/api/etmContractAPI";
import { ActionDataType } from "~/components/Action";
import { Button } from "~/components/Button";
import { Form } from "~/components/Form";
import { Input } from "~/components/Input";
import { PagingItemType } from "~/components/Paging";
import { Table } from "~/components/Table";
import { routes } from "~/config/routes";
import { Yup } from "~/constants";
import { Icon, trashIcon } from "~/icons";
import { CommonPage } from "~/pages/CommonPage";
import { RootState, useAppDispatch } from "~/store";
import { addEtmContractType, deleteEtmContractType, updateEtmContractTypes } from "~/thunk/etmContractThunk";
import style from './EditTypeContract.module.scss';

const cx = classNames.bind(style);

function EditTypeContractPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const etmContract = useSelector((state: RootState) => state.etmContract);

    const [paging, setPaging] = useState<Array<PagingItemType>>([] as Array<PagingItemType>);
    const [actionData, setActionData] = useState<any[]>([] as any[]);
    const [currentItems, setCurrentItems] = useState<Array<ETMContractType>>([] as Array<ETMContractType>);
    const [itemsPerPage, setItemsPerPage] = useState<string>('8');
    const [itemActive, setItemActive] = useState<ETMContractType>({
        id: '',
        name: '',
        revenuePercent: 0,
        applyDate: ''
    });

    const contractTypeFormik = useFormik({
        initialValues: {
            id: '',
            name: '',
            revenuePercent: 0,
            applyDate: '',
            types: [] as Array<ETMContractType>,
            type: 'edit'
        },
        validationSchema: Yup.object({
            id: Yup.string().required(),
            name: Yup.string().required(),
            revenuePercent: Yup.number().required(),
            applyDate: Yup.string().required()
        }),
        onSubmit: values => {
            if (values.type === 'edit') {
                dispatch(updateEtmContractTypes({
                    types: values.types,
                    navigate: () => navigate(routes.ConfigContract)
                }));
                return;
            }

            dispatch(addEtmContractType({ type: itemActive }));
            contractTypeFormik.setFieldValue('type', 'edit');

            contractTypeFormik.setErrors(contractTypeFormik.initialErrors);
            contractTypeFormik.setTouched(contractTypeFormik.initialTouched);
        }
    });

    const handleAddNewType = useCallback((types: Array<ETMContractType>) => {
        if (!types.length) return;

        let newType = { id: '0', name: '', revenuePercent: 0, applyDate: '' };
        contractTypeFormik.setValues({
            ...contractTypeFormik.values,
            types: [...types, newType],
            type: 'add'
        });
        setItemActive(newType);
    }, []);

    useEffect(() => {
        setPaging([
            {
                title: 'Cài đặt',
                to: routes.ConfigContract,
                active: true
            }, {
                title: 'Quản lý loại hợp đồng',
                to: routes.ConfigContract,
                active: true
            }
        ]);

        contractTypeFormik.setFieldValue('types', etmContract.types);
        setItemActive(etmContract.types[0]);
    }, []);

    useEffect(() => {
        contractTypeFormik.setFieldValue('types', etmContract.types);
    }, [etmContract]);

    useEffect(() => {
        setActionData([
            {
                icon: <FontAwesomeIcon icon={faPlus} />,
                title: 'Thêm lịch áp dụng',
                onClick: () => handleAddNewType(contractTypeFormik.values.types),
                disable: contractTypeFormik.values.type === 'add'
            }, {
                icon: <Icon icon={trashIcon} />,
                title: 'Xóa',
                onClick: () => dispatch(deleteEtmContractType({ id: itemActive.id }))
            }
        ]);
    }, [contractTypeFormik.values.types]);

    useEffect(() => {
        if (!contractTypeFormik.values.types.length) return;

        contractTypeFormik.setValues({
            ...contractTypeFormik.values,
            id: itemActive.id,
            name: itemActive.name,
            revenuePercent: itemActive.revenuePercent,
            applyDate: itemActive.applyDate,
            types: contractTypeFormik.values.types.map(type => {
                if (type.id === itemActive.id)
                    return itemActive;
                return type;
            }),
        });
    }, [itemActive]);

    const handleSetCurrentItems = useCallback((items: Array<any>) => {
        setCurrentItems(items);
    }, []);

    const handleChange = useCallback((value: string) => {
        setItemsPerPage(value);
    }, []);

    const handleCancleAction = () => {
        contractTypeFormik.values.type === 'edit'
        ? navigate(routes.ConfigContract)
        : contractTypeFormik.setValues({
            ...contractTypeFormik.values,
            type: 'edit',
            types: contractTypeFormik.values.types.filter(type => type.id !== '0')
        })
    }

    return (
        <CommonPage
            title='Loại hợp đồng'
            pagingData={paging}
            actionData={actionData}
            className={cx('edit-type-contract')}
        >
            <Form
                visible={true}
                onSubmit={contractTypeFormik.handleSubmit}
                className={cx('type-contract__form')}
            >
                <Table
                    paginate={{
                        dataForPaginate: contractTypeFormik.values.types,
                        setCurrentItems: handleSetCurrentItems
                    }}
                    loading={etmContract.loading}
                    thead={['STT', 'Loại hợp đồng', 'Doanh thu VCPCM/hợp đồng (Đơn vị: %)', 'Ngày áp dụng']}
                    className={cx('form__table')}
                    itemsPerPage={itemsPerPage}
                    setItemsPerPage={handleChange}
                >
                    {currentItems.map((item, index) => (
                        itemActive.id === item.id
                            ? <tr key={item.id} style={{ height: '47px' }}>
                                <td><p>{index + 1}</p></td>
                                <td><Input
                                    value={item.name}
                                    onChange={(e: any) => setItemActive({ ...itemActive, name: e.target.value })}
                                    errorMessage={contractTypeFormik.errors.name}
                                    touched={contractTypeFormik.touched.name}
                                    onFocus={() => contractTypeFormik.setFieldTouched('name', true)}
                                    onBlur={() => contractTypeFormik.setFieldTouched('name', false)}
                                /></td>
                                <td><Input
                                    value={`${item.revenuePercent}`}
                                    onChange={(e: any) => setItemActive({ ...itemActive, revenuePercent: e.target.value })}
                                    errorMessage={contractTypeFormik.errors.revenuePercent}
                                    touched={contractTypeFormik.touched.revenuePercent}
                                    onFocus={() => contractTypeFormik.setFieldTouched('revenuePercen', true)}
                                    onBlur={() => contractTypeFormik.setFieldTouched('revenuePercen', false)}
                                /></td>
                                <td><Input
                                    value={item.applyDate}
                                    onChange={(e: any) => setItemActive({ ...itemActive, applyDate: e.target.value })}
                                    errorMessage={contractTypeFormik.errors.applyDate}
                                    touched={contractTypeFormik.touched.applyDate}
                                    onFocus={() => contractTypeFormik.setFieldTouched('applyDate', true)}
                                    onBlur={() => contractTypeFormik.setFieldTouched('applyDate', false)}
                                /></td>
                            </tr>
                            : <tr key={item.id} style={{ height: '47px' }} onClick={() => setItemActive(item)}>
                                <td><p>{index + 1}</p></td>
                                <td><p>{item.name}</p></td>
                                <td><p>{item.revenuePercent}%</p></td>
                                <td><p>{item.applyDate}</p></td>
                            </tr>
                    ))}
                </Table>
                <div className={cx('form__footer')}>
                    <Button outline type='button' onClick={handleCancleAction}>Hủy</Button>
                    <Button type='submit'>Lưu</Button>
                </div>
            </Form >
        </CommonPage >
    );
}

export default EditTypeContractPage;