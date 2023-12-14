import classNames from "classnames/bind";
import { ReactNode, useContext, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "~/store";
import { useNavigate } from "react-router";

import style from './DefaultLayout.module.scss';
import { Language } from "~/components/Language";
import { LANGUAGE_ITEMS } from "~/constants";
import { Account } from "~/components/Account";
import avtNoFound from '~/images/no-found-avt.jpg';
import { MenuProvider } from "~/context/Menu/MenuProvider";
import { Sidebar } from "~/components/Sidebar";
import { getCategories } from "~/thunk/categoryThunk";
import { getApprovalList } from "~/thunk/approvalThunk";
import { routes } from "~/config/routes";

const cx = classNames.bind(style);

type DefaultLayoutProps = {
    children: ReactNode
}

export const DefaultLayout = ({ children }: DefaultLayoutProps) => {
    const user = useSelector((state: RootState) => state.user);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { lastName, firstName, avatar, role, id } = user.currentUser;
    let displayName = `${lastName} ${firstName}`;

    useEffect(() => {
        try {
            if (!id) navigate(routes.LoginPage);
            dispatch(getCategories());
            dispatch(getApprovalList());
        }
        catch {
            navigate(routes.LoginPage);
        }
    }, []);

    return (
        <MenuProvider>
            <div className={cx('container-layout')}>
                <div className={cx('container-layout__left')}>
                    <Sidebar />
                </div>
                <div className={cx('container-layout__right')}>
                    <div className={cx('cn-header')}>
                        <header className={cx('header')}>
                            <Language languages={LANGUAGE_ITEMS} placement='top-right' />
                            <Account
                                displayName={displayName}
                                role={role && role.role}
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
        </MenuProvider>
    );
}