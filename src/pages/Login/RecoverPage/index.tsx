import classNames from "classnames/bind";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { sendPasswordToResetEmail } from "~/api/loginAPI";
import { Button } from "~/components/Button";
import { Form } from "~/components/Form";
import { Input } from "~/components/Input";
import Loading from "~/components/Loading";
import { Logo } from "~/components/Logo";
import { routes } from "~/config/routes";
import { Yup } from "~/constants";
import style from './Recover.module.scss';

const cx = classNames.bind(style);

function RecoverPage() {
    const [confirmSuccess, setConfirmSuccess] = useState(true);
    const [loading, setLoading] = useState<boolean>(false);

    const recoverFormik = useFormik({
        initialValues: {
            emailAddress: ''
        },
        validationSchema: Yup.object({
            emailAddress: Yup.string()
                .required("Không được để trống")
                .matches(/^\S+@\S+\.\S+$/, "Vui lòng nhập địa chỉ đúng định dạng"),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            await sendPasswordToResetEmail(values.emailAddress);
            setLoading(false);
            setConfirmSuccess(false);
        }
    });

    useEffect(() => {
        document.title = 'Quên mật khẩu | Không thể đăng nhập';
    }, []);

    return (
        <div className={cx('recover-container')}>
            {/* <Image src={logo} alt='logo' width={240} /> */}
            <Logo width={240} />
            <Form
                visible={true}
                title="Khôi phục mật khẩu"
                onSubmit={recoverFormik.handleSubmit}
            >
                <div className={cx('recover-form__container', confirmSuccess && 'active')}>
                    <p>Vui lòng nhập địa chỉ email đã đăng ký để yêu cầu khôi phục mật khẩu</p>
                    <div className={cx('recover-form__container__input')}>
                        <Input
                            name="emailAddress"
                            fieldName="Email"
                            type='text'
                            style={{ width: '59.8rem' }}
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
                    to={routes.LoginPage}
                >
                    Quay lại đăng nhập
                </Link>
            </Form>
            <Loading visible={loading} />
        </div>
    );
}

export default RecoverPage;