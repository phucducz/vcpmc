import classNames from "classnames/bind";
import { memo, useContext, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

import style from './Sidebar.module.scss';
import Image from "../Image";
import { Menu } from "../Menu";
import { MenuContext } from "~/context/Menu/MenuContext";

const cx = classNames.bind(style);

export const Sidebar = memo(() => {
    const { data, menuActive, active, setActive, type } = useContext(MenuContext);

    const [activeNav, setActiveNav] = useState<boolean>(active);

    console.log(type);

    const handleClick = () => {
        if (type === 'dynamic')
            setActive(true);
    }

    return (
        <div className={cx('sidebar-container', 'dynamic', active && 'active')}>
            {active ? <>
                <nav className={cx('sidebar-container')}>
                    <Image src='https://res.cloudinary.com/dvlzvsyxs/image/upload/v1701141410/logo_ul3efy.png' alt='logo-vcpmc' width={96} height={96} />
                    <Menu data={data} active={menuActive} />
                </nav>
            </>
                : <div className={cx('sidebar-container__icon-disable')}>
                    <FontAwesomeIcon icon={faChevronRight} onClick={handleClick} />
                </div>
            }
        </div>
    );
});