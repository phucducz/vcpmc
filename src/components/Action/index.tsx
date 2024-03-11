import { faAdd, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames/bind";
import { ReactNode, memo, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { useWindowsResize } from "~/context/hooks";
import style from './Action.module.scss';
import { Item } from "./Item";
import { Icon } from "~/icons";

const cx = classNames.bind(style);

type HorizontalPosition = 'center' | 'top' | 'bottom';
type VerticalPosition = 'center' | 'left' | 'right';

export type ActionDataType<E extends React.ElementType<any>> = {
    icon: ReactNode;
    title: string;
    to?: string;
    onClick(title?: string): void;
    as?: E;
    href?: string;
    disable?: boolean;
}

type ActionProps<E extends React.ElementType<any>> = {
    data: Array<ActionDataType<E>>;
    className?: string;
    placement?: Exclude<`${HorizontalPosition}-${VerticalPosition}`, 'center-center'> | 'center';
    visible?: boolean;
    onClick?: () => void;
}

export const Action = memo(<E extends React.ElementType<any>>({ data, className, placement = 'center', visible, onClick }: ActionProps<E>) => {
    if (!className) className = '';

    const [mobileMode, setMobileMode] = useState<boolean>(false);
    const [activeActionBox, setActiveActionBox] = useState<boolean>(false);
    const actionRef = useRef<HTMLDivElement>(null);

    useWindowsResize(() => {
        if (window.matchMedia('(max-width: 900px)').matches)
            setMobileMode(true);
        else setMobileMode(false);
    });

    useEffect(() => {
        const handleMouseDown = (e: any) => {
            if (actionRef.current?.contains(e.target))
                setActiveActionBox(true);
            else setActiveActionBox(false);
        }
        window.addEventListener('mousedown', handleMouseDown);

        return () => window.removeEventListener('mousedown', handleMouseDown);
    }, []);

    return (
        <>{mobileMode
            ? <div ref={actionRef} className={cx('action-box')}>
                <FontAwesomeIcon icon={activeActionBox ? faXmark : faAdd} className={cx('action-box__icon')} />
                <ul
                    className={cx('action-box__container-content', activeActionBox && 'active')}
                    style={{ height: activeActionBox ? `${data.length * 44 + ((data.length - 1) * 20) + 10}px` : 0 }}
                >
                    {data.map((item, index) => (
                        <li
                            className={cx('item')}
                            key={index}
                            onClick={() => {
                                item.onClick();
                                setActiveActionBox(false);
                            }}
                        >
                            {item.as
                                ? <a href={item.href}>
                                    <p>{item.title}</p>
                                    {item.icon}
                                </a>
                                : <Link to='#'>
                                    <p>{item.title}</p>
                                    {item.icon}
                                </Link>
                            }
                        </li>
                    ))}
                </ul>
            </div>
            : <div
                className={cx('action-container', visible && 'active', {
                    [className]: className,
                    [placement]: placement
                })}
                onClick={onClick}
            >
                {data.map((item, index: number) => {
                    const { icon, title, onClick } = item;

                    return (
                        <Item
                            key={index}
                            icon={icon}
                            title={title}
                            onClick={onClick}
                            as={item.as || 'div'}
                            href={item.href}
                            className={cx(item.disable && 'disable')}
                        />
                    )
                })}
            </div>
        }</>
    );
});