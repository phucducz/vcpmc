import classNames from "classnames/bind";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { faClipboard, faEdit, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { AuthorizedContractDetail } from "~/api/authorizedContract";
import { User } from "~/api/userAPI";
import { PagingItemType } from "~/components/Paging";
import { routes } from "~/config/routes";
import { RootState } from "~/store";
import { CommonPageAuthorizedContractEdit } from "../Component/CommonEditAuthorizedPage";
import style from './Detail.module.scss';
import { Icon, clipboardNoteIcon } from "~/icons";
import { Role } from "~/api/roleAPI";
import { string } from "yup";
import { formatDateYMD } from "~/context";

const cx = classNames.bind(style);

type DataType = {
    children: Array<{ title: string; content: string }>;
}

type Owner = Array<string> | string;

const initialValues = {
    id: '',
    authorized: '',
    authorizedPerson: {
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
        role: {} as Pick<Role, 'id' | 'name'>,
        id: '',
        companyName: '',
        status: '',
        expirationDate: '',
    },
    authorizingLegalEntity: '',
    censored: false,
    contractCode: '',
    contractTypesId: '',
    createdBy: {
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
        role: {} as Pick<Role, 'id' | 'name'>,
        id: '',
        companyName: '',
        status: '',
        expirationDate: '',
    },
    customer: '',
    dateCreated: '',
    effectiveDate: '',
    expirationDate: '',
    ownerShips: [] as Array<string> | '' as Owner,
    reason: '',
    status: '',
    royalties: '',
    CPM: '',
    administrativeFee: '',
    forControlDate: '',
}

function AuthorizedContractDetailPage() {
    const { id } = useParams();

    const authorizedContract = useSelector((state: RootState) => state.authorized);

    const [paging, setPaging] = useState<Array<PagingItemType>>([] as Array<PagingItemType>);
    const [data, setData] = useState<DataType[]>([] as DataType[]);
    const [actionData, setActionData] = useState<any[]>([] as any[]);
    const [edit, setEdit] = useState<boolean>(false);

    const contractFormik = useFormik({
        initialValues: {
            ...initialValues,
            bank: '',
            bankNumber: '',
            dateOfBirth: '',
            dateRange: '',
            email: '',
            gender: '',
            idNumber: '',
            issuedBy: '',
            nationality: '',
            password: '',
            phoneNumber: '',
            residence: '',
            taxCode: '',
            userName: '',
            companyName: '',
            status: '',
            expirationDate: '',
            fullName: '',
            role: ''
        },
        onSubmit: values => {

        }
    });

    useEffect(() => {
        setPaging([
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
        ]);

        let currentContract = authorizedContract.contracts
            .find(contract => contract.id === id) || initialValues;

        authorizedContract.contracts.length > 0 && contractFormik.setValues({
            ...currentContract,
            authorizedPerson: {
                ...currentContract.authorizedPerson,
                companyName: currentContract.authorizedPerson.companyName || '',
                expirationDate: currentContract.authorizedPerson.expirationDate || ''
            },
            createdBy: {
                ...currentContract.createdBy,
                companyName: currentContract.authorizedPerson.companyName || '',
                expirationDate: currentContract.authorizedPerson.expirationDate || '',
                status: currentContract.authorizedPerson.status || ''
            },
            ownerShips: currentContract.ownerShips,
            bank: currentContract.authorizedPerson.bank,
            bankNumber: currentContract.authorizedPerson.bankNumber,
            dateOfBirth: formatDateYMD(currentContract.authorizedPerson.dateOfBirth),
            dateRange: formatDateYMD(currentContract.authorizedPerson.dateRange),
            email: currentContract.authorizedPerson.email,
            gender: currentContract.authorizedPerson.gender,
            idNumber: currentContract.authorizedPerson.idNumber,
            issuedBy: currentContract.authorizedPerson.issuedBy,
            nationality: currentContract.authorizedPerson.nationality,
            password: currentContract.authorizedPerson.password,
            phoneNumber: currentContract.authorizedPerson.phoneNumber,
            residence: currentContract.authorizedPerson.residence,
            taxCode: currentContract.authorizedPerson.taxCode,
            userName: currentContract.authorizedPerson.userName,
            companyName: currentContract.authorizedPerson.companyName || '',
            expirationDate: formatDateYMD(currentContract.expirationDate),
            fullName: `${currentContract.authorizedPerson.firstName} ${currentContract.authorizedPerson.lastName}`,
            role: '',
            effectiveDate: formatDateYMD(currentContract.effectiveDate),
        });

        setActionData([
            {
                icon: <FontAwesomeIcon icon={faEdit} />,
                title: 'Chỉnh sửa hợp đồng',
                onClick: () => setEdit(!edit)
            }, {
                icon: <Icon icon={clipboardNoteIcon} />,
                title: 'Gia hạn hợp đồng',
                onClick: () => { }
            }, {
                icon: <FontAwesomeIcon icon={faXmark} className={cx('cancel-contract-icon')} />,
                title: 'Hủy hợp đồng',
                onClick: () => { }
            }
        ]);
    }, []);
    
    useEffect(() => {
        setData([
            {
                children: [
                    {
                        title: 'Số hợp đồng:',
                        content: contractFormik.values.contractCode
                    }, {
                        title: 'Tên hợp đồng:',
                        content: contractFormik.values.customer
                    }, {
                        title: 'Ngày hiệu lực:',
                        content: contractFormik.values.effectiveDate
                    }, {
                        title: 'Ngày hết hạn:',
                        content: contractFormik.values.expirationDate
                    }, {
                        title: 'Tình trạng:',
                        content: contractFormik.values.status
                    }
                ]
            }, {
                children: [{
                    title: 'Đính kèm tệp:',
                    content: ''
                }]
            }, {
                children: [
                    {
                        title: 'Pháp nhân uỷ quyền:',
                        content: contractFormik.values.authorizingLegalEntity
                    }, {
                        title: 'Tên người uỷ quyền:',
                        content: `${contractFormik.values.authorizedPerson.firstName} ${contractFormik.values.authorizedPerson.lastName}`
                    }, {
                        title: 'Ngày sinh:',
                        content: contractFormik.values.authorizedPerson.dateOfBirth
                    }, {
                        title: 'Giới tính:',
                        content: contractFormik.values.authorizedPerson.gender
                    }, {
                        title: 'Quốc tịch:',
                        content: contractFormik.values.authorizedPerson.nationality
                    }, {
                        title: 'Số điện thoại:',
                        content: contractFormik.values.authorizedPerson.phoneNumber
                    }
                ]
            }, {
                children: [
                    {
                        title: 'Số CMND/ CCCD:',
                        content: contractFormik.values.authorizedPerson.idNumber
                    }, {
                        title: 'Ngày cấp:',
                        content: contractFormik.values.authorizedPerson.dateRange
                    }, {
                        title: 'Nơi cấp:',
                        content: contractFormik.values.authorizedPerson.issuedBy
                    }, {
                        title: 'Mã số thuế:',
                        content: contractFormik.values.authorizedPerson.taxCode
                    }, {
                        title: 'Nơi cư trú:',
                        content: contractFormik.values.authorizedPerson.residence
                    }
                ]
            }, {
                children: [
                    {
                        title: 'Email:',
                        content: contractFormik.values.authorizedPerson.email
                    }, {
                        title: 'Tài khoản đăng nhập:',
                        content: contractFormik.values.authorizedPerson.userName
                    }, {
                        title: 'Mật khẩu:',
                        content: contractFormik.values.authorizedPerson.password
                    }, {
                        title: 'Số tài khoản:',
                        content: contractFormik.values.authorizedPerson.bankNumber
                    }, {
                        title: 'Ngân hàng:',
                        content: contractFormik.values.authorizedPerson.bank
                    }
                ]
            }
        ]);
    }, [contractFormik.values]);

    return (
        <CommonPageAuthorizedContractEdit
            title='Chi tiết hợp đồng uỷ quyền bài hát - BH123'
            edit={edit}
            setEdit={setEdit}
            data={data}
            pagingData={paging}
            formikData={contractFormik}
            actionData={actionData}
        />
    );
}

export default AuthorizedContractDetailPage;