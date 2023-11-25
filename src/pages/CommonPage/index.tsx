import classNames from "classnames/bind";
import { ReactNode, memo } from "react";

import style from './CommonPage.module.scss';
import Input from "~/components/Input";
import { Icon, searchIcon } from "~/icons";
import { ComboBox } from "~/components/ComboBox";
import { Action } from "~/components/Action";

const cx = classNames.bind(style);

type CommonPageProps = {
    comboBoxData: Array<any>;
    onComboBoxClick?(item: any): void;
    onComboBoxItemClick?(...passParams: any): void;
    actionType?: ReactNode;
    children: ReactNode;
    actionData?: Array<any>;
    search?: {
        placeHolder: string;
        searchValue: string;
        setSearchValue: (e: React.ChangeEvent<HTMLInputElement>) => void
    }
}

export const CommonPage = memo(({ comboBoxData, actionType, actionData, search, children, onComboBoxClick, onComboBoxItemClick }: CommonPageProps) => {

    const handleComboBoxClick = (item: any) => {
        onComboBoxClick && onComboBoxClick(item);
    }

    return (
        <div className={cx('common-page')}>
            <header><h3>Kho bản ghi</h3></header>
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
                        <div className={cx('combobox-data')}>
                            {comboBoxData.map((item, index) => (
                                <ComboBox
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
                        {actionType && actionType}
                    </div>
                    {children}
                    <Action visible={true} placement="top-right" data={actionData || []} />
                </div>
            </div>
        </div >
    )
});