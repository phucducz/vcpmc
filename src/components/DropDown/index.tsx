import classNames from "classnames/bind";
import { useEffect, useRef } from "react";

import style from './DropDown.module.scss';
import { Item } from "./Item";
import { Position } from "~/types";
import { LanguageProps } from "../Language";

const cx = classNames.bind(style);

export type ItemProps = {
    title: string;
    onClick: () => void
}

type DropDownProps = {
    title?: string;
    data: Array<any>;
    onItemClick?: any;
    className?: string;
    placement?: Position;
    visible?: boolean;
    style?: any;
    dropDownRef?: any;
    // onClick?: any;
}

export const DropDown = ({ dropDownRef, title, data, onItemClick, className, placement, visible, style }: DropDownProps) => {
    const divRef = useRef<HTMLUListElement>(null);

    if (!className)
        className = '';
    if (!placement)
        placement = 'bottom-center';

    const classes = cx('drop-down', {
        [className]: className,
        [placement]: placement,
    });

    const handleShowDropDown = (ref: any) => {
        if (ref.current) {
            const idTimeoutActive = setTimeout(() => {
                if (ref.current) {
                    ref.current.style.height = `calc(4.4rem * ${data.length})`;
                    ref.current.style.border = '1px solid transparent';
                }
            }, 150);

            return () => clearTimeout(idTimeoutActive);
        }
    }

    const handleHideDropDown = (ref: any) => {
        if (ref.current) {
            ref.current.style.height = '0';
            const idTimeoutDisable = setTimeout(() => {
                if (!visible && ref.current) {
                    ref.current.style.border = '1px solid transparent';
                }
            }, 300);

            return () => clearTimeout(idTimeoutDisable);
        }
    }

    useEffect(() => {
        if (typeof visible === 'undefined') return;

        if (visible) {
            handleShowDropDown(dropDownRef || divRef);
            return;
        }

        handleHideDropDown(dropDownRef || divRef);
    }, [visible]);

    const handleClick = (item?: any, ...passParams: any) => {
        onItemClick
            ? onItemClick(item, ...passParams)
            : item.onClick();
    }

    return (
        <ul ref={dropDownRef || divRef} className={classes} style={style}>
            {data.map(item => {
                return <Item
                    key={item.title}
                    title={item.title}
                    onClick={() => handleClick(item, title)}
                />
            })}
        </ul>
    );
}