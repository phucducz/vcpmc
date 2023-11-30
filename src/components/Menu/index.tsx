import classNames from "classnames/bind";
import { memo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";

import style from './Menu.module.scss';
import { DropDown } from "../DropDown";
import { Icon } from "~/icons";

const cx = classNames.bind(style);

export type ItemProps = {
    id?: number;
    icon?: any;
    title: string;
    className?: string;
    onClick: () => void;
    children?: Array<ItemProps>
}

const Item = memo(({ icon, title, children, className, onClick }: ItemProps) => {
    return (
        <li className={cx('menu-container__item', className)} onClick={onClick}>
            <Icon icon={icon} />
            <p>{title}</p>
            {children && (
                <>
                    <FontAwesomeIcon className={cx('item__icon-ellipsis-v')} icon={faEllipsisV} />
                    <DropDown placement="top-right" data={children} />
                </>
            )}
        </li>
    );
})

type MenuProps = {
    data: Array<Omit<ItemProps, 'className'>>;
    active: number;
}

export const Menu = memo(({ data, active }: MenuProps) => {
    return (
        <ul className={cx('menu-container')}>
            {data.map(item =>
                <Item
                    className={active === item.id ? 'active' : ''}
                    key={item.id}
                    icon={item.icon}
                    title={item.title}
                    children={item.children}
                    onClick={item.onClick}
                />
            )}
        </ul>
    );
});