import classNames from "classnames/bind";
import { useEffect, useRef } from "react";

import style from './DropDown.module.scss';
import { Item } from "./Item";
import { LanguageProps } from "..";
import { Position } from "~/types";

const cx = classNames.bind(style);

export type ItemProps = {
    title: string;
    onClick: () => void
}

type DropDownProps = {
    data: Array<LanguageProps>;
    onItemClick: any;
    className?: string;
    placement?: Position;
    visible: boolean;
}

export const DropDown = ({ data, onItemClick, className, placement, visible }: DropDownProps) => {
    const divRef = useRef<HTMLDivElement>(null);

    if (!className)
        className = '';
    if (!placement)
        placement = 'center-bottom';

    const classes = cx('drop-down', {
        [className]: className,
        [placement]: placement,
    });

    useEffect(() => {
        if (visible) {
            if (divRef.current) {
                divRef.current.style.display = 'block';
                const idTimeoutActive = setTimeout(() => {
                    if (divRef.current) {
                        divRef.current.style.height = `calc(4.4rem * ${data.length})`;
                        divRef.current.style.border = '1px solid rgb(200, 200, 219)';
                    }
                }, 150);

                return () => clearTimeout(idTimeoutActive);
            }
        }
        else {
            if (!visible && divRef.current) {
                divRef.current.style.height = '0';
                const idTimeoutDisable = setTimeout(() => {
                    if (!visible && divRef.current) {
                        divRef.current.style.display = 'none';
                        divRef.current.style.border = 'none';
                    }
                }, 300);

                return () => clearTimeout(idTimeoutDisable);
            }
        }
    }, [visible]);

    const handleClick = (item: LanguageProps) => {
        onItemClick(item);
    }

    return (
        <div ref={divRef} className={classes}>
            {data.map(item =>
                <Item
                    key={item.title}
                    title={item.title}
                    onClick={() => handleClick(item)}
                />
            )}
        </div>
    );
}