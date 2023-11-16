import classNames from "classnames/bind";
import { useFormik } from "formik";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import style from './ResetPass.module.scss';
import { Language } from "../../components/Language";
import { Yup, languages } from "../../contants";
import { Logo } from "../../components/Logo";
import { Form } from "../../components/Form";
import Input from "../../components/Input";
import { Button } from "../../components/Button";
import { changePassword } from "../../thunk/userThunk";
import { useAppDispatch } from "../../store";
import { getUserById } from "../../api/user";
import { setDataUser } from "../../reducers/user";

const cx = classNames.bind(style);

type ResetPasswordType = {
    password: string;
    confirmPassword: string;
}

const initialPassword: ResetPasswordType = {
    password: '',
    confirmPassword: ''
}

export const ResetPassPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [inputType, setInputType] = useState<ResetPasswordType>({
        password: 'password',
        confirmPassword: 'password'
    });

    const resetPassFormik = useFormik({
        initialValues: initialPassword,
        validationSchema: Yup.object({
            password: Yup.string().required(),
            confirmPassword: Yup.string().required()
        }),
        onSubmit: async (values) => {
            await dispatch(changePassword({
                id: id || '1',
                password: values.password,
                navigate: () => navigate('/login')
            }));
        }
    });

    const RESETPASS_INPUTS = [
        {
            name: "password",
            fieldName: "Mật khẩu mới:",
            value: resetPassFormik.values.password,
            touched: resetPassFormik.touched.password,
            errorMessage: resetPassFormik.errors.password,
            rightIcon: faEye,
            type: inputType.password,
            onChange: resetPassFormik.handleChange,
            onBlur: () => resetPassFormik.setFieldTouched('password', false),
            onFocus: () => resetPassFormik.setFieldTouched('password', true),
            rightIconClick: () => setInputType(prev => ({
                ...prev,
                password: prev.password === 'password' ? 'text' : 'password'
            }))
        }, {
            name: "confirmPassword",
            fieldName: "Nhập lại mật khẩu mới:",
            value: resetPassFormik.values.confirmPassword,
            touched: resetPassFormik.touched.confirmPassword,
            errorMessage: resetPassFormik.errors.confirmPassword,
            rightIcon: faEye,
            type: inputType.confirmPassword,
            onChange: resetPassFormik.handleChange,
            onBlur: () => resetPassFormik.setFieldTouched('confirmPassword', false),
            onFocus: () => resetPassFormik.setFieldTouched('confirmPassword', true),
            rightIconClick: () => setInputType(prev => ({
                ...prev,
                confirmPassword: prev.confirmPassword === 'password' ? 'text' : 'password'
            }))
        }
    ];

    useEffect(() => {
        const fetchUserById = async (id: string) => {
            const result = await getUserById(id);
            console.log(result);
            dispatch(setDataUser(result));
        }

        id && fetchUserById(id);
    }, []);

    return (
        <div className={cx('reset-container')}>
            <Language languages={languages} placement='top-right' />
            <div className={cx('content')}>
                <Logo />
                <Form
                    visible={true}
                    title="Đặt lại mật khẩu"
                    onSubmit={resetPassFormik.handleSubmit}
                >
                    {RESETPASS_INPUTS.map((input, index) => (
                        <Input key={index} medium {...input} />
                    ))}
                    <Button
                        as='button'
                        type="submit"
                        onClick={() => { }}
                    >
                        Lưu mật khẩu
                    </Button>
                </Form>
            </div>
        </div>
    );
}