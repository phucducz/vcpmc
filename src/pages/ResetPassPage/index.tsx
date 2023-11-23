import classNames from "classnames/bind";
import { useFormik } from "formik";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

import style from './ResetPass.module.scss';
import { useAppDispatch } from "~/store";
import { Yup } from "~/constants";
import { changePassword } from "~/thunk/userThunk";
import { getUserById } from "~/api/userAPI";
import { setDataUser } from "~/reducers/user";
import { Logo } from "~/components/Logo";
import { Form } from "~/components/Form";
import Input from "~/components/Input";
import { Button } from "~/components/Button";
import Loading from "~/components/Loading";
import { useQuery } from "~/context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
    const params = useQuery();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const user = useSelector((state: any) => state.user);

    const [inputType, setInputType] = useState<ResetPasswordType>({
        password: 'password',
        confirmPassword: 'password'
    });

    const resetPassFormik = useFormik({
        initialValues: initialPassword,
        validationSchema: Yup.object({
            password: Yup
                .string()
                .required()
                .matches(/^[a-zA-Z0-9]{8,}$/, 'Mật khẩu phải chứa ít nhất 8 ký tự'),
            confirmPassword: Yup.string().required().oneOf([Yup.ref('password')], 'Mật khẩu không khớp')
        }),
        onSubmit: async (values) => {
            await dispatch(changePassword({
                email: params.get('emailAddress') || '',
                password: values.password,
                navigate: () => navigate('/login')
            }));
        }
    });
    console.log(resetPassFormik.errors);

    const RESETPASS_INPUTS = [
        {
            name: "password",
            fieldName: "Mật khẩu mới:",
            value: resetPassFormik.values.password,
            touched: resetPassFormik.touched.password,
            errorMessage: resetPassFormik.errors.password,
            rightIcon: <FontAwesomeIcon icon={faEye} />,
            type: inputType.password,
            onChange: resetPassFormik.handleChange,
            onBlur: () => resetPassFormik.setFieldTouched('password', false),
            onFocus: () => resetPassFormik.setFieldTouched('password', true),
            onRightIconClick: () => setInputType(prev => ({
                ...prev,
                password: prev.password === 'password' ? 'text' : 'password'
            }))
        }, {
            name: "confirmPassword",
            fieldName: "Nhập lại mật khẩu mới:",
            value: resetPassFormik.values.confirmPassword,
            touched: resetPassFormik.touched.confirmPassword,
            errorMessage: resetPassFormik.errors.confirmPassword,
            rightIcon: <FontAwesomeIcon icon={faEye} />,
            type: inputType.confirmPassword,
            onChange: resetPassFormik.handleChange,
            onBlur: () => resetPassFormik.setFieldTouched('confirmPassword', false),
            onFocus: () => resetPassFormik.setFieldTouched('confirmPassword', true),
            onRightIconClick: () => setInputType(prev => ({
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

        // id && fetchUserById(id);
    }, []);

    return (
        <div className={cx('reset-container')}>
            <Logo />
            <Form
                visible={true}
                title="Đặt lại mật khẩu"
                onSubmit={resetPassFormik.handleSubmit}
            >
                {RESETPASS_INPUTS.map((input, index) => (
                    <Input
                        key={index}
                        medium
                        {...input}
                    />
                ))}
                <Button
                    as='button'
                    type="submit"
                    onClick={() => { }}
                >
                    Lưu mật khẩu
                </Button>
            </Form>
            <Loading visible={user.loading} />
        </div>
    );
}