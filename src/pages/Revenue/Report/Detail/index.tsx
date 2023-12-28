import { faFileExport } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames/bind";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

import { EtmContractForControl } from "~/api/etmContractAPI";
import { Button } from "~/components/Button";
import { ComboBox } from "~/components/ComboBox";
import { Form } from "~/components/Form";
import { PagingItemType } from "~/components/Paging";
import { Table } from "~/components/Table";
import { routes } from "~/config/routes";
import { QUARTERLY, Quarter } from "~/constants";
import { formatDateYMD } from "~/context";
import { useMenu } from "~/context/hooks";
import { Icon, fileCheckAltIcon } from "~/icons";
import { CommonPage } from "~/pages/CommonPage";
import { RootState, useAppDispatch } from "~/store";
import { checkpointAllContract, getEtmContractForControls } from "~/thunk/etmContractThunk";
import { Filter } from "../Report";
import style from './Detail.module.scss';

const cx = classNames.bind(style);

function RevenueReportDetailPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const etmContract = useSelector((state: RootState) => state.etmContract);

    const { setActive } = useMenu();

    const [paging, setPaging] = useState<Array<PagingItemType>>([] as Array<PagingItemType>);
    const [actionData, setActionData] = useState<any[]>([] as any[]);
    const [filter, setFilter] = useState<Filter>({ type: '', data: [], dataActive: '' } as Filter);
    const [filterTypeActive, setFilterTypeActive] = useState<boolean>(false);
    const [filterDataActive, setFilterDataActive] = useState<boolean>(false);
    const [currentDate, setCurrentDate] = useState<Date>();
    const [searchResult, setSearchResult] = useState<Array<EtmContractForControl>>([] as Array<EtmContractForControl>);
    const [searchValue, setSearchValue] = useState<string>('');
    const [currentItems, setCurrentItems] = useState<Array<EtmContractForControl>>([] as Array<EtmContractForControl>);
    const [itemsPerPage, setItemsPerPage] = useState<string>('8');
    const [toastActive, setToastActive] = useState<boolean>(false);

    useEffect(() => {
        setPaging([
            {
                title: 'Doanh thu',
                to: routes.RevenueReport,
                active: true
            }, {
                title: 'Báo cáo doanh thu',
                to: routes.RevenueReport,
                active: true
            }, {
                title: 'Báo cáo chi tiết',
                to: '#',
                active: false
            }
        ]);

        setActionData([
            {
                icon: <Icon icon={fileCheckAltIcon} />,
                title: 'Chốt doanh thu',
                onClick: () => setToastActive(true)
            },
            {
                icon: <FontAwesomeIcon icon={faFileExport} />,
                title: 'Xuất dữ liệu',
                onClick: () => { }
            }
        ]);

        let currentDate = new Date();
        let months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(month => `Tháng ${month}`);

        setFilter({
            ...filter,
            data: months,
            type: 'Theo tháng',
            dataActive: `Tháng ${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`
        });

        setCurrentDate(currentDate);
        etmContract.etmContractForControl.length === 0 && dispatch(getEtmContractForControls());
    }, []);

    useEffect(() => {
        if (!etmContract.etmContractForControl.length) return;

        setSearchResult(etmContract.etmContractForControl);
    }, [etmContract.etmContractForControl]);

    const handleItemTypeClick = useCallback((item: any) => {
        if (typeof currentDate === 'undefined') return;

        let months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(month => `Tháng ${month}`);
        let quarters = QUARTERLY.map(quaterly => quaterly.quarter);

        item.title === 'Theo tháng'
            ? setFilter({
                ...filter,
                data: months,
                type: 'Theo tháng',
                dataActive: `Tháng ${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`
            })
            : setFilter({
                ...filter,
                data: quarters,
                type: 'Theo quý',
                dataActive: `${quarters[0]}/${currentDate.getFullYear()}`
            });
    }, [filter]);

    useEffect(() => {
        if (typeof currentDate === 'undefined' || !etmContract.etmContractForControl.length) return;

        setSearchResult(etmContract.etmContractForControl
            .map(contract => {
                let quarter: Quarter = { quarter: '', time: '' };

                if (filter.type === 'Theo quý')
                    quarter = QUARTERLY.find(quarter => quarter.quarter === filter.dataActive.split('/')[0]) || { quarter: '', time: '' };

                let recordPlayArray = contract.recordPlay
                    .filter(recordPlay => {
                        let recordPlayDate = new Date(formatDateYMD(recordPlay.date));

                        if (filter.type === 'Theo tháng') {
                            let filterDate = new Date(formatDateYMD(`${currentDate.getDate()}/${filter.dataActive.split(' ')[1]}`));
                            return recordPlayDate.getMonth() === filterDate.getMonth() && recordPlayDate.getFullYear() === filterDate.getFullYear();
                        }
                        else {
                            let timeSplit = quarter.time.split('-');
                            let startTimeSplit = timeSplit[0].trim().split('/');
                            let endTimeSplit = timeSplit[1].trim().split('/');
                            let startDate = new Date(formatDateYMD(`${currentDate.getFullYear()}-${startTimeSplit[1]}-${startTimeSplit[0]}`));
                            let endDate = new Date(formatDateYMD(`${currentDate.getFullYear()}-${endTimeSplit[1]}-${endTimeSplit[0]}`));

                            return recordPlayDate.getMonth() >= startDate.getMonth() && recordPlayDate.getMonth() <= endDate.getMonth();
                        }
                    });

                let totalPlay = recordPlayArray.reduce((sum, item) => sum + parseInt(item.playsCount), 0);

                if (recordPlayArray.length)
                    return {
                        ...contract,
                        recordPlay: recordPlayArray,
                        totalPlay: totalPlay,
                        revenue: totalPlay * contract.CPM / 1000,
                    }

                return {
                    ...contract,
                    records: [],
                    unDistributedRevenue: 0,
                    administrativeFee: 0,
                    recordPlay: recordPlayArray,
                    totalPlay: totalPlay,
                    revenue: totalPlay * contract.CPM / 1000,
                }
            })
        );
    }, [filter, etmContract.etmContractForControl]);

    useEffect(() => {
        let value = searchValue.trim().toLowerCase();

        if (value === '') {
            setSearchResult(etmContract.etmContractForControl);
            return;
        }

        setSearchResult(etmContract.etmContractForControl.filter(contract => contract.code.toLowerCase().includes(value)));
    }, [searchValue]);

    const handleItemDataClick = useCallback((item: any) => {
        if (typeof currentDate === 'undefined') return;

        setFilter({ ...filter, dataActive: `${item.title}/${currentDate.getFullYear()}` });
    }, [filter]);

    const handleSetCurrentItems = useCallback((items: Array<any>) => {
        setCurrentItems(items);
    }, []);

    const handleChange = useCallback((value: string) => {
        setItemsPerPage(value);
    }, []);

    const handleForControlSubmit = useCallback(async () => {
        if (typeof currentDate === 'undefined') return;

        dispatch(checkpointAllContract({
            contracts: searchResult,
            checkpointDate: `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`
        }));

        setToastActive(false);
    }, [searchResult]);

    return (
        <CommonPage
            pagingData={paging}
            title='Báo cáo doanh thu'
            actionData={actionData}
            actionFilter={
                <div className={cx('renvenue-report-detail__filter')}>
                    <p>Theo:</p>
                    <ComboBox
                        data={[{ title: 'Theo tháng' }, { title: 'Theo quý' }]}
                        active={filter.type}
                        visible={filterTypeActive}
                        className={cx('renvenue-report-detail__filter__type')}
                        style={{ width: '264px' }}
                        onClick={() => setFilterTypeActive(!filterTypeActive)}
                        onItemClick={handleItemTypeClick}
                    />
                    <ComboBox
                        data={filter.data.map(item => ({ title: item }))}
                        active={filter.dataActive}
                        visible={filterDataActive}
                        className={cx('renvenue-report-detail__filter__data')}
                        style={{ width: '264px' }}
                        onClick={() => setFilterDataActive(!filterDataActive)}
                        onItemClick={handleItemDataClick}
                    />
                </div>
            }
            search={{
                placeHolder: 'Nhập số hợp đồng',
                searchValue: searchValue,
                setSearchValue: (e: React.ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value)
            }}
            className={cx('renvenue-report-detail')}
        >
            <Table
                thead={['STT', 'Số hợp đồng', 'Dơn vị khai thác', 'Thời hạn hợp đồng', 'Loại hợp đồng',
                    'Số thiết bị đã đồng bộ', 'Tổng số lượt phát', 'Ngày chốt đối soát', '', '']}
                paginate={{
                    dataForPaginate: searchResult,
                    setCurrentItems: handleSetCurrentItems
                }}
                loading={etmContract.loading}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={handleChange}
                className={cx('container-table-data', 'renvenue-report-detail__table')}
            >
                {currentItems.map((item, index) => (
                    <tr key={index} style={{ height: '47px' }}>
                        <td><p>{index + 1}</p></td>
                        <td><p>{item.code}</p></td>
                        <td><p>{item.companyName}</p></td>
                        <td><p>{item.effectiveDate} - {item.expirationDate}</p></td>
                        <td><p>{item.type}</p></td>
                        <td><p>{index + 1}</p></td>
                        <td><p>{item.totalPlay}</p></td>
                        <td><p>{item.checkpointDate}</p></td>
                        <td><p className={cx('action')} onClick={() => {
                            navigate(`/revenue-report/detail/contract/${item.id}`);
                            setActive(false);
                        }}>Chi tiết doanh thu</p></td>
                        <td><p className={cx('action')}>Lịch sử đồng bộ trên thiết bị</p></td>
                    </tr>
                ))}
            </Table>
            <Form
                visible={toastActive}
                title='Chốt doanh thu'
                type="dialog"
                className={cx('renvenue-report-detail__form')}
            >
                <div className={cx('form__content')}>
                    <p>Doanh thu sẽ được chốt từ ngày 01/05/2021 đến ngày 14/05/2021 trên tất cả các hợp đồng sử dụng. </p>
                    <p>{`Nhấn <Tiếp tục> để chốt doanh thu.`}</p>
                    <p>{`Nhấn <Hủy> để hủy bỏ và không chốt doanh thu.`}</p>
                </div>
                <div className={cx('form__action')}>
                    <Button outline type='button' onClick={() => setToastActive(false)}>Hủy</Button>
                    <Button type='button' onClick={handleForControlSubmit}>Tiếp tục</Button>
                </div>
            </Form>
        </CommonPage>
    );
}

export default RevenueReportDetailPage;