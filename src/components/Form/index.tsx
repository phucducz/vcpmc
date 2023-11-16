import classNames from "classnames/bind";
import { ReactNode } from "react";

import style from './Form.module.scss';

const cx = classNames.bind(style);

type FormProps = {
    visible: boolean;
    title: string;
    subTitle?: string;
    children: ReactNode;
    className?: string;
    onSubmit?: () => void
}

export const Form = ({ className, visible, title, subTitle, children, onSubmit }: FormProps) => {
    return (
        <form className={cx('form', visible && 'active', className)} onSubmit={onSubmit}>
            <h3 className={cx('form__title')}>{title}</h3>
            {subTitle && <p className={cx('form__sub-title')}>{subTitle}</p>}
            <div className={cx('form__input')}>{children}</div>
        </form>
    );
}