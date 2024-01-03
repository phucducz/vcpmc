import classNames from "classnames/bind";
import { useFormik } from "formik";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";

import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { EtmContractDetail } from "~/api/etmContractAPI";
import { Role } from "~/api/roleAPI";
import { UserInfo } from "~/api/userAPI";
import { ComboBox } from "~/components/ComboBox";
import { Input } from "~/components/Input";
import { PagingItemType } from "~/components/Paging";
import { routes } from "~/config/routes";
import { Yup } from "~/constants";
import { RootState, useAppDispatch } from "~/store";
import { addEmployee } from "~/thunk/etmContractThunk";
import { CommonUserPage } from "../Component/CommonUserPage";
import style from './AddUser.module.scss';

const cx = classNames.bind(style);

function AddUserOfUnitPage() {
    const { id } = useParams();

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const role = useSelector((state: RootState) => state.role);
    const etmContract = useSelector((state: RootState) => state.etmContract);

    const [paging, setPaging] = useState<Array<PagingItemType>>([] as Array<PagingItemType>);
    const [types, setTypes] = useState<{ password: string, confirmPassword: string }>({
        password: 'password',
        confirmPassword: 'password'
    });
    const [comboBoxActive, setComboBoxActive] = useState<boolean>(false);
    const [currentContract, setCurrentContract] = useState<EtmContractDetail>({} as EtmContractDetail);

    const userFormik = useFormik({
        initialValues: {
            userName: '',
            email: '',
            rolesId: '',
            firstName: '',
            lastName: '',
            fullName: '',
            password: '',
            confirmPassword: '',
            employeeIds: []
        } as Omit<UserInfo, 'id' | 'status' | 'phoneNumber'> & { employeeIds: Array<string> },
        validationSchema: Yup.object({
            userName: Yup.string().required(),
            email: Yup.string().required(),
            rolesId: Yup.string().required(),
            fullName: Yup.string().required(),
            password: Yup.string().required(),
            confirmPassword: Yup.string().required().oneOf([Yup.ref('password')], 'Mật khẩu không khớp')
        }),
        onSubmit: values => {
            const fullNameSplit = values.fullName.split(' ');

            dispatch(addEmployee({
                user: {
                    avatar: '',
                    bank: '',
                    bankNumber: '',
                    dateOfBirth: '',
                    dateRange: '',
                    email: values.email,
                    firstName: fullNameSplit[0],
                    gender: '',
                    idNumber: '',
                    issuedBy: '',
                    lastName: fullNameSplit[fullNameSplit.length - 1],
                    nationality: '',
                    password: values.password,
                    phoneNumber: '',
                    residence: '',
                    rolesId: values.rolesId,
                    taxCode: '',
                    userName: values.userName,
                    companyName: '',
                    status: 'active',
                    expirationDate: '',
                },
                entrustmentContractId: currentContract.id,
                employeeIds: currentContract.employeeIds ? currentContract.employeeIds : [],
                navigate: () => navigate(`/unit/management/detail/${id}`)
            }));
        }
    });

    useEffect(() => {
        const currentContract = etmContract.etmContractsDetail.find(contract => contract.id === id);
        if (typeof currentContract === 'undefined') return;

        'undefined' && setCurrentContract(currentContract);
    }, [etmContract.etmContractsDetail]);

    useEffect(() => {
        document.title = 'Chi tiết đơn vị sử dụng | Thêm người dùng';

        setPaging([
            {
                title: 'Quản lý',
                to: routes.Unit,
                active: true
            }, {
                title: 'Đơn vị sử dụng',
                to: routes.Unit,
                active: true
            }, {
                title: 'Chi tiết',
                to: `/unit/management/detail/${id}`,
                active: false
            }, {
                title: 'Thêm người dùng',
                to: '#',
                active: true
            }
        ]);
    }, []);

    const handleOnItemClick = useCallback((item: Role) => {
        userFormik.setFieldValue('rolesId', item.id);
    }, []);

    const USER_INPUTS = [
        {
            fieldName: 'Tên người dùng',
            isRequired: true,
            input: <Input
                name='fullName'
                errorMessage={userFormik.errors.fullName}
                value={userFormik.values.fullName}
                touched={userFormik.touched.fullName}
                onChange={userFormik.handleChange}
                onFocus={() => userFormik.setFieldTouched('fullName', true)}
                onBlur={() => userFormik.setFieldTouched('fullName', false)}
            />
        }, {
            fieldName: 'Email',
            isRequired: true,
            input: <Input
                name='email'
                errorMessage={userFormik.errors.email}
                value={userFormik.values.email}
                touched={userFormik.touched.email}
                onChange={userFormik.handleChange}
                onFocus={() => userFormik.setFieldTouched('email', true)}
                onBlur={() => userFormik.setFieldTouched('email', false)}
            />
        }, {
            fieldName: 'Vai trò',
            isRequired: true,
            input: <ComboBox
                data={role.roleList.map(role => ({
                    id: role.id,
                    title: role.name
                }))}
                active={role.roleList.find(role => role.id === userFormik.values.rolesId)?.name || 'Chọn vai trò'}
                visible={comboBoxActive}
                onClick={() => setComboBoxActive(!comboBoxActive)}
                onItemClick={handleOnItemClick}
                className={cx('form__body__combobox-role')}
                width="216px"
            />
        }, {
            fieldName: 'Tên đăng nhập',
            isRequired: true,
            input: <Input
                name='userName'
                errorMessage={userFormik.errors.userName}
                value={userFormik.values.userName}
                touched={userFormik.touched.userName}
                onChange={userFormik.handleChange}
                onFocus={() => userFormik.setFieldTouched('userName', true)}
                onBlur={() => userFormik.setFieldTouched('userName', false)}
            />
        }, {
            fieldName: 'Mật khẩu',
            isRequired: true,
            input: <Input
                style={{ width: '373px' }}
                type={types.password}
                name='password'
                errorMessage={userFormik.errors.password}
                value={userFormik.values.password}
                touched={userFormik.touched.password}
                onChange={userFormik.handleChange}
                onFocus={() => userFormik.setFieldTouched('password', true)}
                onBlur={() => userFormik.setFieldTouched('password', false)}
                rightIcon={<FontAwesomeIcon
                    icon={faEye}
                    onClick={() => setTypes({ ...types, password: types.password === 'password' ? 'text' : 'password' })}
                />}
            />
        }, {
            fieldName: 'Nhập lại mật khẩu',
            isRequired: true,
            input: <Input
                style={{ width: '373px' }}
                type={types.confirmPassword}
                name='confirmPassword'
                errorMessage={userFormik.errors.confirmPassword}
                value={userFormik.values.confirmPassword}
                touched={userFormik.touched.confirmPassword}
                onChange={userFormik.handleChange}
                onFocus={() => userFormik.setFieldTouched('confirmPassword', true)}
                onBlur={() => userFormik.setFieldTouched('confirmPassword', false)}
                rightIcon={<FontAwesomeIcon
                    icon={faEye}
                    onClick={() => setTypes({ ...types, confirmPassword: types.confirmPassword === 'password' ? 'text' : 'password' })}
                />}
            />
        }
    ];

    return (
        <CommonUserPage
            title='Thêm người dùng'
            formik={userFormik}
            inputs={USER_INPUTS}
            pagingData={paging}
            handleCloseAction={() => navigate(`/unit/management/detail/${id}`)}
        />
    );
}

export default AddUserOfUnitPage;