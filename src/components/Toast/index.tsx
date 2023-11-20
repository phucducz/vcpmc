import classNames from "classnames/bind";
import { memo } from "react";

import style from './Toast.module.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(style);

function Toast() {
    return (
        <div className={cx('toast')}>
            <FontAwesomeIcon icon={faCheckCircle} />
        </div>
    );
}

export default memo(Toast);