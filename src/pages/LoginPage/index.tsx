import classNames from "classnames/bind";
import { useFormik } from "formik";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import style from './Login.module.scss';
import Input, { InputProps } from "~/components/Input";
import { RootState, useAppDispatch } from "~/store";
import { Yup } from "~/contants";
import { login } from "~/thunk/userThunk";
import logo from '~/images/logo.png';
import { Form } from "~/components/Form";
import { CheckBox } from "~/components/CheckBox";
import { Button } from "~/components/Button";
import Loading from "~/components/Loading";
import Image from "~/components/Image";
import { routes } from "~/config/routes";

const cx = classNames.bind(style);

type LoginInputProps = InputProps;

export const LoginPage = () => {
    const user = useSelector((state: RootState) => state.user);
    const role = useSelector((state: RootState) => state.role);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    console.log(user);
    
    const [saveLogin, setSaveLogin] = useState(false);
    const [passwordType, setPasswordType] = useState('password');
    const [errorMessage, setErrorMessage] = useState('');
    const [toggleLogin, setToggleLogin] = useState(true);
    const [loading, setLoading] = useState<boolean>(false);

    const loginFormik = useFormik({
        initialValues: {
            // userName: '',
            // password: '',
            userName: user.currentUser.userName || '',
            password: user.currentUser.password || '',
            status: user.status
        },
        validationSchema: Yup.object({
            userName: Yup.string().required(),
            password: Yup.string().required(),
        }),
        onSubmit: async (user) => {
            const { userName, password } = user;

            loginFormik.setFieldValue('status', '');

            dispatch(login({
                userName: userName,
                password: password,
                navigate: () => navigate(`/record-management`),
                role: role.roleList
            }));
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
            onBlur: () => loginFormik.setFieldTouched('userName', false)
        }, {
            fieldName: 'Password',
            name: 'password',
            value: loginFormik.values.password,
            errorMessage: loginFormik.errors.password,
            rightIcon: faEye,
            type: passwordType,
            touched: loginFormik.touched.password,
            onChange: loginFormik.handleChange,
            onRightIconClick: () => handleRightIconClick(),
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
        if (role.loading) setLoading(true);
        else if (user.loading) setLoading(true);
        else if (!role.loading) setLoading(false);
        else if (!user.loading) setLoading(false);
    }, [user.loading, role.loading]);

    useEffect(() => {
        loginFormik.setFieldValue('status', user.status);
    }, [user.status]);

    const handleCheckValue = () => {
        if (loginFormik.values.userName === '' && loginFormik.values.password === '')
            setErrorMessage('Hãy nhập tài khoản và mật khẩu');
        else if (loginFormik.values.userName === '')
            setErrorMessage('Hãy nhập tài khoản');
        else if (loginFormik.values.password === '')
            setErrorMessage('Hãy nhập mật khẩu');
        else setErrorMessage(loginFormik.values.status);
    }

    useEffect(() => {
        if (!Object.keys(loginFormik.touched).length) return;

        handleCheckValue();
    }, [loginFormik.values]);

    return (
        <div className={cx('login-container')}>
            <Image src={logo} alt='logo' width={240} />
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
                    onClick={() => handleCheckValue()}
                >
                    Đăng nhập
                </Button>
                <Link
                    className={cx('login-form__recovery-password')}
                    to={routes.RecoverPage}
                    onClick={() => setToggleLogin(!toggleLogin)}
                >
                    Quên mật khẩu?
                </Link>
            </Form>
            <Loading visible={loading} />
        </div>
    );
}