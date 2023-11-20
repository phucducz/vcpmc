import classNames from "classnames/bind";
import { memo } from "react";

import style from './Loading.module.scss';

const cx = classNames.bind(style);

type LoadingProps = {
    visible: boolean
}

function Loading({ visible }: LoadingProps) {
    return (
        <div className={cx('loading', visible && 'active')}>
            <div></div>
            <div></div>
            <div></div>
        </div>
    );
}

export default memo(Loading);