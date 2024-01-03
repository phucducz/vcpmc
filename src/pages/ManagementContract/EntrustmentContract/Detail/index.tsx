import { faEdit, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames/bind";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";

import { EtmContract } from "~/api/etmContractAPI";
import { User, getUserById } from "~/api/userAPI";
import { Button } from "~/components/Button";
import Loading from "~/components/Loading";
import { PagingItemType } from "~/components/Paging";
import { routes } from "~/config/routes";
import { Yup } from "~/constants";
import { RootState, useAppDispatch } from "~/store";
import { cancelEntrustmentContract, getETMContractById, saveEntrustmentContract } from "~/thunk/etmContractThunk";
import { CommonPageContractEdit } from "../Components/CommonPageContractEdit";
import style from './ETMContractDetail.module.scss';

const cx = classNames.bind(style);

const PAGING_ITEMS: Array<PagingItemType> = [
    {
        title: 'Quản lý',
        to: routes.ManagementList,
        active: true
    }, {
        title: 'Quản lý hợp đồng',
        to: routes.ManagementList,
        active: true
    }, {
        title: 'Chi tiết',
        to: "#",
        active: true
    }
];

function ETMContractDetailPage() {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const etmContract = useSelector((state: RootState) => state.etmContract);
    const role = useSelector((state: RootState) => state.role);

    const [actionData, setActionData] = useState<Array<any>>([]);
    const [edit, setEdit] = useState<boolean>(false);

    const contractFormik = useFormik({
        initialValues: {
            id: '',
            code: '',
            contractCode: '',
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
        validationSchema: Yup.object({
            id: Yup.string().required(),
            code: Yup.string().required(),
            createdDate: Yup.string().required(),
            distributionValue: Yup.string().required(),
            effectiveDate: Yup.string().required(),
            expirationDate: Yup.string().required(),
            name: Yup.string().required(),
            status: Yup.string().required(),
            type: Yup.string().required(),
            value: Yup.string().required(),
            companyName: Yup.string().required(),
            position: Yup.string().required(),
            usersId: Yup.string().required(),
            bank: Yup.string().required(),
            bankNumber: Yup.string().required(),
            dateOfBirth: Yup.string().required(),
            dateRange: Yup.string().required(),
            email: Yup.string().required(),
            firstName: Yup.string().required(),
            gender: Yup.string().required(),
            idNumber: Yup.string().required(),
            issuedBy: Yup.string().required(),
            lastName: Yup.string().required(),
            nationality: Yup.string().required(),
            password: Yup.string().required(),
            phoneNumber: Yup.string().required(),
            residence: Yup.string().required(),
            rolesId: Yup.string().required(),
            taxCode: Yup.string().required(),
            userName: Yup.string().required(),
            fullName: Yup.string().required(),
            playValue: Yup.string().required()
        }),
        onSubmit: values => {
            const { code, distributionValue, effectiveDate, expirationDate, id, name, playValue,
                status, type, value, companyName, position, createdBy, createdDate, usersId } = values;

            const { avatar, bank, bankNumber, dateOfBirth, dateRange, email, gender,
                idNumber, issuedBy, nationality, password, phoneNumber, residence,
                rolesId, taxCode, userName, fullName } = values;

            const fullNameList = fullName.split(' ');

            const formatToDMY = (date: string) => {
                const dateArray = date.split('-');

                return `${dateArray[2]}/${dateArray[1]}/${dateArray[0]}`;
            }

            const user: Omit<User, 'role'> = {
                avatar: avatar,
                bank: bank,
                bankNumber: bankNumber,
                companyName: companyName,
                dateOfBirth: formatToDMY(dateOfBirth),
                dateRange: formatToDMY(dateRange),
                email: email,
                firstName: fullNameList[fullNameList.length - 1],
                gender: gender,
                idNumber: idNumber,
                issuedBy: issuedBy,
                lastName: fullNameList[0],
                nationality: nationality,
                password: password,
                phoneNumber: phoneNumber,
                residence: residence,
                rolesId: rolesId,
                taxCode: taxCode,
                userName: userName,
                id: usersId
            }

            const contract: EtmContract = {
                id: id,
                code: code,
                createdBy: createdBy,
                createdDate: createdDate,
                companyName: companyName,
                distributionValue: distributionValue,
                effectiveDate: formatToDMY(effectiveDate),
                expirationDate: formatToDMY(expirationDate),
                name: name,
                status: status,
                type: type,
                value: value,
                position: position,
                usersId: usersId,
                playValue: playValue
            }

            dispatch(saveEntrustmentContract({
                contract,
                user,
                navigate: () => navigate(routes.ManagementList)
            }));
        }
    });

    const { code, distributionValue, effectiveDate, expirationDate, playValue,
        name, status, type, value, companyName, position } = contractFormik.values;

    useEffect(() => {
        document.title = !edit ? 'Chi tiết hợp đồng khai thác' : 'Chỉnh sửa hợp đồng khai thác';
    }, [edit]);

    useEffect(() => {
        if (id === '') return;

        dispatch(getETMContractById(id || ''));
    }, [id]);

    const formatYMDToMDY = (date: string) => {
        let dateArray = date.split('/');

        return `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`;
    }

    useEffect(() => {
        if (Object.keys(etmContract.etmContract).length <= 0) return;

        const getUser = async () => {
            const { usersId } = etmContract.etmContract;
            const user = await getUserById(usersId, role.roleList);

            contractFormik.setValues({
                ...user,
                ...etmContract.etmContract,
                fullName: `${user.firstName} ${user.lastName}`,
                playValue: etmContract.etmContract.playValue,
                dateOfBirth: formatYMDToMDY(user.dateOfBirth),
                expirationDate: formatYMDToMDY(etmContract.etmContract.expirationDate),
                effectiveDate: formatYMDToMDY(etmContract.etmContract.effectiveDate),
                dateRange: formatYMDToMDY(user.dateRange),
                contractCode: etmContract.etmContract.code
            });
        }

        getUser();
    }, [etmContract.etmContract]);

    const handleCancelContract = async () => {
        await dispatch(cancelEntrustmentContract({ id: contractFormik.values.id, status: 'Đã hủy' }));
        navigate(routes.ManagementList);
    }

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
                disable: (status === 'Mới' || status === 'Đang hiệu lực') ? false : true
            }, {
                icon: <FontAwesomeIcon icon={faXmark} />,
                title: 'Huỷ hợp đồng',
                onClick: () => handleCancelContract(),
                disable: statusCancel
            }
        ]);
    }, [status]);

    return (
        <div className={cx('entrustment-detail-container')}>
            <CommonPageContractEdit
                pagingData={PAGING_ITEMS}
                title={`Hợp đồng khai thác - ${contractFormik.values.contractCode}`}
                edit={edit}
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
                                    title: type === 'Trọn gói' ? 'Giá trị hợp đồng (VNĐ):' : 'Giá trị lượt phát (VNĐ)/lượt',
                                    content: type === 'Trọn gói' ? value : playValue
                                }, {
                                    title: type === 'Trọn gói' ? 'Giá trị phân phối (VNĐ/ngày):' : '',
                                    content: type === 'Trọn gói' ? distributionValue : '',
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
                                    content: contractFormik.values.fullName
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
            <Loading visible={etmContract.loading} />
        </div>
    );
};

export default ETMContractDetailPage;