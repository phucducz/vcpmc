import classNames from "classnames/bind";
import { ReactNode, memo } from "react";

import style from './CommonPage.module.scss';
import Input from "~/components/Input";
import { Icon, searchIcon } from "~/icons";
// import { ComboBox } from "~/components/ComboBox";
import { Action } from "~/components/Action";
import { Paging, PagingItemType } from "~/components/Paging";

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
}

export const CommonPage = memo(({ title, actionFilter, pagingData, actionType, actionData = [], search, children }: CommonPageProps) => {
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
                        {actionFilter && actionFilter}
                        {actionType && <div className={cx('action-type-container')}>{actionType}</div>}
                    </div>
                    {children}
                    <Action visible={true} placement="top-right" data={actionData} />
                </div>
            </div>
        </div >
    )
});