import classNames from "classnames/bind";
import { useState } from "react";

import style from './ApprovePage.module.scss';
import { Paging, PagingItemType } from "~/components/Paging";
import { routes } from "~/config/routes";
import Input from "~/components/Input";
import { Icon, searchIcon } from "~/icons";

const cx = classNames.bind(style);

const PAGING_ITEMS: Array<PagingItemType> = [
    {
        title: 'Kho bản ghi',
        to: routes.RecordPage
    }, {
        title: 'Quản lý phê duyệt',
        to: "#"
    }
];

export const ApprovePage = () => {
    const [searchValue, setSearchValue] = useState<string>('');

    return (
        <div className={cx('approve-container')}>
            <Paging data={PAGING_ITEMS} />
            <header><h3>Phê duyệt bản ghi</h3></header>
            <Input
                large
                name='search'
                value={searchValue}
                onChange={(e: any) => setSearchValue(e.target.value)}
                placeholder="Tên bản ghi, ca sĩ,..."
                rightIcon={<Icon icon={searchIcon} style={{ color: 'var(--white)' }} />}
            />
        </div>
    );
}   