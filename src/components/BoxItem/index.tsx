import { memo } from "react";
import classNames from "classnames/bind";

import style from './BoxItem.module.scss';

const cx = classNames.bind(style);

export type BoxItemType = {
    title: string;
    content: string
}

type BoxItemProps = {
    data: BoxItemType
}

export const BoxItem = memo(({ data }: BoxItemProps) => {
    return (
        <div className={cx('box__item')}>
            <p className={cx('box__item__title')}>{data.title}</p>
            <p className={cx('box__item__content')}>{data.content}</p>
        </div>
    )
});