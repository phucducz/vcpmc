import classNames from "classnames/bind";
import { memo, useCallback, useEffect, useMemo, useState } from "react";

import { faFileExport } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector } from "react-redux";
import { EtmContractForControl } from "~/api/etmContractAPI";
import { ComboBox } from "~/components/ComboBox";
import { PagingItemType } from "~/components/Paging";
import { routes } from "~/config/routes";
import { QUARTERLY, Quarter } from "~/constants";
import { formatDateYMD, formatMoney } from "~/context";
import { Icon, ecreiptIcon } from "~/icons";
import { CommonPage } from "~/pages/CommonPage";
import { RootState, useAppDispatch } from "~/store";
import { getEtmContractForControls } from "~/thunk/etmContractThunk";
import style from './Report.module.scss';
import { useNavigate } from "react-router";
import { useMenu } from "~/context/hooks";
import Loading from "~/components/Loading";
import { getRecordPlays } from "~/thunk/recordPlayThunk";
import { RecordPlays } from "~/api/recordPlay";

const cx = classNames.bind(style);

export interface Filter {
    type: 'Theo tháng' | 'Theo quý' | '';
    data: Array<string>;
    dataActive: string;
}

type RevenueInfo = {
    totalRecord: number;
    totalPlay: number;
    revenue: string;
    unDistributedRevenue: string;
    administrativeFee: string;
}

type RevenueInfoBox = {
    data: { key: string; value: number | string };
    className?: string;
}

const RevenueInfoBoxItem = memo(({ data, className }: RevenueInfoBox) => {
    return (
        <div className={cx('box__item', className)}>
            <p>{data.key}</p>
            <p>{data.value}</p>
        </div>
    );
});

function RevenueReportPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { setActive } = useMenu();

    const etmContract = useSelector((state: RootState) => state.etmContract);
    const recordPlay = useSelector((state: RootState) => state.recordPlay);

    const [paging, setPaging] = useState<Array<PagingItemType>>([] as Array<PagingItemType>);
    const [actionData, setActionData] = useState<any[]>([] as any[]);
    const [filter, setFilter] = useState<Filter>({ type: '', data: [], dataActive: '' } as Filter);
    const [filterTypeActive, setFilterTypeActive] = useState<boolean>(false);
    const [filterDataActive, setFilterDataActive] = useState<boolean>(false);
    const [currentDate, setCurrentDate] = useState<Date>();
    const [contracts, setContracts] = useState<Array<EtmContractForControl & { recordPlay: Array<RecordPlays> }>>([] as Array<EtmContractForControl & { recordPlay: Array<RecordPlays> }>);
    const [revenueInfo, setRevenueInfo] = useState<RevenueInfo>({
        totalRecord: 0,
        totalPlay: 0,
        revenue: '',
        unDistributedRevenue: '',
        administrativeFee: ''
    } as RevenueInfo);

    const REVENUE_INFO_KEYS = ['Tổng số bài hát', 'Tổng số lượt phát', 'Doanh thu trên lượt phát', 'Doanh thu chưa phân phối', 'Hành chính phí'];

    useEffect(() => {
        setPaging([
            {
                title: 'Doanh thu',
                to: '#',
                active: true
            }, {
                title: 'Báo cáo doanh thu',
                to: '#',
                active: true
            }
        ]);

        setActionData([
            {
                icon: <Icon icon={ecreiptIcon} />,
                title: 'Báo cáo chi tiết',
                onClick: () => {
                    navigate(routes.RevenueReportDetail);
                    setActive(false);
                }
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
        recordPlay.recordPlays.length === 0 && dispatch(getRecordPlays());
    }, []);

    useEffect(() => {
        setRevenueInfo({
            totalRecord: contracts.reduce((sum, item) => sum + item.records.length, 0),
            totalPlay: contracts.reduce((sum, item) => sum + item.totalPlay, 0),
            revenue: `${formatMoney(contracts.reduce((sum, item) => sum + (item.CPM / 1000 * item.totalPlay), 0)).split('₫')[0]}đ`,
            unDistributedRevenue: `${formatMoney(contracts.reduce((sum, item) => sum + item.unDistributedRevenue, 0)).split('₫')[0]}đ`,
            administrativeFee: `${formatMoney(contracts.reduce((sum, item) => sum + (item.CPM / 1000 * item.administrativeFee), 0)).split('₫')[0]}đ`,
        });
    }, [contracts]);

    useEffect(() => {
        if (typeof currentDate === 'undefined' || !etmContract.etmContractForControl.length) return;

        setContracts(etmContract.etmContractForControl
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

    const handleItemDataClick = useCallback((item: any) => {
        if (typeof currentDate === 'undefined') return;

        setFilter({ ...filter, dataActive: `${item.title}/${currentDate.getFullYear()}` });
    }, [filter]);

    return (
        <CommonPage
            pagingData={paging}
            title='Báo cáo doanh thu'
            actionData={actionData}
            actionFilter={
                <div className={cx('renvenue-report__filter')}>
                    <p>Theo:</p>
                    <ComboBox
                        data={[{ title: 'Theo tháng' }, { title: 'Theo quý' }]}
                        active={filter.type}
                        visible={filterTypeActive}
                        className={cx('renvenue-report__filter__type')}
                        style={{ width: '264px' }}
                        onClick={() => setFilterTypeActive(!filterTypeActive)}
                        onItemClick={handleItemTypeClick}
                    />
                    <ComboBox
                        data={filter.data.map(item => ({ title: item }))}
                        active={filter.dataActive}
                        visible={filterDataActive}
                        className={cx('renvenue-report__filter__data')}
                        style={{ width: '264px' }}
                        onClick={() => setFilterDataActive(!filterDataActive)}
                        onItemClick={handleItemDataClick}
                    />
                </div>
            }
            className={cx('revenue-report')}
        >
            <div className={cx('revenue-report__box')}>
                {Object.entries(revenueInfo).map((item, index) => (
                    <RevenueInfoBoxItem key={index} data={{ key: REVENUE_INFO_KEYS[index], value: item[1] }} />
                ))}
            </div>
            <div className={cx('revenue-report-chart')}>
                <p>Biểu đồ theo dõi lượt phát - {
                    filter.type === 'Theo tháng'
                        ? `${currentDate?.getDate()}/${filter.dataActive.split(' ')[1]}`
                        : filter.dataActive
                }</p>
            </div>
            <Loading visible={etmContract.loading} />
        </CommonPage>
    );
}

export default RevenueReportPage;