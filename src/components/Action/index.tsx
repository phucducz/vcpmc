import classNames from "classnames/bind";
import { ReactNode, memo, useState } from "react";

import style from './Action.module.scss';
import { Item } from "./Item";

const cx = classNames.bind(style);

type HorizontalPosition = 'center' | 'top' | 'bottom';
type VerticalPosition = 'center' | 'left' | 'right';

export type ActionDataType<E extends React.ElementType<any>> = {
    icon: ReactNode;
    title: string;
    to?: string;
    onClick(title?: string): void;
    as?: E;
    href?: string;
    disable?: boolean;
}

type ActionProps<E extends React.ElementType<any>> = {
    data: Array<ActionDataType<E>>;
    className?: string;
    placement?: Exclude<`${HorizontalPosition}-${VerticalPosition}`, 'center-center'> | 'center';
    visible?: boolean;
    onClick?: () => void;
}

export const Action = memo(<E extends React.ElementType<any>>({ data, className, placement = 'center', visible, onClick }: ActionProps<E>) => {
    if (!className) className = '';

    return (
        <div
            className={cx('action-container', visible && 'active', {
                [className]: className,
                [placement]: placement
            })}
            onClick={onClick}
        >
            {data.map((item, index: number) => {
                const { icon, title, onClick } = item;

                return (
                    <Item
                        key={index}
                        icon={icon}
                        title={title}
                        onClick={onClick}
                        as={item.as || 'div'}
                        href={item.href}
                        className={cx(item.disable && 'disable')}
                    />
                )
            })}
        </div>
    );
});