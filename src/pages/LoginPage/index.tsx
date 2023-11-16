import classNames from "classnames/bind";
import { useFormik } from "formik";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import * as Yup from 'yup';

import style from './Login.module.scss';
import Input, { InputProps } from "../../components/Input";
import { CheckBox } from "../../components/CheckBox";
import { Button } from "../../components/Button";
import { Language } from "../../components/Language";
import { languages } from "../../contants";
import { Form } from "../../components/Form";
import { Logo } from "../../components/Logo";
import { checkLogin } from "../../api/user";

const cx = classNames.bind(style);

let initialRecover: {
    emailAddress: string
} = {
    emailAddress: ''
};

type LoginInputProps = InputProps;

export const LoginPage = () => {
    const user = useSelector((state: any) => state.user);
    console.log(user);
    
    const [saveLogin, setSaveLogin] = useState(false);
    const [passwordType, setPasswordType] = useState('password');
    const [errorMessage, setErrorMessage] = useState('');
    const [toggleLogin, setToggleLogin] = useState(true);
    const [confirmSuccess, setConfirmSuccess] = useState(true);
    
    const recoverFormik = useFormik({
        initialValues: initialRecover,
        validationSchema: Yup.object({
            emailAddress: Yup.string()
                .required("Không được để trống")
                .matches(/^\S+@\S+\.\S+$/, "Vui lòng nhập địa chỉ đúng định dạng"),
        }),
        onSubmit: () => {
            setConfirmSuccess(false);
        }
    });

    const loginFormik = useFormik({
        initialValues: {
            userName: '',
            password: ''
        },
        validationSchema: Yup.object({
            userName: Yup.string().required(),
            password: Yup.string().required(),
        }),
        onSubmit: async (user) => {
            const result = await checkLogin(user.userName, user.password);

            if (!result)
                setErrorMessage('Sai tên đăng nhập hoặc mật khẩu');
            else setErrorMessage('');
        }
    });

    const LOGIN_INPUTS: Array<LoginInputProps> = [
        {
            fieldName: 'Tên đăng nhập',
            name: 'userName',
            value: loginFormik.values.userName,
            errorMessage: loginFormik.errors.userName,
            touched: loginFormik.touched.userName,
            onChange: loginFormik.handleChange,
            onFocus: () => loginFormik.setFieldTouched('userName', true),
            onBlur: () => loginFormik.setFieldTouched('userName', false),
        }, {
            fieldName: 'Password',
            name: 'password',
            value: loginFormik.values.password,
            errorMessage: loginFormik.errors.password,
            rightIcon: faEye,
            type: passwordType,
            touched: loginFormik.touched.password,
            onChange: loginFormik.handleChange,
            rightIconClick: () => handleRightIconClick(),
            onFocus: () => loginFormik.setFieldTouched('password', true),
            onBlur: () => loginFormik.setFieldTouched('password', false)
        }
    ];

    const handleRightIconClick = () => {
        passwordType === 'password'
            ? setPasswordType('text')
            : setPasswordType('password');
    }

    useEffect(() => {
        if (Object.keys(loginFormik.touched).length < 2
            || Object.keys(loginFormik.errors).length === 0) {
            setErrorMessage('');
            return;
        }

        if (loginFormik.errors.userName && loginFormik.errors.password)
            setErrorMessage('Hãy nhập tài khoản và mật khẩu');
        else if (loginFormik.errors.userName)
            setErrorMessage('Hãy nhập tài khoản');
        else if (loginFormik.errors.password)
            setErrorMessage('Hãy nhập mật khẩu');
        else setErrorMessage('');
    }, [loginFormik.errors, loginFormik.touched]);

    useEffect(() => {
        if (!toggleLogin && (loginFormik.values.userName === '' ||
            loginFormik.values.password === ''))
            return;
        if (toggleLogin && recoverFormik.values.emailAddress === '')
            return;

        loginFormik.setValues({ userName: '', password: '' });
        recoverFormik.setValues({ emailAddress: '' });
    }, [toggleLogin]);

    useEffect(() => {
        loginFormik.setValues({
            userName: user.currentUser.userName,
            password: user.currentUser.password
        });
    }, [user.currentUser]);

    const handleToggleLogin = () => {
        setConfirmSuccess(true);
        setToggleLogin(!toggleLogin)
    }

    return (
        <div className={cx('login-container')}>
            <Language languages={languages} placement='top-right' />
            <div className={cx('content')}>
                <Logo />
                <Form
                    visible={toggleLogin}
                    title='Đăng nhập'
                    onSubmit={loginFormik.handleSubmit}
                >
                    {LOGIN_INPUTS.map(item => (
                        <Input key={item.name} medium {...item} />
                    ))}
                    <p className={cx('error-message')}>{errorMessage}</p>
                    <CheckBox
                        title='Ghi nhớ đăng nhập'
                        checked={saveLogin}
                        onChange={() => setSaveLogin(!saveLogin)}
                    />
                    <Button
                        as='button'
                        type="submit"
                        className={cx('login-form__submit')}
                        onClick={() => { }}
                    >
                        Đăng nhập
                    </Button>
                    <Link
                        className={cx('login-form__recovery-password')}
                        to='/login'
                        onClick={() => setToggleLogin(!toggleLogin)}
                    >
                        Quên mật khẩu?
                    </Link>
                </Form>
                <Form
                    visible={!toggleLogin}
                    title="Khôi phục mật khẩu"
                    onSubmit={recoverFormik.handleSubmit}
                >
                    <div className={cx('recover-form__container', confirmSuccess && 'active')}>
                        <p>Vui lòng nhập địa chỉ email đã đăng ký để yêu cầu khôi phục mật khẩu</p>
                        <div className={cx('recover-form__container__input')}>
                            <Input
                                medium
                                name="emailAddress"
                                fieldName="Email"
                                value={recoverFormik.values.emailAddress}
                                touched={recoverFormik.touched.emailAddress}
                                errorMessage={recoverFormik.errors.emailAddress}
                                onChange={recoverFormik.handleChange}
                                onBlur={() => recoverFormik.setFieldTouched('emmailAddress', false)}
                                onFocus={() => recoverFormik.setFieldTouched('emmailAddress', true)}
                            />
                            <p className={cx('error-message')}>{recoverFormik.errors.emailAddress}</p>
                            <Button
                                as='button'
                                type="submit"
                                className={cx('recover-form__container__submit')}
                                onClick={() => { }}
                            >
                                Xác nhận
                            </Button>
                        </div>
                    </div>
                    <div className={cx('recover-form__message', !confirmSuccess && 'active')}>
                        <p>Link khôi phục mật khẩu đã được gửi vào mail của bạn. Vui lòng kiểm tra mail.</p>
                        <p>Click vào đường link được đính kèm trong mail để chuyển đến trang đặt lại mật khẩu.</p>
                    </div>
                    <Link
                        className={cx('recover-form__back-login')}
                        to='/login'
                        onClick={handleToggleLogin}
                    >
                        Quay lại đăng nhập
                    </Link>
                </Form>
            </div>
        </div>
    );
}