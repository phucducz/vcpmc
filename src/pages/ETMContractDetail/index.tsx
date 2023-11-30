import classNames from "classnames/bind";
import { memo, useEffect, useState } from "react";
import { useParams } from "react-router";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faXmark } from "@fortawesome/free-solid-svg-icons";

import style from './ETMContractDetail.module.scss';
import { CommonPageContractEdit } from "../CommonPageContractEdit";
import { RootState, useAppDispatch } from "~/store";
import { getETMContractById } from "~/thunk/etmContractThunk";
import { getUserById } from "~/api/userAPI";
import { PagingItemType } from "~/components/Paging";
import { routes } from "~/config/routes";
import { ActionDataType } from "~/components/Action";
import { Button } from "~/components/Button";

const cx = classNames.bind(style);

const PAGING_ITEMS: Array<PagingItemType> = [
    {
        title: 'Quản lý',
        to: '#'
    }, {
        title: 'Quản lý hợp đồng',
        to: routes.Entrustment
    }, {
        title: 'Chi tiết',
        to: "#"
    }
];

export const ETMContractDetail = () => {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const etmContract = useSelector((state: RootState) => state.etmContract);
    const role = useSelector((state: RootState) => state.role);

    const [actionData, setActionData] = useState<Array<ActionDataType>>([]);
    const [edit, setEdit] = useState<boolean>(false);

    const contractFormik = useFormik({
        initialValues: {
            id: '',
            code: '',
            createdBy: '',
            createdDate: '',
            distributionValue: '',
            effectiveDate: '',
            expirationDate: '',
            name: '',
            status: '',
            type: '',
            value: '',
            companyName: '',
            position: '',
            usersId: '',
            avatar: '',
            bank: '',
            bankNumber: '',
            dateOfBirth: '',
            dateRange: '',
            email: '',
            firstName: '',
            gender: '',
            idNumber: '',
            issuedBy: '',
            lastName: '',
            nationality: '',
            password: '',
            phoneNumber: '',
            residence: '',
            rolesId: '',
            taxCode: '',
            userName: '',
            fullName: '',
            playValue: ''
        },
        onSubmit: values => {
            console.log('update contract');
            console.log(values);
        }
    });

    const { code, distributionValue, effectiveDate, expirationDate,
        name, status, type, value, companyName, position } = contractFormik.values;

    useEffect(() => {
        if (id === '') return;

        dispatch(getETMContractById(id || ''));
    }, [id]);

    useEffect(() => {
        if (Object.keys(etmContract.etmContract).length <= 0) return;

        const getUser = async () => {
            const { usersId } = etmContract.etmContract;
            const user = await getUserById(usersId, role.roleList);

            contractFormik.setValues({
                ...etmContract.etmContract,
                ...user,
                fullName: `${user.firstName}${user.lastName}`,
                playValue: ''
            });
        }

        getUser();
    }, [etmContract.etmContract]);

    console.log(status);

    useEffect(() => {
        let statusCancel = false;

        if (status === 'Hết hiệu lực')
            statusCancel = true;
        if (status === 'Đã hủy')
            statusCancel = true;

        setActionData([
            {
                icon: <FontAwesomeIcon icon={faEdit} className={cx('edit-icon')} />,
                title: 'Chỉnh sửa',
                onClick: () => setEdit(true),
                disable: status === 'Mới' ? false : true
            }, {
                icon: <FontAwesomeIcon icon={faXmark} />,
                title: 'Huỷ hợp đồng',
                onClick: () => setEdit(false),
                disable: statusCancel
            }
        ]);
    }, [status]);

    return (
        <CommonPageContractEdit
            pagingData={PAGING_ITEMS}
            title={`Hợp đồng khai thác - ${code}`}
            edit={edit}
            // edit={{
            //     isEdit: edit,
            //     setEdit: setEdit
            // }}
            formikData={contractFormik}
            actionData={actionData}
            data={
                [
                    {
                        id: 1,
                        children: [
                            {
                                title: 'Tên hợp đồng:',
                                content: name
                            }, {
                                title: 'Số hợp đồng:',
                                content: code
                            }, {
                                title: 'Ngày hiệu lực:',
                                content: effectiveDate
                            }, {
                                title: 'Ngày hết hạn:',
                                content: expirationDate
                            }
                        ]
                    }, {
                        id: 2,
                        children: [
                            {
                                title: 'Đính kèm tệp:',
                                content: 'Hợp đồng kinh doanh'
                            }
                        ]
                    }, {
                        id: 3,
                        children: [
                            {
                                title: 'Loại hợp đồng:',
                                content: type
                            }, {
                                title: 'Giá trị hợp đồng (VNĐ):',
                                content: value
                            }, {
                                title: 'Giá trị phân phối (VNĐ/ngày):',
                                content: distributionValue
                            }, {
                                title: 'Tình trạng:',
                                content: status
                            }
                        ]
                    }, {
                        id: 4,
                        children: [
                            {
                                title: 'Tên đơn vị sử dụng:',
                                content: companyName
                            }, {
                                title: 'Người đại diện:',
                                content: contractFormik.values.firstName
                            }, {
                                title: 'Chức vụ:',
                                content: position
                            }, {
                                title: 'Ngày sinh:',
                                content: contractFormik.values.dateOfBirth
                            }, {
                                title: 'Quốc tịch:',
                                content: contractFormik.values.nationality
                            }, {
                                title: 'Số điện thoại:',
                                content: contractFormik.values.phoneNumber
                            }, {
                                title: 'Email:',
                                content: contractFormik.values.email
                            }
                        ]
                    }, {
                        id: 5,
                        children: [
                            {
                                title: 'Giới tính:',
                                content: contractFormik.values.gender
                            }, {
                                title: 'CMND/ CCCD:',
                                content: contractFormik.values.idNumber
                            }, {
                                title: 'Ngày cấp:',
                                content: contractFormik.values.dateRange
                            }, {
                                title: 'Nơi cấp:',
                                content: contractFormik.values.issuedBy
                            }, {
                                title: 'Mã số thuế:',
                                content: contractFormik.values.taxCode
                            }, {
                                title: 'Nơi cư trú:',
                                content: contractFormik.values.residence
                            }
                        ]
                    }, {
                        id: 6,
                        children: [
                            {
                                title: 'Tên đăng nhập:',
                                content: contractFormik.values.userName
                            }, {
                                title: 'Mật khẩu:',
                                content: contractFormik.values.password
                            }, {
                                title: 'Số tài khoản:',
                                content: contractFormik.values.bankNumber
                            }, {
                                title: 'Ngân hàng:',
                                content: contractFormik.values.bank
                            }
                        ]
                    }
                ]}
        >
            <Button outline type='button' onClick={() => setEdit(false)}>Hủy</Button>
            <Button type='submit'>Lưu</Button>
        </CommonPageContractEdit>
    );
};