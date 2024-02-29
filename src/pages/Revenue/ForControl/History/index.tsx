import { faFileExport } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames/bind";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

import { EtmContractForControl } from "~/api/etmContractAPI";
import { Input } from "~/components/Input";
import { PagingItemType } from "~/components/Paging";
import { Table } from "~/components/Table";
import { formatDateYMD, formatMoney } from "~/context";
import { useMenu } from "~/context/hooks";
import { CommonPage } from "~/pages/CommonPage";
import { RootState, useAppDispatch } from "~/store";
import { getEtmContractForControls } from "~/thunk/etmContractThunk";
import style from './History.module.scss';

const cx = classNames.bind(style);

function HistoryForControlPage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { setActive } = useMenu();

    const etmContract = useSelector((state: RootState) => state.etmContract);

    const [paging, setPaging] = useState<Array<PagingItemType>>([] as Array<PagingItemType>);
    const [actionData, setActionData] = useState<any[]>([] as any[]);
    const [date, setDate] = useState<string>('');
    const [searchValue, setSearchValue] = useState<string>('');
    const [searchResult, setSearchResult] = useState<Array<EtmContractForControl>>([] as Array<EtmContractForControl>);
    const [currentItems, setCurrentItems] = useState<Array<EtmContractForControl>>([] as Array<EtmContractForControl>);
    const [itemsPerPage, setItemsPerPage] = useState<string>('8');

    useEffect(() => {
        document.title = 'Lịch sử đối soát doanh thu';

        setPaging([
            {
                title: 'Doanh thu',
                to: '#',
                active: true
            }, {
                title: 'Lịch sử đối soát',
                to: '#',
                active: true
            }
        ]);

        setActionData([
            {
                icon: <FontAwesomeIcon icon={faFileExport} />,
                title: 'Xuất dữ liệu',
                onClick: () => { }
            }
        ]);

        dispatch(getEtmContractForControls());

        const currentDate = new Date();
        let month = `${currentDate.getMonth() + 1}`;
        let date = `${currentDate.getDate() + 1}`;

        if ((currentDate.getMonth() + 1) < 10) month = `0${currentDate.getMonth() + 1}`;
        if ((currentDate.getDate()) < 10) date = `0${currentDate.getDate()}`;

        setDate(`${currentDate.getFullYear()}-${month}-${date}`);
    }, []);

    useEffect(() => {
        setSearchResult(etmContract.etmContractForControl);
    }, [etmContract.etmContractForControl]);

    useEffect(() => {
        setSearchResult(etmContract.etmContractForControl.filter(contract => (
            (contract.checkpointDate !== '' && typeof contract.checkpointDate !== 'undefined') &&
            +new Date(formatDateYMD(contract.checkpointDate)).getMonth() === +new Date(date).getMonth() &&
            +new Date(formatDateYMD(contract.checkpointDate)).getFullYear() === +new Date(date).getFullYear()
        )));
    }, [date]);

    useEffect(() => {
        let value = searchValue.trim().toLowerCase();

        if (value === '') {
            setSearchResult(etmContract.etmContractForControl);
            return;
        }

        setSearchResult(etmContract.etmContractForControl.filter(contract =>
            contract.records.some(record => record.nameRecord.toLowerCase().includes(value))
        ));
    }, [searchValue]);

    const handleSetCurrentItems = useCallback((items: Array<any>) => {
        setCurrentItems(items);
    }, []);

    const handleChange = useCallback((value: string) => {
        setItemsPerPage(value);
    }, []);

    return (
        <CommonPage
            title='Lịch sử đối soát doanh thu'
            pagingData={paging}
            actionData={actionData}
            actionFilter={<div className={cx('filter-box')}>
                <p style={{ marginRight: '16px' }}>Thời gian thực hiện:</p>
                <Input type='date' value={date} onChange={(e: any) => setDate(e.target.value)} />
            </div>}
            search={{
                placeHolder: 'Nhập tên bài hát',
                searchValue: searchValue,
                setSearchValue: (e: any) => setSearchValue(e.target.value)
            }}
            className={cx('history-for-control')}
        >
            <p>Danh sách hợp đồng khai thác đã đối soát</p>
            <Table
                paginate={{
                    dataForPaginate: searchResult,
                    setCurrentItems: handleSetCurrentItems
                }}
                loading={etmContract.loading}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={handleChange}
                thead={['STT', 'Số hợp đồng', 'Đơn vị khai thác', 'Thời hạn hợp đồng', 'Loại hợp đồng',
                    'Tổng lượt phát', 'Tổng doanh thu', 'Doanh thu chưa phân phối', 'Ngày chốt đối soát', '']}
                className={cx('history-for-control__table', 'container-table-data')}
            >
                {currentItems.map((item, index) => {
                    let CPM = item.CPM || 0;

                    return (
                        <tr key={item.id} style={{ height: '47px' }}>
                            <td><p>{index + 1}</p></td>
                            <td><p>{item.code}</p></td>
                            <td><p>{item.companyName}</p></td>
                            <td><p>{item.expirationDate}</p></td>
                            <td><p>{item.type}</p></td>
                            <td><p>{item.totalPlay}</p></td>
                            <td><p>{formatMoney(item.totalPlay * (CPM / 1000)).split('₫')[0]}</p></td>
                            <td><p>{item.unDistributedRevenue}</p></td>
                            <td><p>{item.checkpointDate}</p></td>
                            <td><p
                                className={cx('action')}
                                onClick={() => {
                                    navigate(`/revenue/history-for-control/detail/${item.id}`);
                                    setActive(false);
                                }}
                            >
                                Xem chi tiết
                            </p></td>
                        </tr>
                    )
                })}
            </Table>
        </CommonPage>
    );
}

export default HistoryForControlPage;