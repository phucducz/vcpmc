import classNames from "classnames/bind";

import style from './Item.module.scss';
import { ItemProps } from "..";

const cx = classNames.bind(style);

type ItemOwnProps = ItemProps

export const Item = ({ title, onClick }: ItemOwnProps) => {
    return (
        <li className={cx('item')} onClick={onClick}>
            <p>{title}</p>
        </li>
    );
}