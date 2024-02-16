import classNames from "classnames/bind";
import { ReactNode, memo, useEffect, useRef } from "react";

import { Icon, checkIcon } from "~/icons";
import style from './Toast.module.scss';

const cx = classNames.bind(style);

type Type = 'success' | 'fail';

type ToastProps = {
    icon?: ReactNode;
    message: string;
    type?: Type;
    visible: boolean;
    setVisible?: React.Dispatch<React.SetStateAction<boolean>>;
    onSuccess?: () => void;
    duration: number;
}

export const Toast = memo(({ duration, icon, message, type = 'success', visible, setVisible, onSuccess }: ToastProps) => {
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
                onSuccess && onSuccess();
            }, durationTime);

            return () => clearTimeout(id);
        }
        else if (toastRef.current)
            toastRef.current.setAttribute('class', cx('toast-container'));
    }, [visible]);

    return (
        <div ref={toastRef} className={cx('toast-container', type)}>
            <div className={cx('toast-content')}>
                {icon || <Icon icon={checkIcon} />}
                <p>{message}</p>
            </div>
        </div>
    );
})