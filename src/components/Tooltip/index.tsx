import classNames from "classnames/bind";
import { memo } from "react";
import { stringOrNumber } from "@cloudinary/url-gen/types/types";

import style from './Tooltip.module.scss';

const cx = classNames.bind(style);

type TooltipType = {
    title: string;
    content: stringOrNumber;
    active: boolean;
}

export const Tooltip = memo(({ title, content, active }: TooltipType) => {
    console.log(title);
    console.log(content);
    console.log(active);
    
    return (
        <div className={cx('tooltip-container', active && 'active')}>
            <p className={cx('tooltip-container__title')}>{title}</p>
            <p className={cx('tooltip-container__content')}>{content}</p>
        </div>
    );
});