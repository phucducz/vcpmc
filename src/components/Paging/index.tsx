import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { MenuContext } from "~/context/Menu/MenuContext";

import style from './Paging.module.scss';

const cx = classNames.bind(style);

export type PagingItemType = {
    title: string;
    to: string;
    active?: boolean;
}

type PagingProps = {
    data: Array<PagingItemType>;
    className?: string;
}

export const Paging = ({ className, data }: PagingProps) => {
    const { setActive } = useContext(MenuContext);

    return (
        <div className={cx('paging-container', className)}>
            {data.map((item, index) => {
                let active = true;
                let isPagingNext = true;

                if (index === data.length - 1)
                    isPagingNext = false;
                if (typeof item.active === 'undefined')
                    active = false;
                else active = item.active;

                return (
                    <span key={index}>
                        <Link to={`${item.to}`} onClick={() => { setActive(active) }}>{item.title}</Link>
                        {isPagingNext && <FontAwesomeIcon icon={faChevronRight} />}
                    </span>
                )
            })}
        </div>
    );
}