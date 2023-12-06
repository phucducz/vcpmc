import classNames from "classnames/bind";
import { memo, useState } from "react";

import style from './Switch.module.scss';

const cx = classNames.bind(style);

type SwitchProps = {
    status: boolean;
    onClick?: () => void;
}

export const Switch = memo(({ status, onClick }: SwitchProps) => {
    return (
        <div className={cx('switch-container')}>
            <div className={cx('switch__button', status ? 'switch__on' : 'switch__off')} onClick={onClick}>
                <span></span>
            </div>
            <p className={cx('title')}>Chế độ công khai</p>
        </div>
    );
})