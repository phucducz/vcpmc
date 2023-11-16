import classNames from "classnames/bind";

import style from './NoFound.module.scss';
import { Language } from "../../../components/Language";
import { languages } from "../../../contants";
import { Logo } from "../../../components/Logo";
import { Form } from "../../../components/Form";
import { Button } from "../../../components/Button";
import { Link } from "react-router-dom";

const cx = classNames.bind(style);

export const NoFoundPage = () => {
    return (
        <div className={cx("no-found-container")}>
            <Language languages={languages} placement='top-right' />
            <div className={cx('content')}>
                <Logo />
                <Form
                    visible={true}
                    title='Không thể kết nối !!'
                    subTitle='Dường như đã có chút trục trặc hoặc link này 
                    đã hết hạn. Vui lòng thử lại hoặc yêu cầu gửi lại link 
                    để đặt lại mật khẩu của bạn.'
                    className={cx('no-found__form')}
                >
                    <Button className={cx('resend-button')} onClick={() => { }}>
                        Yêu cầu gửi lại link
                    </Button>
                    <Link
                        className={cx('back-to-login')}
                        to='/login'
                    >
                        Quay lại đăng nhập
                    </Link>
                </Form>
            </div>
        </div>
    );
}