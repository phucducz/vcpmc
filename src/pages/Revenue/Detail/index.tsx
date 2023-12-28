import { faFileExport } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames/bind";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";

import { ContractDetail, RecordDetail } from "~/api/authorizedContract";
import { Record } from "~/api/recordAPI";
import { RecordPlays } from "~/api/recordPlay";
import { PagingItemType } from "~/components/Paging";
import { Table } from "~/components/Table";
import { routes } from "~/config/routes";
import { formatMoney } from "~/context";
import { CommonPage } from "~/pages/CommonPage";
import { RootState } from "~/store";
import style from './Detail.module.scss';

const cx = classNames.bind(style);

function RevenueDetailPage() {
    const { id } = useParams();

    const contract = useSelector((state: RootState) => state.authorized);

    const [paging, setPaging] = useState<Array<PagingItemType>>([] as Array<PagingItemType>);
    const [actionData, setActionData] = useState<any[]>([] as any[]);
    const [searchValue, setSearchValue] = useState<string>('');
    const [contractDetail, setContractDetail] = useState<ContractDetail>({} as ContractDetail);
    const [searchResult, setSearchResult] = useState<Array<RecordDetail>>([] as Array<RecordDetail>);
    const [loading, setLoading] = useState<boolean>(false);
    const [currentItems, setCurrentItems] = useState<Array<RecordDetail>>([] as Array<RecordDetail>);
    const [itemsPerPage, setItemsPerPage] = useState<string>('8');
    const [itemActive, setItemActive] = useState<RecordDetail & { totalPlay: number, revenue: number }>({
        records: {} as Record,
        recordPlays: [] as Array<RecordPlays>,
        totalPlay: 0,
        revenue: 0
    } as RecordDetail & { totalPlay: number, revenue: number });

    useEffect(() => {
        setPaging([
            {
                title: 'Doanh thu',
                to: routes.RevenueManagement,
                active: true
            }, {
                title: 'Phân phối doanh thu',
                to: routes.RevenueManagement,
                active: true
            }, {
                title: 'Chi tiết doanh thu',
                to: '#',
                active: false
            }
        ]);

        setActionData([
            {
                icon: <FontAwesomeIcon icon={faFileExport} />,
                title: 'Xuất dữ liệu',
                onClick: () => { }
            }
        ]);

        const contractDetail = contract.contractDetails.find(contractDetail => contractDetail.contract.id === id) || {} as ContractDetail

        setContractDetail(contractDetail);
        setSearchResult(contractDetail.records);
    }, []);

    useEffect(() => {
        if (typeof contractDetail.records === 'undefined') return;

        let value = searchValue.trim().toLowerCase();

        if (value === '') {
            setCurrentItems(contractDetail.records);
            return;
        }

        setCurrentItems(contractDetail.records.filter(record =>
            record.records.nameRecord.toLowerCase().includes(value))
        );
    }, [searchValue]);

    const handleSetCurrentItems = useCallback((items: Array<any>) => {
        setCurrentItems(items);
    }, []);

    const handleChange = useCallback((value: string) => {
        setItemsPerPage(value);
    }, []);

    const handleRecordItemClick = (item: RecordDetail) => {
        let revenue = item.totalPlay * parseInt(contractDetail.contract.CPM) / 1000;

        setItemActive({ ...item, revenue: revenue });
    }

    return (
        <>{Object.keys(contractDetail).length > 0 &&
            <CommonPage
                title={`Hợp đồng Ủy quyền ${contractDetail.contract.contractCode} -${contractDetail.date}`}
                pagingData={paging}
                search={{
                    placeHolder: 'Nhập tên bài hát',
                    searchValue: searchValue,
                    setSearchValue: (e: any) => setSearchValue(e.target.value)
                }}
                actionData={actionData}
                className={cx('revenue-detail')}
            >
                <div className={cx('revenue-detail__table')}>
                    <Table
                        paginate={{
                            dataForPaginate: searchResult,
                            setCurrentItems: handleSetCurrentItems
                        }}
                        paginateClass={cx('table__paginate')}
                        loading={loading}
                        itemsPerPage={itemsPerPage}
                        setItemsPerPage={handleChange}
                        thead={['STT', 'Bài hát', 'Số lượt phát', 'Doanh thu (VNĐ)', 'Hành chính phí (VNĐ)', 'Nhuận bút (VNĐ)']}
                        border={0}
                        cellPadding="0"
                        cellSpacing="0"
                        className={cx('revenue-detail__table-record')}
                    >
                        <tr style={{ height: '56px' }}>
                            <td><p>Tổng</p></td>
                            <td><p>{currentItems.length}</p></td>
                            <td><p>{currentItems.reduce((sum, item) => sum + item.totalPlay, 0)}</p></td>
                            <td><p>{formatMoney(currentItems.reduce((sum, item) => sum + item.totalPlay, 0) * parseInt(contractDetail.contract.CPM) / 1000).split('₫')[0]}</p></td>
                            <td><p>{formatMoney(currentItems.reduce((sum, item) => sum + item.totalPlay, 0) * parseInt(contractDetail.contract.CPM) / 1000 * parseInt(contractDetail.contract.administrativeFee) / 100).split('₫')[0]}</p></td>
                            <td><p>{formatMoney(currentItems.reduce((sum, item) => sum + item.totalPlay, 0) * parseInt(contractDetail.contract.CPM) / 1000 * parseInt(contractDetail.contract.royalties) / 100).split('₫')[0]}</p></td>
                        </tr>
                        {currentItems.map((item, index) => {
                            let revenue = item.totalPlay * parseInt(contractDetail.contract.CPM) / 1000;
                            let royalties = revenue * parseInt(contractDetail.contract.royalties) / 100;
                            let administrativeFee = revenue * parseInt(contractDetail.contract.administrativeFee) / 100;

                            return (
                                <tr key={item.records.id} style={{ height: '56px' }} className={cx('table-record__tr__item')} onClick={() => handleRecordItemClick(item)}>
                                    <td><p style={{ textAlign: 'center' }}>{index + 1}</p></td>
                                    <td><p>{item.records.nameRecord}</p></td>
                                    <td><p>{item.totalPlay}</p></td>
                                    <td><p>{formatMoney(revenue).split('₫')[0]}</p></td>
                                    <td><p>{formatMoney(administrativeFee).split('₫')[0]}</p></td>
                                    <td><p>{formatMoney(royalties).split('₫')[0]}</p></td>
                                </tr>
                            )
                        })}
                    </Table>
                    <div className={cx('table-right')}>
                        <p className={cx('table-right__title')}>Doanh thu bản ghi</p>
                        <p className={cx('table-right__record-name')}>{itemActive.records.nameRecord || 'Tên bản ghi'}</p>
                        <Table
                            paginateClass={cx('table__paginate')}
                            itemsPerPage={itemsPerPage}
                            setItemsPerPage={handleChange}
                            thead={['Đơn vị khai thác', 'Số lượt phát', 'Doanh thu (VNĐ)']}
                            border={0}
                            cellPadding="0"
                            cellSpacing="0"
                            className={cx('table__record-plays')}
                        >
                            <tr style={{ height: '47px' }}>
                                <td><p>Tổng</p></td>
                                <td><p>{itemActive.recordPlays.reduce((sum, item) => sum + parseInt(item.playsCount), 0)}</p></td>
                                <td><p>{formatMoney(itemActive.revenue).split('₫')[0]}</p></td>
                            </tr>
                            {itemActive.recordPlays.map((item) => {
                                let revenue = parseInt(item.playsCount) * parseInt(contractDetail.contract.CPM) / 1000;

                                return (
                                    <tr key={item.id} style={{ height: '47px' }} className={cx('table-record__tr__item')}>
                                        <td><p>CTy TNHH A</p></td>
                                        <td><p>{item.playsCount}</p></td>
                                        <td><p>{formatMoney(revenue).split('₫')[0]}</p></td>
                                    </tr>
                                )
                            })}
                        </Table>
                    </div>
                </div>
            </CommonPage>
        }</>
    );
}

export default RevenueDetailPage;