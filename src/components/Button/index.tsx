import classNames from "classnames/bind";
import { ReactNode, memo } from "react";

import style from './Button.module.scss';
import { Position } from "~/types";

const cx = classNames.bind(style);

type PropsOwnButton<E extends React.ElementType> = {
    to?: string; type?: string; className?: string;
    tiny?: boolean; small?: boolean; children?: string;
    large?: boolean; rounded?: boolean; outline?: boolean;
    cancel?: boolean; deleteb?: boolean; primary?: boolean;
    disable?: boolean; create?: boolean; finished?: boolean;
    rightIcon?: ReactNode; leftIcon?: ReactNode; onClick: () => void;
    placement?: Position;
    as?: E;
} & React.ComponentProps<'button'>;

type ButtonProps<E extends React.ElementType> =
    PropsOwnButton<E> & Omit<React.ComponentProps<E>, keyof PropsOwnButton<E>>;

export const Button = memo(<E extends React.ElementType>({
    to,
    children,
    className,
    tiny = false,
    small = false,
    large = false,
    rounded = false,
    outline = false,
    cancel = false,
    deleteb = false,
    primary = false,
    disable = false,
    create = false,
    finished = false,
    rightIcon,
    leftIcon,
    onClick,
    placement,
    as,
    ...passProps
}: ButtonProps<E>): any => {
    const Component = as || 'button';
    
    const props = {
        onClick,
        ...passProps
    }

    if (!className)
        className = '';

    const classes = cx('button', {
        [className]: className,
        large,
        small,
        rounded,
        outline,
        primary,
        cancel,
        deleteb,
        disable,
        finished,
        create
    });

    return (
        <Component
            className={classes}
            {...props}
            onClick={onClick}
        >
            {leftIcon && <span className={cx('button_icon')}>{leftIcon}</span>}
            {children && <span className={cx('title')}>{children}</span>}
            {rightIcon && <span className={cx('button_icon')}>{rightIcon}</span>}
        </Component>
    )
});