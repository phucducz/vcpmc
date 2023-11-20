import classNames from "classnames/bind";
import { memo } from "react";

import style from './Sidebar.module.scss';

const cx = classNames.bind(style);

function Sidebar() {
    return (
        <nav className={cx('sidebar-container')}>

        </nav>
    );
}

export default memo(Sidebar);