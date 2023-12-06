import classNames from "classnames/bind";
import { memo, useMemo, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

import style from './ComboBox.module.scss';
import { DropDown } from "../DropDown";
import { Input } from "../Input";

const cx = classNames.bind(style);

export type ComboData = {
    title: string;
    data: Array<Pick<ComboData, 'title'>>;
    visible: boolean;
    activeData: string
}

type ComboBoxProps = {
    title?: string;
    width?: string;
    data: Array<any>;
    className?: string;
    active: string;
    visible?: boolean;
    comboBoxRef?: any;
    onItemClick?: (category: any, ...passParams: any) => void;
    onBlur?(item: any): void;
    onClick: () => void;
}

export const ComboBox = memo(({ width: widthOut, comboBoxRef, title, data, className, active, visible, onClick, onBlur, onItemClick }: ComboBoxProps) => {
    const ownRef = useRef<HTMLUListElement>(null);

    const width = useMemo(() => {
        if (comboBoxRef && comboBoxRef.current)
            return comboBoxRef.current.offsetWidth + 20;
        if (ownRef.current)
            return ownRef.current.offsetWidth + 20;
    }, [ownRef.current]);

    return (
        <div className={cx('combo-box-container', className)}>
            <div className={cx('combo-box__title')}>
                {title && <p>{title}</p>}
            </div>
            <li
                className={cx('combo-box__content', visible && 'active')}
                onClick={onClick}
            >
                <div className={cx('content__active')} >
                    <Input
                        spellCheck={false}
                        value={active}
                        name='comboBoxValue'
                        onChange={() => { }}
                        style={{ width: widthOut || `calc(${width}px - 40px)` }}
                    />
                    < FontAwesomeIcon icon={faChevronDown} />
                </div>
                <DropDown
                    dropDownRef={ownRef}
                    title={title}
                    data={data}
                    placement="bottom-left"
                    visible={visible}
                    onItemClick={onItemClick}
                    style={{ width: widthOut || `${width}px` }}
                />
            </li>
        </div>
    );
});