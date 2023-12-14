import classNames from "classnames/bind";
import { ReactNode, memo } from "react";

import style from './Action.module.scss';
import { Item } from "./Item";

const cx = classNames.bind(style);

type HorizontalPosition = 'center' | 'top' | 'bottom';
type VerticalPosition = 'center' | 'left' | 'right';

export type ActionDataType = {
    icon: ReactNode;
    title: string;
    // title: ReactNode;
    onClick(title?: string): void;
    disable?: boolean;
}

type ActionProps = {
    data: Array<ActionDataType>;
    className?: string;
    href?: string;
    placement?: Exclude<`${HorizontalPosition}-${VerticalPosition}`, 'center-center'> | 'center';
    visible?: boolean;
    onClick?: () => void;
}

export const Action = memo(({ data, className, placement = 'center', visible, onClick }: ActionProps) => {
    if (!className) className = '';

    return (
        <div
            className={cx('action-container', visible && 'active', {
                [className]: className,
                [placement]: placement
            })}
            onClick={onClick}
        >
            {data.map((item: ActionDataType, index: number) => {
                const { icon, title, onClick } = item;

                return (
                    <Item
                        key={index}
                        icon={icon}
                        title={title}
                        onClick={onClick}
                        className={cx(item.disable && 'disable')}
                    />
                )
            })}
        </div>
    );
});