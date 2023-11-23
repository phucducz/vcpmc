import classNames from "classnames/bind";
import { memo, useContext } from "react";

import style from './Sidebar.module.scss';
import Image from "../Image";
import logo from '~/images/logo.png';
import { Menu } from "../Menu";
import { MenuContext } from "~/context/Menu/MenuContext";

const cx = classNames.bind(style);

export const Sidebar = memo(() => {
    const menuContext = useContext(MenuContext);

    const { data, menuActive } = menuContext;

    return (
        <nav className={cx('sidebar-container')}>
            <Image src={logo} alt='logo-vcpmc' width={96} height={96} />
            <Menu data={data} active={menuActive} />
        </nav>
    );
});