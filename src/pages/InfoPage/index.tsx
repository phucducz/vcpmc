import classNames from "classnames/bind";

import style from './Info.module.scss';

const cx = classNames.bind(style);

export const InfoPage = () => {
    return (
        <div className={cx('')}>
            <p>Info Page</p>
        </div>
    );
}