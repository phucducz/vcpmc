import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames/bind";
import { memo, useEffect, useRef } from "react";

import { useMenu } from "~/context/hooks";
import Image from "../Image";
import { Menu } from "../Menu";
import style from './Sidebar.module.scss';

const cx = classNames.bind(style);

export const Sidebar = memo(() => {
    const { data, menuActive, active, setActive, type, setType } = useMenu();
    const sidebarContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleWindowResize = () => {
            setType('dynamic');
            if (window.matchMedia('(max-width: 1900px)').matches)
                setActive(false);
            else
                setActive(true);
        }
        handleWindowResize();
        window.addEventListener('resize', handleWindowResize);
        
        return () => window.removeEventListener('resize', handleWindowResize);
    }, []);
    
    useEffect(() => {
        const handleClick = (e: any) => {
            if (type === 'normal' || !sidebarContainerRef.current) return;
            if (!sidebarContainerRef.current.contains(e.target)) setActive(false);
            else setActive(true);
        }
        window.addEventListener('mousedown', handleClick);

        return () => window.removeEventListener('mousedown', handleClick);
    }, [sidebarContainerRef, type]);

    return (
        <div ref={sidebarContainerRef} className={cx('sidebar-container', 'dynamic', active && 'active')}>
            <nav style={{ display: active ? 'flex' : 'none' }}>
                <Image src='https://res.cloudinary.com/dvlzvsyxs/image/upload/v1701141410/logo_ul3efy.png' alt='logo-vcpmc' width={96} height={96} />
                <Menu data={data} active={menuActive} />
            </nav>
            <div className={cx('sidebar-container__icon-disable')} style={{ display: active ? 'none' : 'flex' }}>
                <FontAwesomeIcon icon={faChevronRight} />
            </div>
        </div>
    );
});