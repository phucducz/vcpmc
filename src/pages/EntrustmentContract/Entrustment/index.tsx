import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames/bind";
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

import { EtmContract } from "~/api/etmContractAPI";
import { PagingItemType } from "~/components/Paging";
import { TabItemProps } from "~/components/Tab";
import { Table } from "~/components/Table";
import { routes } from "~/config/routes";
import { useMenu } from "~/context/hooks";
import { CommonPage } from "~/pages/CommonPage";
import { RootState, useAppDispatch } from "~/store";
import { getEtmContractList } from "~/thunk/etmContractThunk";
import style from './Entrustment.module.scss';

const cx = classNames.bind(style);

const PAGING_ITEMS: Array<PagingItemType> = [
    {
        title: 'Quản lý',
        to: '#',
        active: true
    }, {
        title: 'Quản lý hợp đồng',
        to: "#",
        active: true
    }
];

function EntrusmentPage() {
    const etmContract = useSelector((state: RootState) => state.etmContract);

    const { setActive } = useMenu();

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [searchValue, setSearchValue] = useState<string>('');
    const [searchResult, setSearchResult] = useState<Array<EtmContract>>([] as Array<EtmContract>);
    const [itemsCurrent, setItemsCurrent] = useState<Array<EtmContract>>([] as Array<EtmContract>);
    const [itemsPerPage, setItemsPerPage] = useState<string>('8');
    const [actionData, setActionData] = useState([
        {
            icon: <FontAwesomeIcon icon={faPlus} />,
            title: 'Thêm hợp đồng',
            onClick: () => { navigate(routes.AddETMContract); setActive(false) },
        }
    ]);
    const [tab, setTab] = useState<TabItemProps[]>([
        {
            title: 'Hợp đồng uỷ quyền',
            onClick: () => navigate('#'),
        }, {
            title: 'Hợp đồng khai thác',
            onClick: () => navigate(routes.Entrustment),
        }
    ]);

    useEffect(() => {
        dispatch(getEtmContractList());
    }, []);

    useEffect(() => {
        setSearchResult(etmContract.etmContractList);
        setItemsCurrent(etmContract.etmContractList);
    }, [etmContract.etmContractList]);

    useEffect(() => {
        let value = searchValue.trim().toLowerCase();

        if (value === '') {
            setSearchResult(etmContract.etmContractList);
            return;
        }

        setSearchResult(etmContract.etmContractList.filter(contract =>
            contract.code.toLowerCase().includes(value) ||
            contract.name.toLowerCase().includes(value)
        ));
    }, [searchValue]);

    const handleChange = (value: string) => {
        setItemsPerPage(value);
    }

    const handleSetCurrentItems = useCallback((item: Array<EtmContract>) => {
        setItemsCurrent(item);
    }, []);

    return (
        <CommonPage
            title='Danh sách hợp đồng khai thác'
            pagingData={PAGING_ITEMS}
            actionData={actionData}
            tab={tab}
            search={{
                placeHolder: 'Tên hợp đồng, tác giả,...',
                searchValue: searchValue,
                setSearchValue: (e: any) => setSearchValue(e.target.value)
            }}
            className={cx('entrusment-contract-container')}
        >
            <div className={cx('container-table-data')}>
                <Table
                    paginate={{
                        dataForPaginate: searchResult,
                        setCurrentItems: handleSetCurrentItems
                    }}
                    loading={etmContract.loading}
                    itemsPerPage={itemsPerPage}
                    setItemsPerPage={handleChange}
                    thead={['STT', 'Số hợp đồng', 'Khách hàng', 'Ngày tạo', 'Ngày hiệu lực', 'Ngày hết hạn', 'Hiệu lực hợp đồng', '', '']}
                >
                    {itemsCurrent.map((item, index) => {
                        if (index > parseInt(itemsPerPage) - 1) return null;

                        let status = 'cancelled';
                        if (item.status === 'Mới')
                            status = 'new';
                        if (item.status === 'Đang hiệu lực')
                            status = 'still';
                        if (item.status === 'Hết hiệu lực')
                            status = 'expiration';

                        return (
                            <tr key={index} style={{ height: '47px' }} className={cx('content')}>
                                <td><p>{index + 1}</p></td>
                                <td><p>{item.code}</p></td>
                                <td><p>{item.name}</p></td>
                                <td><p>{item.createdDate}</p></td>
                                <td><p>{item.effectiveDate}</p></td>
                                <td><p>{item.expirationDate}</p></td>
                                <td><p className={cx('status', status)}>{item.status}</p></td>
                                <td><p className={cx('action')} onClick={() => navigate(`/contract-detail/${item.id}`)}>Xem chi tiết</p></td>
                                <td><p className={cx('action')} onClick={() => navigate(`/entrustment-contract/copy/${item.id}`)}>Sao chép hợp đồng</p></td>
                            </tr>
                        );
                    })}
                </Table>
            </div>
        </CommonPage>
    );
};

export default EntrusmentPage;