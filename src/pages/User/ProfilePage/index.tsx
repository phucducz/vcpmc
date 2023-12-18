import { faCheckCircle, faEdit, faEye, faLock, faSignOut } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames/bind";
import { useFormik } from "formik";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

import { Action } from "~/components/Action";
import { Button } from "~/components/Button";
import { Form } from "~/components/Form";
import Image from "~/components/Image";
import { Input } from "~/components/Input";
import Loading from "~/components/Loading";
import { Toast } from "~/components/Toast";
import { Yup } from "~/constants";
import { RootState, useAppDispatch } from "~/store";
import { changeInfoUserById, changePassword } from "~/thunk/userThunk";
import style from './Profile.module.scss';

const cx = classNames.bind(style);

function ProfilePage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const user = useSelector((state: RootState) => state.user);

    const changePasswordInputRef = useRef<HTMLInputElement>(null);
    const profileInputRef = useRef<HTMLInputElement>(null);

    const [edit, setEdit] = useState({
        isEditProfile: false,
        isEditPassword: false
    });
    const [toastActive, setToastActive] = useState<boolean>(false);
    const [actionActive, setActionAcitve] = useState<boolean>(true);
    const [actionData, setActionData] = useState([
        {
            icon: <FontAwesomeIcon icon={faEdit} />,
            title: 'Sửa thông tin',
            onClick: () => handleActiveEditProfile()
        }, {
            icon: <FontAwesomeIcon icon={faLock} />,
            title: 'Đổi mật khẩu',
            onClick: () => handleActiveChangePassword()
        }, {
            icon: <FontAwesomeIcon icon={faSignOut} />,
            title: 'Đăng xuất',
            onClick: () => handleActiveChangePassword()
        }
    ]);

    const { avatar, userName, lastName, firstName,
        dateOfBirth, phoneNumber, email, role, id } = user.currentUser;

    useEffect(() => {
        try {
            profileFormik.setFieldValue('role', role.name);
        }
        catch {
            navigate('/login');
        }
    }, []);

    const profileFormik = useFormik({
        initialValues: {
            avatar: avatar,
            dateOfBirth: dateOfBirth,
            email: email,
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber,
            role: (role && role.name) || '',
            userName: userName
        },
        validationSchema: Yup.object({
            avatar: Yup.string().required(),
            dateOfBirth: Yup.string().required().matches(/^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/),
            email: Yup.string().required(),
            firstName: Yup.string().required().matches(/^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s\W|_]+$/),
            lastName: Yup.string().required().matches(/^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s\W|_]+$/),
            phoneNumber: Yup.string().required().matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g),
            role: Yup.string().required(),
            userName: Yup.string().required()
        }),
        onSubmit: async (profile) => {
            await dispatch(changeInfoUserById({
                id: id,
                lastName: profile.lastName,
                firstName: profile.firstName,
                phoneNumber: profile.phoneNumber,
                dateOfBirth: profile.dateOfBirth
            }));

            handleCancelEditProfile();
        }
    });

    const PROFILE_INPUTS = [
        {
            fieldName: 'Họ:',
            name: 'lastName',
            small: true,
            value: profileFormik.values.lastName,
            errorMessage: profileFormik.errors.lastName,
            touched: profileFormik.touched.lastName,
            onChange: profileFormik.handleChange,
            onFocus: () => profileFormik.setFieldTouched('lastName', true),
            onBlur: () => profileFormik.setFieldTouched('lastName', false),
        }, {
            fieldName: 'Tên:',
            name: 'firstName',
            small: true,
            value: profileFormik.values.firstName,
            errorMessage: profileFormik.errors.firstName,
            touched: profileFormik.touched.firstName,
            onChange: profileFormik.handleChange,
            onFocus: () => profileFormik.setFieldTouched('firstName', true),
            onBlur: () => profileFormik.setFieldTouched('firstName', false),
        }, {
            fieldName: 'Ngày sinh:',
            name: 'dateOfBirth',
            small: true,
            value: profileFormik.values.dateOfBirth,
            errorMessage: profileFormik.errors.dateOfBirth,
            touched: profileFormik.touched.dateOfBirth,
            onChange: profileFormik.handleChange,
            onFocus: () => profileFormik.setFieldTouched('dateOfBirth', true),
            onBlur: () => profileFormik.setFieldTouched('dateOfBirth', false),
        }, {
            fieldName: 'Số điện thoại:',
            name: 'phoneNumber',
            small: true,
            value: profileFormik.values.phoneNumber,
            errorMessage: profileFormik.errors.phoneNumber,
            touched: profileFormik.touched.phoneNumber,
            onChange: profileFormik.handleChange,
            onFocus: () => profileFormik.setFieldTouched('phoneNumber', true),
            onBlur: () => profileFormik.setFieldTouched('phoneNumber', false),
        }, {
            fieldName: 'Email:',
            name: 'email',
            large: true,
            readOnly: true,
            value: profileFormik.values.email,
            errorMessage: profileFormik.errors.email,
            touched: profileFormik.touched.email,
            onChange: profileFormik.handleChange,
            onFocus: () => profileFormik.setFieldTouched('email', true),
            onBlur: () => profileFormik.setFieldTouched('email', false),
        }, {
            fieldName: 'Tên đăng nhập:',
            name: 'userName',
            large: true,
            readOnly: true,
            value: profileFormik.values.userName,
            errorMessage: profileFormik.errors.userName,
            touched: profileFormik.touched.userName,
            onChange: profileFormik.handleChange,
            onFocus: () => profileFormik.setFieldTouched('userName', true),
            onBlur: () => profileFormik.setFieldTouched('userName', false),
        }, {
            fieldName: 'Phân quyền:',
            name: 'role',
            small: true,
            readOnly: true,
            value: profileFormik.values.role,
            errorMessage: profileFormik.errors.role,
            touched: profileFormik.touched.role,
            onChange: profileFormik.handleChange,
            onFocus: () => profileFormik.setFieldTouched('role', true),
            onBlur: () => profileFormik.setFieldTouched('role', false),
        }
    ];

    const editPassowrdFormik = useFormik({
        initialValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
            currentPasswordType: 'password',
            newPasswordType: 'password',
            confirmPasswordType: 'password'
        },
        validationSchema: Yup.object({
            currentPassword: Yup.string().required().oneOf([user.currentUser.password, 'Mật khẩu hiện tại không chính xác']),
            newPassword: Yup.string().required().matches(/^[a-zA-Z0-9]{8,}$/, 'Mật khẩu phải chứa ít nhất 8 ký tự'),
            confirmPassword: Yup.string().required().oneOf([Yup.ref('newPassword'), 'Mật khẩu không khớp']),
        }),
        onSubmit: async (values) => {
            await dispatch(changePassword({
                email: email,
                password: values.newPassword
            }));

            handleCancelEditPassword();
        }
    });

    const EDIT_PASSWORD_INPUTS = [
        {
            fieldName: 'Mật khẩu hiện tại:',
            name: 'currentPassword',
            inputRef: changePasswordInputRef,
            rightIcon: <FontAwesomeIcon
                icon={faEye}
                onClick={() => editPassowrdFormik.setFieldValue('currentPasswordType', editPassowrdFormik.values.currentPasswordType === 'password' ? 'text' : 'password')}
            />,
            value: editPassowrdFormik.values.currentPassword,
            errorMessage: editPassowrdFormik.errors.currentPassword,
            touched: editPassowrdFormik.touched.currentPassword,
            type: editPassowrdFormik.values.currentPasswordType,
            onChange: editPassowrdFormik.handleChange,
            onFocus: () => editPassowrdFormik.setFieldTouched('currentPassword', true),
            onBlur: () => editPassowrdFormik.setFieldTouched('currentPassword', false),
        }, {
            fieldName: 'Mật khẩu mới:',
            name: 'newPassword',
            value: editPassowrdFormik.values.newPassword,
            rightIcon: <FontAwesomeIcon
                icon={faEye}
                onClick={() => editPassowrdFormik.setFieldValue('newPasswordType', editPassowrdFormik.values.newPasswordType === 'password' ? 'text' : 'password')}
            />,
            errorMessage: editPassowrdFormik.errors.newPassword,
            touched: editPassowrdFormik.touched.newPassword,
            type: editPassowrdFormik.values.newPasswordType,
            onChange: editPassowrdFormik.handleChange,
            onFocus: () => editPassowrdFormik.setFieldTouched('newPassword', true),
            onBlur: () => editPassowrdFormik.setFieldTouched('newPassword', false),
        }, {
            fieldName: 'Nhập lại mật khẩu mới:',
            name: 'confirmPassword',
            value: editPassowrdFormik.values.confirmPassword,
            rightIcon: <FontAwesomeIcon
                icon={faEye}
                onClick={() => editPassowrdFormik.setFieldValue('confirmPasswordType', editPassowrdFormik.values.confirmPasswordType === 'password' ? 'text' : 'password')}
            />,
            errorMessage: editPassowrdFormik.errors.confirmPassword,
            touched: editPassowrdFormik.touched.confirmPassword,
            type: editPassowrdFormik.values.confirmPasswordType,
            onChange: editPassowrdFormik.handleChange,
            onFocus: () => editPassowrdFormik.setFieldTouched('confirmPassword', true),
            onBlur: () => editPassowrdFormik.setFieldTouched('confirmPassword', false),
        }
    ];

    const handleActiveEditProfile = useCallback(() => {
        setActionAcitve(false);
        setEdit({ ...edit, isEditProfile: true });
        profileInputRef.current?.focus();
    }, []);

    const handleActiveChangePassword = useCallback(() => {
        setActionAcitve(false);
        setToastActive(false);
        setEdit({ ...edit, isEditPassword: true });
    }, []);

    useEffect(() => {
        if (user.status === 'Đổi mật khẩu thành công') {
            setToastActive(true);
            return;
        }

        setToastActive(false);
    }, [user.status]);

    useEffect(() => {
        edit.isEditPassword && changePasswordInputRef.current?.focus();
    }, [edit.isEditPassword]);

    const handleCancelEditPassword = useCallback(() => {
        editPassowrdFormik.setValues(editPassowrdFormik.initialValues);
        editPassowrdFormik.setErrors(editPassowrdFormik.initialErrors);
        editPassowrdFormik.setTouched(editPassowrdFormik.initialTouched);
        setEdit({ ...edit, isEditPassword: false });
        setActionAcitve(true);
    }, []);

    const handleCancelEditProfile = useCallback(() => {
        profileFormik.setErrors(profileFormik.initialErrors);
        profileFormik.setTouched(profileFormik.initialTouched);
        setEdit({ ...edit, isEditProfile: false });
        setActionAcitve(true);
    }, []);

    return (
        <div className={cx('profile-container')}>
            <header><h3>Thông tin cơ bản</h3></header>
            <div className={cx('profile')}>
                <div className={cx('profile__avatar')}>
                    <Image
                        edit
                        src={avatar}
                        alt='avt-admin'
                        width={273}
                        height={280}
                        type={edit.isEditProfile ? 'upload' : 'img'}
                    />
                    <p>{firstName} {lastName}</p>
                </div>
                <div className={cx('profile__info', edit.isEditProfile && 'active')}>
                    <Form
                        visible={true}
                        onSubmit={profileFormik.handleSubmit}
                    >
                        <div className={cx('form__input-small')}>
                            <Input inputRef={profileInputRef} {...PROFILE_INPUTS[0]} />
                            <Input {...PROFILE_INPUTS[1]} />
                        </div>
                        <div className={cx('form__input-small')}>
                            <Input {...PROFILE_INPUTS[2]} />
                            <Input {...PROFILE_INPUTS[3]} />
                        </div>
                        <Input {...PROFILE_INPUTS[4]} />
                        <Input {...PROFILE_INPUTS[5]} />
                        <Input {...PROFILE_INPUTS[6]} style={{ textTransform: 'capitalize' }} />
                        <div className={cx('form__button')}>
                            {edit.isEditProfile && <>
                                <Button
                                    small
                                    outline
                                    type="button"
                                    onClick={() => {
                                        profileFormik.setValues(profileFormik.initialValues);
                                        handleCancelEditProfile();
                                    }}
                                >
                                    Hủy
                                </Button>
                                <Button
                                    small
                                    type="submit"
                                    onClick={() => { }}
                                >
                                    Lưu
                                </Button>
                            </>}
                        </div>
                    </Form>
                </div>
                <Form
                    className={cx('form_edit-password')}
                    visible={edit.isEditPassword}
                    title='Thay đổi mật khẩu'
                    type='dialog'
                    onSubmit={editPassowrdFormik.handleSubmit}
                >
                    {EDIT_PASSWORD_INPUTS.map(input => (
                        <Input
                            key={input.name}
                            medium
                            {...input}
                        />
                    ))}
                    <Button
                        small
                        outline
                        type="button"
                        onClick={handleCancelEditPassword}
                    >
                        Hủy
                    </Button>
                    <Button
                        small
                        type="submit"
                        onClick={() => { }}
                    >
                        Lưu
                    </Button>
                </Form>
                <Action visible={actionActive} placement="top-right" data={actionData} />
            </div>
            <Loading visible={user.loading} />
            <Toast
                duration={800}
                visible={toastActive}
                type='success'
                message='Đổi mật khẩu thành công!'
                icon={<FontAwesomeIcon icon={faCheckCircle} />}
            />
        </div>
    );
}

export default ProfilePage;