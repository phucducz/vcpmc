import classNames from "classnames/bind";
import { memo } from "react";

import { ActionDataType } from "..";
import style from './Item.module.scss';

const cx = classNames.bind(style);

type ItemProps<E extends React.ElementType<any>> = ActionDataType<E> & { className: string };

export const Item = memo(<E extends React.ElementType<any>>({ icon, title, onClick, className, as, ...props }: ItemProps<E>) => {
    const Component = as || 'div';

    return (
        <Component className={cx('action__item', className)} onClick={() => onClick(title)} {...props}>
            <div className={cx('action__item__icon')}>{icon}</div>
            <div className={cx('action__item__title')}><p>{title}</p></div>
        </Component>
    );
});