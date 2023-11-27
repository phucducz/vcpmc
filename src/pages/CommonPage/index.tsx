import classNames from "classnames/bind";
import { ReactNode, memo, useState } from "react";

import style from './CommonPage.module.scss';
import Input from "~/components/Input";
import { Icon, searchIcon } from "~/icons";
import { ComboBox } from "~/components/ComboBox";
import { Action } from "~/components/Action";
import { Paging, PagingItemType } from "~/components/Paging";

const cx = classNames.bind(style);

type CommonPageProps = {
    title: string;
    pagingData?: Array<PagingItemType>
    comboBoxData?: Array<any>;
    comboBoxRef?: any;
    onComboBoxClick?(item: any): void;
    onComboBoxItemClick?(...passParams: any): void;
    actionType?: ReactNode;
    children: ReactNode;
    actionData?: Array<any>;
    comboBoxRender?: ReactNode;
    search?: {
        placeHolder: string;
        searchValue: string;
        setSearchValue: (e: React.ChangeEvent<HTMLInputElement>) => void
    }
}

// export const CommonPage = memo(({ title, comboBoxRef, comboBoxData, onComboBoxClick, onComboBoxItemClick, comboBoxRender, pagingData, actionType, actionData, search, children }: CommonPageProps) => {
export const CommonPage = memo(({ title, comboBoxData, comboBoxRef, pagingData, actionType, actionData = [], search, children, onComboBoxClick, onComboBoxItemClick }: CommonPageProps) => {
    const handleComboBoxClick = (item: any) => {
        onComboBoxClick && onComboBoxClick(item);
    }

    return (
        <div className={cx('common-page')}>
            {pagingData && <Paging data={pagingData} />}
            <header><h3>{title}</h3></header>
            <div className={cx('content-container')}>
                {search && <Input
                    large
                    name='search'
                    value={search.searchValue}
                    onChange={search.setSearchValue}
                    placeholder={search.placeHolder}
                    rightIcon={<Icon icon={searchIcon} style={{ color: 'var(--white)' }} />}
                />}
                <div className={cx('content')}>
                    <div className={cx('content__action')}>
                        <div className={cx('combo-box-data')}>
                            {comboBoxData?.length && comboBoxData.map((item, index) => (
                                <ComboBox
                                    comboBoxRef={comboBoxRef}
                                    key={index}
                                    title={item.title}
                                    active={item.activeData}
                                    visible={item.visible}
                                    data={item.data}
                                    className={cx('combo-data')}
                                    onClick={() => handleComboBoxClick(item)}
                                    onItemClick={onComboBoxItemClick}
                                />
                            ))}
                        </div>
                        {actionType && <div className={cx('action-type-container')}>{actionType}</div>}
                    </div>
                    {children}
                    <Action visible={true} placement="top-right" data={actionData} />
                </div>
            </div>
        </div >
    )
});