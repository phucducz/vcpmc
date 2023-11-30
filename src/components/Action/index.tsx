import classNames from "classnames/bind";
import { ReactNode, memo } from "react";

import style from './Action.module.scss';
import { Item } from "./Item";

const cx = classNames.bind(style);

type HorizontalPosition = 'center' | 'top' | 'bottom';
type VerticalPosition = 'center' | 'left' | 'right';

export type ActionDataType = {
    icon: ReactNode;
    title: ReactNode;
    onClick?: () => void;
    disable?: boolean;
}

type ActionProps = {
    data: Array<ActionDataType>;
    className?: string;
    href?: string;
    placement?: Exclude<`${HorizontalPosition}-${VerticalPosition}`, 'center-center'> | 'center';
    visible?: boolean;
}

export const Action = memo(({ data, className, placement = 'center', visible }: ActionProps) => {
    if (!className) className = '';

    return (
        <div
            className={cx('action-container', visible && 'active', {
                [className]: className,
                [placement]: placement
            })}
        >
            {data.map((item: ActionDataType, index: number) => (
                <Item
                    key={index}
                    icon={item.icon}
                    title={item.title}
                    onClick={!item.disable ? item.onClick : () => { }}
                    className={cx(item.disable && 'disable')}
                />
            ))}
        </div>
    );
});