import classNames from "classnames/bind";
import { memo } from "react";

import { ActionDataType } from "..";
import style from './Item.module.scss';

const cx = classNames.bind(style);

type ItemProps = ActionDataType & { className: string };

export const Item = memo(({ icon, title, onClick, className }: ItemProps) => {
    return (
        <div className={cx('action__item', className)} onClick={() => onClick(title)}>
            <div className={cx('action__item__icon')}>{icon}</div>
            <div className={cx('action__item__title')}><p>{title}</p></div>
        </div>
    );
});