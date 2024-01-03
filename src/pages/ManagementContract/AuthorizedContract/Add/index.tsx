import classNames from "classnames/bind";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

import { OwnerShip } from "~/api/authorizedContract";
import { Role } from "~/api/roleAPI";
import { PagingItemType } from "~/components/Paging";
import { routes } from "~/config/routes";
import { Yup } from "~/constants";
import { formatDateDMYHPTS } from "~/context";
import { RootState, useAppDispatch } from "~/store";
import { addAuthoziedContract } from "~/thunk/authorizedContractThunk";
import { CommonPageAuthorizedContractEdit } from "../Component/CommonEditAuthorizedPage";
import style from './AddContract.module.scss';

const cx = classNames.bind(style);

const initialValues = {
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
    dateCreated: '',
    ownerShips: [] as Array<OwnerShip>,
    reason: '',
    status: '',
    royalties: '',
    CPM: '',
    administrativeFee: '',
    forControlDate: '',
}

function AddAuthorizedContractPage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const role = useSelector((state: RootState) => state.role);
    const authorizedContract = useSelector((state: RootState) => state.authorized);
    const user = useSelector((state: RootState) => state.user);

    const [paging, setPaging] = useState<Array<PagingItemType>>([] as Array<PagingItemType>);

    const contractFormik = useFormik({
        initialValues: {
            ...initialValues,
            authorizingLegalEntity: 'Cá nhân',
            gender: 'Nam',
            bank: '',
            bankNumber: '',
            dateOfBirth: '',
            dateRange: '',
            email: '',
            idNumber: '',
            issuedBy: '',
            nationality: 'Việt Nam',
            password: '',
            phoneNumber: '',
            residence: '',
            taxCode: '',
            userName: '',
            companyName: '',
            status: '',
            expirationDate: '',
            effectiveDate: '',
            fullName: '',
            role: '',
            contractCode: '',
            customer: '',
        },
        validationSchema: Yup.object({
            bank: Yup.string().required(),
            bankNumber: Yup.string().required(),
            dateOfBirth: Yup.string().required(),
            dateRange: Yup.string().required(),
            email: Yup.string().required(),
            idNumber: Yup.string().required(),
            issuedBy: Yup.string().required(),
            nationality: Yup.string().required(),
            password: Yup.string().required(),
            phoneNumber: Yup.string().required(),
            residence: Yup.string().required(),
            taxCode: Yup.string().required(),
            userName: Yup.string().required(),
            expirationDate: Yup.string().required(),
            fullName: Yup.string().required(),
            effectiveDate: Yup.string().required(),
            contractCode: Yup.string().required(),
            customer: Yup.string().required(),
        }),
        onSubmit: values => {
            const currentDate = new Date();
            const fullNameSplit = values.fullName.split(' ');

            const contract = {
                id: '',
                authorized: values.authorized,
                authorizedPerson: values.authorizedPerson.id,
                authorizingLegalEntity: values.authorizingLegalEntity,
                censored: values.censored,
                contractCode: values.contractCode,
                contractTypesId: values.contractTypesId,
                createdBy: user.currentUser.id,
                customer: values.customer,
                dateCreated: `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`,
                effectiveDate: formatDateDMYHPTS(values.effectiveDate),
                expirationDate: formatDateDMYHPTS(values.expirationDate),
                ownerShips: values.ownerShips,
                reason: values.reason,
                status: 'Còn thời hạn',
                royalties: '0.5',
                CPM: '2280000',
                administrativeFee: '15',
                forControlDate: values.forControlDate
            }

            const authorizedUser = {
                ...values.authorizedPerson,
                bank: values.bank,
                bankNumber: values.bankNumber,
                dateOfBirth: formatDateDMYHPTS(values.dateOfBirth),
                dateRange: formatDateDMYHPTS(values.dateRange),
                email: values.email,
                gender: values.gender,
                idNumber: values.idNumber,
                issuedBy: values.issuedBy,
                nationality: values.nationality,
                password: values.password,
                phoneNumber: values.phoneNumber,
                residence: values.residence,
                taxCode: values.taxCode,
                userName: values.userName,
                companyName: values.companyName,
                status: values.status,
                expirationDate: formatDateDMYHPTS(values.expirationDate),
                firstName: fullNameSplit[fullNameSplit.length],
                lastName: fullNameSplit[0],
                rolesId: role.roleList.find(role => role.name.toLowerCase().trim() === 'user')?.id || ''
            }

            dispatch(addAuthoziedContract({
                contract: contract,
                user: authorizedUser,
                navigate: () => navigate(routes.ManagementList)
            }));
        }
    });

    useEffect(() => {
        document.title = 'Thêm hợp đồng ủy quyền';
        
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
                title: 'Thêm hợp đồng',
                to: "#",
                active: false
            }
        ]);
    }, []);

    return (
        <CommonPageAuthorizedContractEdit
            title='Thêm hợp đồng ủy quyền mới'
            edit={true}
            setEdit={() => navigate(routes.ManagementList)}
            pagingData={paging}
            formikData={contractFormik}
            loading={authorizedContract.loading}
            className={cx('add-authorized-contract')}
        />
    );
}

export default AddAuthorizedContractPage;