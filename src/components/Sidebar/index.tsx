import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames/bind";
import { memo } from "react";

import { useMenu } from "~/context/hooks";
import Image from "../Image";
import { Menu } from "../Menu";
import style from './Sidebar.module.scss';

const cx = classNames.bind(style);

export const Sidebar = memo(() => {
    const { data, menuActive, active, setActive, type } = useMenu();

    const handleClick = () => {
        if (type === 'dynamic')
            setActive(true);
    }

    return (
        <div className={cx('sidebar-container', 'dynamic', active && 'active')} onClick={() => setActive(true)}>
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