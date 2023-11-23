import classNames from "classnames/bind";
import { ReactNode, useEffect } from "react";

import style from './LayoutStyle.module.scss';
import { Language } from "~/components/Language";
import { LANGUAGE_ITEMS } from "~/constants";
import { useAppDispatch } from "~/store";
import { getRoles } from "~/thunk/roleThunk";

const cx = classNames.bind(style);

type LoginLayoutProps = {
    children: ReactNode
}

export const LoginLayout = ({ children }: LoginLayoutProps) => {
    const dispatch = useAppDispatch();
    
    useEffect(() => {
        dispatch(getRoles());
    }, []);

    return (
        <div className={cx('container-layout')}>
            <div className={cx('header')}>
                <Language languages={LANGUAGE_ITEMS} placement='top-right' />
            </div>
            <div className={cx('container-layout__body')}>{children}</div>
        </div>
    );
}