import classNames from "classnames/bind";
import { memo } from "react";

import style from './Item.module.scss';
import { ActionDataType } from "..";

const cx = classNames.bind(style);

type ItemProps = ActionDataType;

export const Item = memo(({ icon, title, onClick }: ItemProps) => {
    return (
        <div className={cx('action__item')} onClick={onClick}>
            <div className={cx('action__item__icon')}>{icon}</div>
            <div className={cx('action__item__title')}><p>{title}</p></div>
        </div>
    );
});