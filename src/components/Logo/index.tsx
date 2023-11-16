import classNames from "classnames/bind";

import style from './Logo.module.scss';
import logo from '../../images/logo.png';

const cx = classNames.bind(style);

export const Logo = () => {
    return (
        <div className={cx('logo')}>
            <img className={cx('logo__img')} src={logo} alt="logo-vcpmc" />
        </div>
    );
}