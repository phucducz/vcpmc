import classNames from "classnames/bind";

import { Link } from "react-router-dom";
import { Button } from "~/components/Button";
import { Form } from "~/components/Form";
import { Logo } from "~/components/Logo";
import style from './NoFound.module.scss';

const cx = classNames.bind(style);

function NoFoundPage() {
    return (
        <div className={cx("no-found-container")}>
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
    );
}

export default NoFoundPage;