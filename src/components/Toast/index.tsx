import classNames from "classnames/bind";
import { ReactNode, memo, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import style from './Toast.module.scss';
import { faCheckCircle, faCircleExclamation } from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(style);

type Type = 'success' | 'fail';

type ToastProps = {
    icon?: ReactNode;
    message: string;
    type?: Type;
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    duration: number;
}

export const Toast = memo(({ duration, icon, message, type = 'success', visible, setVisible }: ToastProps) => {
    const toastRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (visible) {
            let durationTime = duration + 200;

            if (toastRef.current)
                toastRef.current.setAttribute('class', cx('toast-container', `${type}`, 'active'));

            const id = setTimeout(() => {
                if (toastRef.current)
                    toastRef.current.setAttribute('class', cx('toast-container', `${type}`));
                    setVisible && setVisible(false);
            }, durationTime);

            return () => clearTimeout(id);
        }
        else if (toastRef.current)
            toastRef.current.setAttribute('class', cx('toast-container'));
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