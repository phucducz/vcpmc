import classNames from "classnames/bind";
import { ReactNode, useEffect, useRef } from "react";

import style from './Form.module.scss';

const cx = classNames.bind(style);

type FormType = 'form' | 'dialog';

type FormProps = {
    visible: boolean;
    title?: string;
    subTitle?: string;
    children: ReactNode;
    className?: string;
    type?: FormType;
    onSubmit?: () => void
}

export const Form = ({ className, visible, title, subTitle, children, type = 'form', onSubmit }: FormProps) => {
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (type !== 'dialog') return;

        if (visible) {
            if (formRef.current) {
                formRef.current.style.display = 'block';

                setTimeout(() => {
                    if (formRef.current) {
                        formRef.current.style.opacity = '1';
                        formRef.current.style.top = '50%';
                    }
                }, 100);
            }
        }
        else {
            if (formRef.current) {
                formRef.current.style.opacity = '0';
                formRef.current.style.top = '45%';

                setTimeout(() => {
                    if (formRef.current) formRef.current.style.display = 'none';
                }, 350);
            }
        }
    }, [visible]);

    return (
        <form
            ref={formRef}
            className={cx('form', visible && 'active', className, type === 'dialog' && 'form-dialog')}
            onSubmit={onSubmit}
        >
            {title && <h3 className={cx('form__title')}>{title}</h3>}
            {subTitle && <p className={cx('form__sub-title')}>{subTitle}</p>}
            <div className={cx('form__input')}>{children}</div>
        </form>
    );
}