import classNames from "classnames/bind";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faEye, faLock, faSignOut } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";

import style from './Profile.module.scss';
import Image from "~/components/Image";
import { RootState } from "~/store";
import { Form } from "~/components/Form";
import Input from "~/components/Input";
import { Action } from "~/components/Action";
import { Button } from "~/components/Button";
import { Yup } from "~/contants";

const cx = classNames.bind(style);

export const ProfilePage = () => {
    const user = useSelector((state: RootState) => state.user);
    const navigate = useNavigate();

    const changePasswordInputRef = useRef<HTMLInputElement>(null);
    const profileInputRef = useRef<HTMLInputElement>(null);

    const [edit, setEdit] = useState({
        isEditProfile: false,
        isEditPassword: false
    });

    const ACTION_DATA = [
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
    ];

    const { avatar, userName, lastName, firstName,
        dateOfBirth, phoneNumber, email, role } = user.currentUser;

    useEffect(() => {
        try {
            profileFormik.setFieldValue('role', role.role);
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
            role: '',
            userName: userName
        },
        validationSchema: Yup.object({
            avatar: Yup.string().required(),
            dateOfBirth: Yup.string().required(),
            email: Yup.string().required(),
            firstName: Yup.string().required(),
            lastName: Yup.string().required(),
            phoneNumber: Yup.string().required(),
            role: Yup.string().required(),
            userName: Yup.string().required()
        }),
        onSubmit: profile => {

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
            currentPassword: Yup.string().required(),
            newPassword: Yup.string().required(),
            confirmPassword: Yup.string().required(),
        }),
        onSubmit: values => {

        }
    });

    const EDIT_PASSWORD_INPUTS = [
        {
            fieldName: 'Mật khẩu hiện tại:',
            name: 'currentPassword',
            inputRef: changePasswordInputRef,
            rightIcon: faEye,
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
            rightIcon: faEye,
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
            rightIcon: faEye,
            errorMessage: editPassowrdFormik.errors.confirmPassword,
            touched: editPassowrdFormik.touched.confirmPassword,
            type: editPassowrdFormik.values.confirmPasswordType,
            onChange: editPassowrdFormik.handleChange,
            onFocus: () => editPassowrdFormik.setFieldTouched('confirmPassword', true),
            onBlur: () => editPassowrdFormik.setFieldTouched('confirmPassword', false),
        }
    ];

    const handleActiveEditProfile = () => {
        setEdit({ ...edit, isEditProfile: true });
        profileInputRef.current?.focus();
    }

    const handleActiveChangePassword = () => {
        setEdit({ ...edit, isEditPassword: true });
    }

    useEffect(() => {
        edit.isEditPassword && changePasswordInputRef.current?.focus();
    }, [edit.isEditPassword]);

    return (
        <div className={cx('profile-container')}>
            <header><h3>Thông tin cơ bản</h3></header>
            <div className={cx('profile')}>
                <div className={cx('profile__avatar')}>
                    <Image
                        edit
                        src={`../../images/${avatar}`}
                        alt='avt-admin'
                        width={273}
                        height={280}
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
                                    onClick={() => setEdit({ ...edit, isEditProfile: false })}
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
                    className={cx('form_edit-password',)}
                    visible={edit.isEditPassword}
                    title='Thay đổi mật khẩu'
                    onSubmit={editPassowrdFormik.handleSubmit}
                >
                    {EDIT_PASSWORD_INPUTS.map(input => (
                        <Input
                            key={input.name}
                            medium
                            {...input}
                            onRightIconClick={() => editPassowrdFormik.setFieldValue(`${input.name}Type`, input.type === 'password' ? 'text' : 'password')}
                        />
                    ))}
                    <Button
                        small
                        outline
                        type="button"
                        onClick={() => setEdit({ ...edit, isEditPassword: false })}
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
                <Action placement="top-right" data={ACTION_DATA} />
            </div>
        </div>
    );
}