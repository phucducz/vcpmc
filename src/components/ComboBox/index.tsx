import { stringOrNumber } from "@cloudinary/url-gen/types/types";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames/bind";
import { useEffect, useRef, useState } from "react";

import { DropDown } from "../DropDown";
import { Input } from "../Input";
import style from './ComboBox.module.scss';

const cx = classNames.bind(style);

export type ComboData = {
    id?: stringOrNumber;
    title: string;
    data: Array<Pick<ComboData, 'title'>>;
    visible: boolean;
    activeData: string;
    size?: 's' | 'l' | 'xl';
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
    size?: 's' | 'l' | 'xl'
}

export const ComboBox = ({ size = 's', title, data, className, active, onClick, onItemClick, style }: ComboBoxProps) => {
    const ownRef = useRef<HTMLUListElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const [activeBox, setActiveBox] = useState<boolean>(false);

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

    return (
        <div className={cx('combo-box-container', className)}>
            <div className={cx('combo-box__title')}>
                {title && <p>{title}</p>}
            </div>
            <li
                className={cx('combo-box__content', activeBox && 'active', size)}
                onClick={onClick}
            >
                <div ref={contentRef} className={cx('content__active')}>
                    <Input
                        spellCheck={false}
                        value={active}
                        name='comboBoxValue'
                        style={style}
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
                />
            </li>
        </div>
    );
}