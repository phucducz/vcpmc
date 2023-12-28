import classNames from "classnames/bind";

import style from './Tab.module.scss';
import { memo, useEffect, useState } from "react";

const cx = classNames.bind(style);

export type TabItemProps = {
    title: string;
    onClick: () => void;
    className?: string;
}

const TabItem = memo(({ title, onClick, className }: TabItemProps) => {
    return (
        <div className={cx('item', className)} onClick={onClick}>
            <p>{title}</p>
        </div>
    );
});

type TabProps = {
    data: Array<TabItemProps>;
    className?: string;
}

export const Tab = memo(({ data, className }: TabProps) => {
    const [activeTab, setActiveTab] = useState<string>('');

    useEffect(() => {
        data.length > 0 && setActiveTab(data[0].title);
    }, [data]);

    const handleOnTabClick = (item: TabItemProps) => {
        setActiveTab(item.title);
        item.onClick();
    }

    return (
        <div className={cx('tab-container', className)}>
            {data.map(item => (
                <TabItem
                    key={item.title}
                    title={item.title}
                    onClick={() => handleOnTabClick(item)}
                    className={cx(activeTab === item.title && 'active')}
                />
            ))}
        </div>
    );
});