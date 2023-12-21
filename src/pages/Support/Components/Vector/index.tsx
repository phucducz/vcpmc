import classNames from "classnames/bind";

import style from './Vector.module.scss';
import { Icon, vector1Icon, vector2Icon, vector3Icon, vector4Icon } from "~/icons";
import vector5Icon from "~/icons/vector-5-icon";

const cx = classNames.bind(style);

export const Vector = () => {
    return (
        <div className={cx('vector-container')}>
            <div className={cx('vector-container__top')}>
                <Icon icon={vector1Icon} />
                <Icon icon={vector2Icon} />
            </div>
            <div className={cx('vector-container__bottom-right')}>
                <div><Icon icon={vector3Icon} /></div>
                <div>
                    <Icon icon={vector4Icon} />
                    <Icon icon={vector5Icon} />
                </div>
            </div>
        </div>
    );
}