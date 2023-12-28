import { faFileExport } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CategoryScale, Chart as ChartJS, Legend, LineElement, LinearScale, PointElement, Tooltip } from "chart.js";
import classNames from "classnames/bind";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import { ChartJSOrUndefined, ForwardedRef } from "react-chartjs-2/dist/types";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

import { EtmContractForControl } from "~/api/etmContractAPI";
import { RecordPlays } from "~/api/recordPlay";
import { ComboBox } from "~/components/ComboBox";
import Loading from "~/components/Loading";
import { PagingItemType } from "~/components/Paging";
import { routes } from "~/config/routes";
import { QUARTERLY, Quarter } from "~/constants";
import { formatDateYMD, formatMoney } from "~/context";
import { useMenu } from "~/context/hooks";
import { Icon, ecreiptIcon } from "~/icons";
import { CommonPage } from "~/pages/CommonPage";
import { RootState, useAppDispatch } from "~/store";
import { getEtmContractForControls } from "~/thunk/etmContractThunk";
import { getRecordPlays } from "~/thunk/recordPlayThunk";
import style from './Report.module.scss';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

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

type ChartDataSet = {
    label: string;
    data: Array<any>;
    borderColor: string;
    tension: number;
    backgroundColor?: any;
}

type ChartType = {
    labels: Array<any>;
    datasets: Array<ChartDataSet>;
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
    const [chartData, setChartData] = useState<ChartType>({
        labels: [],
        datasets: [{
            label: 'Lượt nghe',
            data: [],
            borderColor: 'orange',
            tension: 0.1,
            backgroundColor: ''
        }],
    });

    const REVENUE_INFO_KEYS = ['Tổng số bài hát', 'Tổng số lượt phát', 'Doanh thu trên lượt phát', 'Doanh thu chưa phân phối', 'Hành chính phí'];
    const options = {
        plugins: {
            tooltip: {
                enabled: false,
                external: (context: any) => {
                    let linesSplit = context.tooltip.body && context.tooltip.body[0].lines[0].split(':');
                    let tooltipEl = document.getElementById('chartjs-tooltip');

                    if (!tooltipEl) {
                        tooltipEl = document.createElement('div');
                        tooltipEl.id = 'chartjs-tooltip';
                        tooltipEl.innerHTML = `<div></div>`;
                        document.body.appendChild(tooltipEl);
                    }

                    const tooltipModel = context.tooltip;

                    if (tooltipModel.body)
                        tooltipEl.innerHTML = `
                            <p id='chartjs-tooltip__title'>${linesSplit[0]}</p>
                            <p id='chartjs-tooltip__content'>${linesSplit[1].trim()}</p>
                            <div id='chartjs-tooltip__arrow'></div>
                        `;

                    const position = context.chart.canvas.getBoundingClientRect();

                    tooltipEl.style.opacity = '0.7';
                    tooltipEl.style.backgroundColor = 'rgba(62, 62, 91)';
                    tooltipEl.style.borderRadius = '10px';
                    tooltipEl.style.paddingTop = '8px';
                    tooltipEl.style.position = 'absolute';
                    tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX - 80 + 'px';
                    tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY - 105 + 'px';
                    tooltipEl.style.padding = tooltipModel.padding + 'px ' + tooltipModel.padding + 'px';
                    tooltipEl.style.width = '156.566px';
                    tooltipEl.style.height = '80px';
                    tooltipEl.style.transition = 'opacity .2s linear';
                    tooltipEl.style.boxShadow = 'rgba(0, 0, 0, 0.7) 0px 7px 15px 1px';

                    let tooltipElTitle = document.getElementById('chartjs-tooltip__title');
                    if (tooltipElTitle) {
                        tooltipElTitle.style.color = 'rgba(235, 235, 245, 0.60)';
                        tooltipElTitle.style.textAlign = 'center';
                        tooltipElTitle.style.fontSize = '14px';
                        tooltipElTitle.style.fontWeight = '500';
                        tooltipElTitle.style.lineHeight = 'normal';
                        tooltipElTitle.style.letterSpacing = '0.21px';

                    }

                    let tooltipElContent = document.getElementById('chartjs-tooltip__content');
                    if (tooltipElContent) {
                        tooltipElContent.style.color = '#FFF';
                        tooltipElContent.style.textAlign = 'center';
                        tooltipElContent.style.fontSize = '16px';
                        tooltipElContent.style.fontWeight = '700';
                        tooltipElContent.style.lineHeight = '24px';
                        tooltipElContent.style.letterSpacing = '-0.032px';
                    }

                    let tooltipElArrow = document.getElementById('chartjs-tooltip__arrow');
                    if (tooltipElArrow) {
                        tooltipElArrow.style.height = '1rem';
                        tooltipElArrow.style.width = '1rem';
                        tooltipElArrow.style.position = 'absolute';
                        tooltipElArrow.style.left = '45%';
                        tooltipElArrow.style.bottom = '-5px';
                        tooltipElArrow.style.borderLeft = '20px solid rgba(62, 62, 91, 0.70)';
                        tooltipElArrow.style.borderTop = '20px solid transparent';
                        tooltipElArrow.style.transform = 'rotate(135deg)';
                        tooltipElArrow.style.zIndex = '1';
                        tooltipElArrow.style.backgroundColor = 'rgba(62, 62, 91)';
                    }

                    if (tooltipModel.opacity === 0)
                        tooltipEl.style.opacity = '0';
                }
            },
            legend: { display: false },
            interaction: {
                intersect: false,
                mode: 'point'
            }
        },
        elements: {
            point: {
                hitRadius: 10,
                hoverRadius: 10,
                hoverBorderWidth: 4,
                hoverBorderColor: 'white',
            },
            legend: {
                display: false
            }
        },
        onHover: (event: any, chartElement: any) => {
            event.native.target.style.cursor = chartElement[0] ? 'pointer' : 'default';
        }
    }

    useEffect(() => {
        if (!contracts.length) return;

        let daysOfMonth: Array<number> = [];
        let dataOfDatasets: Array<number> = [];

        for (let i = 0; i < 31; i++)
            daysOfMonth.push(i + 1);
        for (let i = 0; i < 9; i++)
            dataOfDatasets.push(i + 1);

        type RecordPlayOfMonth = { date: Date; playsCount: number };
        let recordPlayOfMonth: Array<RecordPlayOfMonth> = [];
        contracts.map(contract => {
            return contract.recordPlay.map(recordPlay => {
                recordPlayOfMonth.push({
                    date: new Date(formatDateYMD(recordPlay.date)),
                    playsCount: +recordPlay.playsCount
                });
            })
        });

        setChartData({
            labels: daysOfMonth,
            datasets: [{
                label: 'Lượt nghe',
                data: recordPlayOfMonth
                    .sort((a: RecordPlayOfMonth, b: RecordPlayOfMonth) =>
                        a.date.getMonth() - b.date.getMonth()).map(item => item.playsCount),
                borderColor: 'orange',
                backgroundColor: 'orange',
                tension: 1,
            }],
        });
    }, [contracts]);

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
                        onClick={() => setFilterTypeActive(!filterTypeActive)}
                        onItemClick={handleItemTypeClick}
                    />
                    <ComboBox
                        data={filter.data.map(item => ({ title: item }))}
                        active={filter.dataActive}
                        visible={filterDataActive}
                        className={cx('renvenue-report__filter__data')}
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
                <div style={{ color: 'white' }}><Line data={chartData} options={options}></Line></div>
            </div>
            <Loading visible={etmContract.loading} />
        </CommonPage>
    );
}

export default RevenueReportPage;