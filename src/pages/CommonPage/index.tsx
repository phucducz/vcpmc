import classNames from "classnames/bind";
import { ReactNode, memo, useEffect, useState } from "react";

import { Action } from "~/components/Action";
import { Input } from "~/components/Input";
import { Paging, PagingItemType } from "~/components/Paging";
import { Tab, TabItemProps } from "~/components/Tab";
import { Icon, searchIcon } from "~/icons";
import style from './CommonPage.module.scss';

const cx = classNames.bind(style);

type CommonPageProps = {
    title: string;
    pagingData?: Array<PagingItemType>;
    actionType?: ReactNode;
    actionFilter?: ReactNode;
    children: ReactNode;
    actionData?: Array<any>;
    comboBoxRender?: ReactNode;
    search?: {
        placeHolder: string;
        searchValue: string;
        setSearchValue: (e: React.ChangeEvent<HTMLInputElement>) => void
    }
    tab?: Array<TabItemProps>;
    className?: string;
    contentHeader?: ReactNode;
}

export const CommonPage = memo(({ contentHeader, title, actionFilter, pagingData, actionType, actionData = [], search, children, tab = [] as Array<TabItemProps>, className = '' }: CommonPageProps) => {
    // useEffect(() => {
    //     const handleWindowResize = () => {
    //         if (!window.matchMedia('(max-width: 1600px)').matches) {
    //             return;
    //         }
    //         setScreenWidth(window.screen.width);
    //     }
    //     handleWindowResize();
    //     window.addEventListener('resize', handleWindowResize);

    //     return () => window.removeEventListener('resize', handleWindowResize);
    // }, []);

    return (
        <div className={cx('common-page', className)}>
            {pagingData && <Paging data={pagingData} />}
            <header><h3>{title}</h3></header>
            <div className={cx('content-container')}>
                {contentHeader && contentHeader}
                <div className={cx('content-container__filter-box')}>
                    {tab.length > 0 && <Tab data={tab} />}
                    <div>
                        {search && <Input
                            large
                            name='search'
                            value={search.searchValue}
                            onChange={search.setSearchValue}
                            placeholder={search.placeHolder}
                            rightIcon={<Icon icon={searchIcon} style={{ color: 'var(--white)' }} />}
                        />}
                        {(actionFilter || actionType) &&
                            <div
                                className={cx('content__action')}
                                style={{ width: window.matchMedia('(max-width: 1600px)').matches ? '90vw' : '1541px' }}
                            >
                                {actionFilter && actionFilter}
                                {actionType && <div className={cx('action-type-container')}>{actionType}</div>}
                            </div>}
                    </div>
                </div>
                <div className={cx('content')}>
                    {children}
                    {actionData.length > 0 && <Action visible={true} placement="top-right" data={actionData} />}
                </div>
            </div>
        </div >
    )
});