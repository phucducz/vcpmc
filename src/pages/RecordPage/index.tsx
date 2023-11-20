import classNames from "classnames/bind";

import style from './Record.module.scss';

const cx = classNames.bind(style);

export const RecordPage = () => {
    return (
        <div className={cx('home-container')}>
            <p>Home Page</p>
        </div>
    );
}