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
    onClick?: () => void
}

type ActionProps = {
    data: Array<ActionDataType>;
    className?: string;
    href?: string;
    placement?: Exclude<`${HorizontalPosition}-${VerticalPosition}`, 'center-center'> | 'center'
}

export const Action = memo(({ data, className, placement = 'center' }: ActionProps) => {
    if (!className) className = '';
    
    const classes = cx('action-container', {
        [className]: className,
        [placement]: placement
    });

    return (
        <div className={classes}>
            {data.map((item: ActionDataType, index: number) => (
                <Item
                    key={index}
                    icon={item.icon}
                    title={item.title}
                    onClick={item.onClick}
                />
            ))}
        </div>
    );
});