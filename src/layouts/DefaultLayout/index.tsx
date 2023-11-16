import classNames from "classnames/bind";

import style from './LayoutStyle.module.scss';

const cx = classNames.bind(style);

export const DefaultLayout = () => {
    return (
        <div className={cx('container-layout')}>
            <div className={cx('header')}>

            </div>
        </div>
    );
}