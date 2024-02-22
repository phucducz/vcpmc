import classNames from "classnames/bind";

import style from './Logo.module.scss';

const cx = classNames.bind(style);

type LogoProps = {
    width?: number;
    height?: number;
    className?: string;
}

export const Logo = ({ width, height, className }: LogoProps) => {
    return (
        <div className={cx('logo', className)}>
            <img className={cx('logo__img')}
                src='https://res.cloudinary.com/dvlzvsyxs/image/upload/v1701141410/logo_ul3efy.png'
                alt="logo-vcpmc"
                style={{ width: `${width}px`, height: `${height}px` }}
            />
        </div>
    );
}