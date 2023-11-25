import classNames from "classnames/bind";
import { memo } from "react";

import style from './Loading.module.scss';

const cx = classNames.bind(style);

type LoadingProps = {
    visible: boolean;
    className?: string
}

function Loading({ visible, className }: LoadingProps) {
    return (
        <div className={cx('loading', visible && 'active', className)}>
            <div></div>
            <div></div>
            <div></div>
        </div>
    );
}

export default memo(Loading);