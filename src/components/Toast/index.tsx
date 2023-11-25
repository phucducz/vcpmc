import classNames from "classnames/bind";
import { ReactNode, memo, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-regular-svg-icons";

import style from './Toast.module.scss';

const cx = classNames.bind(style);

type Type = 'success' | 'fail';

type ToastProps = {
    icon?: ReactNode;
    message: string;
    type?: Type;
    visible: boolean;
    duration: number;
}

export const Toast = memo(({ duration, icon, message, type, visible }: ToastProps) => {
    const toastRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        if (visible) {
            if (toastRef.current)
                toastRef.current.setAttribute('class', cx('toast-container', `${type}`, 'active'));

            const id = setTimeout(() => {
                if (toastRef.current)
                    toastRef.current.setAttribute('class', cx('toast-container', `${type}`));
            }, 1000);

            return () => clearTimeout(id);
        }
    }, [visible]);

    return (
        <div ref={toastRef} className={cx('toast-container', type)}>
            <div className={cx('toast-content')}>
                {icon || <FontAwesomeIcon icon={faCheckCircle} />}
                <p>{message}</p>
            </div>
        </div>
    );
})