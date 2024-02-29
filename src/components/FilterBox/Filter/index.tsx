import classNames from "classnames/bind";
import { memo, useEffect, useRef, useState } from "react";

import { ComboData } from "../../ComboBox";
import style from './FilterBox.module.scss';
import filterIcon from '~/images/filter.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(style);

type FilterBox = {
    data: ComboData[];
    className?: string;
    onItemClick: (item: any, ...passParams: any) => void;
}

type FilterBoxItem = {
    title: string;
    data: { title: string }[];
    activeData: string;
    onItemClick: (item: any, ...passParams: any) => void;
}

const FilterBoxItem = memo(({ title, data, activeData, onItemClick }: FilterBoxItem) => {
    return (
        <div className={cx('filter__item')}>
            <p>{title}:</p>
            <div className={cx('item__content')}>
                {data.map((item, index) => (
                    <div
                        key={index}
                        className={cx(activeData === item.title && 'active')}
                        onClick={() => onItemClick(item, title)}
                    >
                        <p>{item.title}</p>
                    </div>
                ))}
            </div>
        </div>
    );
});

export const FilterBox = memo(({ data, className, onItemClick }: FilterBox) => {
    const filterRef = useRef<HTMLDivElement>(null);
    const [active, setActive] = useState<boolean>(false);

    useEffect(() => {
        const handleFilterClick = (e: any) => {
            if (filterRef.current?.contains(e.target))
                setActive(true);
            else setActive(false);
        }
        window.addEventListener('mousedown', handleFilterClick);

        return () => window.removeEventListener('mousedown', handleFilterClick);
    }, []);

    return (
        <div ref={filterRef} className={cx('filter-box', className)}>
            <FontAwesomeIcon
                icon={faFilter}
                className={cx('filter-box__icon', active && 'active')}
            />
            <div className={cx('filter-box__filter', active && 'active')}>
                <p>Lọc theo</p>
                {data.map((item, index) =>
                    <FilterBoxItem
                        key={index}
                        title={item.title}
                        data={item.data}
                        activeData={item.activeData}
                        onItemClick={onItemClick}
                    />
                )}
            </div>
        </div>
    );
});