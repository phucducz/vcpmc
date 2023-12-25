import classNames from "classnames/bind";
import { useFormik } from "formik";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Role } from "~/api/roleAPI";
import { UserInfo } from "~/api/userAPI";
import { ComboBox } from "~/components/ComboBox";
import { Input } from "~/components/Input";
import { PagingItemType } from "~/components/Paging";
import { routes } from "~/config/routes";
import { Yup } from "~/constants";
import { RootState, useAppDispatch } from "~/store";
import { CommonUserPage } from "../Component/CommonUserPage";
import { RadioButton } from "~/components/RadioButton";
import { updateEmployee } from "~/thunk/etmContractThunk";
import style from './EditUser.module.scss';

const cx = classNames.bind(style);

function EditUserOfUnitPage() {
    const { contractId, userId } = useParams();

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const user = useSelector((state: RootState) => state.user);
    const role = useSelector((state: RootState) => state.role);

    const [paging, setPaging] = useState<Array<PagingItemType>>([] as Array<PagingItemType>);
    const [types, setTypes] = useState<{ password: string, confirmPassword: string }>({
        password: 'password',
        confirmPassword: 'password'
    });
    const [comboBoxActive, setComboBoxActive] = useState<boolean>(false);

    const userFormik = useFormik({
        initialValues: {
            userName: '',
            email: '',
            rolesId: '',
            fullName: '',
            password: '',
            confirmPassword: '',
            status: 'active'
        } as Omit<UserInfo, 'id' | 'phoneNumber' | 'lastName' | 'firstName'>,
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
            const id = userId;

            if (typeof id === 'undefined') return;

            dispatch(updateEmployee({
                user: {
                    id: id,
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
                    status: values.status,
                    expirationDate: '',
                },
                navigate: () => navigate(`/unit/management/detail/${contractId}/user-detail/${userId}`)
            }));
        }
    });

    useEffect(() => {
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
                to: `/unit/management/detail/${contractId}`,
                active: false
            }, {
                title: 'Thông tin người dùng',
                to: `/unit/management/detail/${contractId}/user-detail/${userId}`,
                active: true
            }, {
                title: 'Chỉnh sửa thông tin',
                to: '#',
                active: true
            }
        ]);
    }, []);

    useEffect(() => {
        const currentUser = user.users.find(user => user.id === userId);

        typeof currentUser !== 'undefined' && userFormik.setValues({
            userName: currentUser.userName,
            email: currentUser.email,
            fullName: `${currentUser.firstName} ${currentUser.lastName}`,
            password: currentUser.password,
            rolesId: currentUser.role.id,
            confirmPassword: currentUser.password,
            status: currentUser.status || 'active'
        });
    }, [user.users]);

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
        }, {
            fieldName: 'Trạng thái người dùng:',
            isRequired: true,
            input: <div className={cx('form-group-checkbox')}>
                <RadioButton title='Đã kích hoạt' checked={userFormik.values.status === 'active'} onChange={() => userFormik.setFieldValue('status', userFormik.values.status === 'active' ? 'deactive' : 'active')} />
                <RadioButton title='Ngưng kích hoạt' checked={userFormik.values.status !== 'active'} onChange={() => userFormik.setFieldValue('status', userFormik.values.status === 'active' ? 'deactive' : 'active')} />
            </div>
        }
    ];

    return (
        <CommonUserPage
            title='Thông tin người dùng'
            formik={userFormik}
            inputs={USER_INPUTS}
            pagingData={paging}
            handleCloseAction={() => navigate(`/unit/management/detail/${contractId}/user-detail/${userId}`)}
        />
    );
}

export default EditUserOfUnitPage;