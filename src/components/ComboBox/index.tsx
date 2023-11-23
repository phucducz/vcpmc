import classNames from "classnames/bind";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

import style from './ComboBox.module.scss';
import { DropDown } from "../DropDown";

const cx = classNames.bind(style);

export type ComboData = {
    title: string;
    data: Array<Pick<ComboData, 'title'>>;
    visible: boolean;
    activeData: string
}

type ComboBoxProps = {
    title: string;
    data: Array<any>;
    className?: string;
    active: string;
    visible?: boolean;
    onItemClick?: (category: ComboData, ...passParams: any) => void
    onClick: () => void
}

export const ComboBox = memo(({ title, data, className, active, visible, onClick, onItemClick }: ComboBoxProps) => {
    const ref = useRef<HTMLUListElement>(null);

    const width = useMemo(() => {
        if (ref.current)
            return ref.current.offsetWidth + 20;
    }, [ref.current]);

    return (
        <div className={cx('combo-box-container', className)}>
            <div className={cx('combo-box__title')}>
                <p>{title}</p>
            </div>
            <li className={cx('combo-box__content', visible && 'active')} onClick={onClick}>
                <div className={cx('content__active')} style={{ width: `${width}px` }}>
                    <p>{active}</p>
                    <FontAwesomeIcon icon={faChevronDown} />
                </div>
                <DropDown
                    dropDownRef={ref}
                    title={title}
                    data={data}
                    placement="bottom-left"
                    visible={visible}
                    onItemClick={onItemClick}
                    style={{ width: `${width}px` }}
                />
            </li>
        </div>
    );
});