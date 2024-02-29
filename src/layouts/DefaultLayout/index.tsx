import classNames from "classnames/bind";
import { ReactNode, useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router";
import { RootState, useAppDispatch } from "~/store";

import { Account } from "~/components/Account";
import { Language } from "~/components/Language";
import { Sidebar } from "~/components/Sidebar";
import { routes } from "~/config/routes";
import { LANGUAGE_ITEMS } from "~/constants";
import { ThemeProvider } from "~/context/Theme/ThemeProvider";
import { useMenu } from "~/context/hooks";
import avtNoFound from '~/images/no-found-avt.jpg';
import { getApprovalList } from "~/thunk/approvalThunk";
import { getCategories } from "~/thunk/categoryThunk";
import style from './DefaultLayout.module.scss';

const cx = classNames.bind(style);

type DefaultLayoutProps = {
    children: ReactNode
}

export const DefaultLayout = ({ children }: DefaultLayoutProps) => {
    const user = useSelector((state: RootState) => state.user);
    const { setType } = useMenu();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { lastName, firstName, avatar, role, id } = user.currentUser;
    let displayName = `${lastName} ${firstName}`;

    useEffect(() => {
        dispatch(getCategories());
        dispatch(getApprovalList());
    }, []);

    useEffect(() => {
        if (!window.matchMedia('(max-width: 1900px)').matches)
            setType('normal');
    }, [children]);

    return (
        <>{!id
            ? <Navigate to='/' />
            : <ThemeProvider>
                <div className={cx('container-layout')}>
                    <div className={cx('container-layout__left')}>
                        <Sidebar />
                    </div>
                    <div className={cx('container-layout__right')}>
                        <div className={cx('cn-header')}>
                            <header className={cx('header')}>
                                <Language className={cx('header__language')} languages={LANGUAGE_ITEMS} placement='top-right' />
                                <Account
                                    displayName={displayName}
                                    role={role && role.name}
                                    image={{
                                        src: typeof avatar !== 'undefined' ? `${avatar}` : avtNoFound,
                                        alt: 'avt-acc'
                                    }}
                                    onClick={() => navigate(`/profile/id/${id}`)}
                                />
                            </header>
                        </div>
                        <div className={cx('container-layout__body')}>
                            {children}
                        </div>
                    </div>
                </div>
            </ThemeProvider>
        }</>
    );
}