import classNames from "classnames/bind";
import { ReactNode, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "~/store";

import style from './DefaultLayout.module.scss';
import { Language } from "~/components/Language";
import { languages } from "~/contants";
import { Account } from "~/components/Account";
import avtNoFound from '~/images/no-found-avt.jpg';
import { useNavigate } from "react-router";
import Sidebar from "~/components/Sidebar";

const cx = classNames.bind(style);

type DefaultLayoutProps = {
    children: ReactNode
}

export const DefaultLayout = ({ children }: DefaultLayoutProps) => {
    const user = useSelector((state: RootState) => state.user);
    const navigate = useNavigate();

    const { lastName, firstName, avatar, role, id } = user.currentUser;
    let displayName = `${lastName} ${firstName}`;

    useEffect(() => {
        try {
            if (!id) navigate('/login');
        }
        catch {
            navigate('/login');
        }
    }, []);

    return (
        <div className={cx('container-layout')}>
            <div className={cx('container-layout__left')}>
                <Sidebar />
            </div>
            <div className={cx('container-layout__right')}>
                <div className={cx('cn-header')}>
                    <header className={cx('header')}>
                        <Language languages={languages} placement='top-right' />
                        <Account
                            displayName={displayName}
                            role={role && role.role}
                            image={{
                                src: typeof avatar !== 'undefined' ? `../../images/${avatar}` : avtNoFound,
                                alt: 'avt-acc'
                            }}
                            onClick={() => navigate(`/profile/id/${id}`)}
                        />
                    </header>
                </div>
                <div className={cx('container-layout__body')}>{children}</div>
            </div>
        </div>
    );
}