import classNames from "classnames/bind";
import { memo, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import style from './Entrusment.module.scss';
import { CommonPage } from "../CommonPage";
import { PagingItemType } from "~/components/Paging";

const cx = classNames.bind(style);

const PAGING_ITEMS: Array<PagingItemType> = [
    {
        title: 'Quản lý',
        to: '#'
    }, {
        title: 'Quản lý hợp đồng',
        to: "#"
    }
];

export const EntrusmentPage = memo(() => {
    const [typeLoad, setTypeLoad] = useState<'table' | 'grid'>('table');
    const [actionData, setActionData] = useState([
        {
            icon: <FontAwesomeIcon icon={faPlus} />,
            title: 'Thêm hợp đồng',
            onClick: () => { }
        }
    ]);

    return (
        <div className={cx('entrusment-contract-container')}>
            <CommonPage
                title='Danh sách hợp đồng khai thác'
                pagingData={PAGING_ITEMS}
                actionData={actionData}
            >

            </CommonPage>
        </div>
    );
});