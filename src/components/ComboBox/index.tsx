import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames/bind";
import { useEffect, useMemo, useRef, useState } from "react";

import { DropDown } from "../DropDown";
import { Input } from "../Input";
import style from './ComboBox.module.scss';

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
    style?: any;
}

export const ComboBox = ({ width: widthOut, comboBoxRef, title, data, className, active, visible, onClick, onBlur, onItemClick, style }: ComboBoxProps) => {
    const ownRef = useRef<HTMLUListElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const [activeBox, setActiveBox] = useState<boolean>(false);

    const width = useMemo(() => {
        if (comboBoxRef && comboBoxRef.current)
            return comboBoxRef.current.offsetWidth + 20;
        if (ownRef.current)
            return ownRef.current.offsetWidth + 20;
    }, [ownRef.current]);

    useEffect(() => {
        const handleMouseDown = (e: any) => {
            if (contentRef.current?.contains(e.target))
                setActiveBox(true);
            else
                setActiveBox(false);
        }
        window.addEventListener('mousedown', handleMouseDown);

        return () => window.removeEventListener('mousedown', handleMouseDown);
    }, []);

    console.log(ownRef.current?.offsetWidth);

    return (
        <div className={cx('combo-box-container', className)}>
            <div className={cx('combo-box__title')}>
                {title && <p>{title}</p>}
            </div>
            <li
                className={cx('combo-box__content', activeBox && 'active')}
                onClick={onClick}
            >
                <div ref={contentRef} className={cx('content__active')}>
                    <Input
                        spellCheck={false}
                        value={active}
                        name='comboBoxValue'
                        onChange={() => { }}
                        style={{ width: `calc(${width}px - 40px)`, style }}
                    />
                    <FontAwesomeIcon icon={faChevronDown} />
                </div>
                <DropDown
                    dropDownRef={ownRef}
                    title={title}
                    data={data}
                    placement="bottom-left"
                    visible={activeBox}
                    onItemClick={onItemClick}
                    style={{ width: `${width}px` }}
                />
            </li>
        </div>
    );
}