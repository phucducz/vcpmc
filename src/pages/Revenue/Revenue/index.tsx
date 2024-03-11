import { faFileExport } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames/bind";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

import { ContractDetail, RecordDetail } from "~/api/authorizedContract";
import { Category } from "~/api/categoryAPI";
import { Input } from "~/components/Input";
import { PagingItemType } from "~/components/Paging";
import { Table } from "~/components/Table";
import { routes } from "~/config/routes";
import { formatDateDMYHPTS, formatDateYMD, formatMoney } from "~/context";
import { useMenu } from "~/context/hooks";
import { CommonPage } from "~/pages/CommonPage";
import { setContractsDetail } from "~/reducers/authorizedContract";
import { RootState, useAppDispatch } from "~/store";
import { getAuthorizedContracts } from "~/thunk/authorizedContractThunk";
import { getRecordPlays } from "~/thunk/recordPlayThunk";
import { getRecords } from "~/thunk/recordThunks";
import style from './Revenue.module.scss';

const cx = classNames.bind(style);

function RevenueManagementPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { setActive } = useMenu();

    const authorized = useSelector((state: RootState) => state.authorized);
    const recordPlay = useSelector((state: RootState) => state.recordPlay);
    const record = useSelector((state: RootState) => state.record);

    const [paging, setPaging] = useState<Array<PagingItemType>>([] as Array<PagingItemType>);
    const [searchValue, setSearchValue] = useState<string>('');
    const [searchResult, setSearchResult] = useState<Array<ContractDetail>>([] as Array<ContractDetail>);
    const [currentItems, setCurrentItems] = useState<Array<ContractDetail>>([] as Array<ContractDetail>);
    const [actionData, setActionData] = useState<any[]>([] as any[]);
    const [itemsPerPage, setItemsPerPage] = useState<string>('8');
    const [contractDetailList, setContractDetailList] = useState<Array<ContractDetail>>([] as Array<ContractDetail>);
    const [loading, setLoading] = useState<boolean>(false);
    const [date, setDate] = useState<string>('');

    useEffect(() => {
        document.title = 'Quản lý phân phối doanh thu';

        setPaging([
            {
                title: 'Doanh thu',
                to: routes.RevenueManagement,
                active: true
            }, {
                title: 'Phân phối doanh thu',
                to: routes.RevenueManagement,
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

        authorized.contracts.length <= 0 && dispatch(getAuthorizedContracts());
        record.recordList.length <= 0 && dispatch(getRecords({
            categoryList: [] as Array<Category>,
        }));
        dispatch(getRecordPlays());

        let dateList = new Date().toLocaleString().split(',')[0].split('/');
        let month = dateList[0];
        let date = dateList[1];

        if (parseInt(dateList[0]) < 10) month = `0${dateList[0]}`;
        if (parseInt(dateList[1]) < 10) date = `0${dateList[1]}`;

        setDate(`2023-11-${date}`);
        // setDate(`${dateList[dateList.length - 1]}-${month}-${date}`);
    }, []);

    useEffect(() => {
        if (authorized.contracts.length <= 0 || record.recordList.length <= 0 ||
            recordPlay.recordPlays.length <= 0) return;

        const contractsDetail = authorized.contracts.map(contract => {
            const recordItem = record.recordList.filter(record => record.contractId === contract.id);
            const records: RecordDetail[] = recordItem.map(record => {
                const recordPlayItem = recordPlay.recordPlays.filter(recordPlay => recordPlay.recordsId === record.id);

                return {
                    records: record,
                    recordPlays: recordPlayItem,
                    totalPlay: recordPlayItem.reduce((sum, item) => sum + parseInt(item.playsCount), 0)
                }
            });
            const totalPlay = records.reduce((sum, item) => sum + item.totalPlay, 0);

            return {
                contract: contract,
                records: records,
                totalPlay: totalPlay,
                revenue: totalPlay * (parseInt(contract.CPM) / 1000),
                royalties: (totalPlay * (parseInt(contract.CPM) / 1000) * parseFloat(contract.royalties)) / 100,
                date: formatDateDMYHPTS(date),
                administrativeFee: (totalPlay * (parseInt(contract.CPM) / 1000) * parseInt(contract.administrativeFee)) / 100,
            }
        });

        setContractDetailList(contractsDetail);
    }, [authorized.contracts, record.recordList, recordPlay.recordPlays]);

    useEffect(() => {
        let value = searchValue.trim().toLowerCase();
        
        if (date === '') {
            setSearchResult(contractDetailList);
            return;
        }

        let searchFilterDate = contractDetailList.filter(prev =>
            prev.records.some(record =>
                record.recordPlays.some(recordPlay =>
                    +new Date(formatDateYMD(recordPlay.date)).getMonth() === +new Date(date).getMonth() &&
                    +new Date(formatDateYMD(recordPlay.date)).getFullYear() === +new Date(date).getFullYear()
                )
            )
        );

        if (value === '') {
            setSearchResult(searchFilterDate);
            return;
        }

        setSearchResult(searchFilterDate.filter(contract =>
            contract.records.some(record => record.records.nameRecord.toLowerCase().includes(value)))
        );
    }, [searchValue, date]);

    useEffect(() => {
        if (authorized.loading === true) setLoading(true);
        else if (recordPlay.loading === true) setLoading(true);
        else if (record.loading === true) setLoading(true);
        else setLoading(false);
    }, [authorized.loading, record.loading, recordPlay.loading]);

    const handleSetCurrentItems = useCallback((items: Array<any>) => {
        setCurrentItems(items);
    }, []);

    const handleChange = useCallback((value: string) => {
        setItemsPerPage(value);
    }, []);

    const handleDetailClick = (id: string) => {
        navigate(`/revenue-management/detail/${id}`);
        dispatch(setContractsDetail(contractDetailList));
        setActive(false);
    }

    return (
        <CommonPage
            title='Quản lý phân phối doanh thu'
            className={cx('revenue-management-container')}
            pagingData={paging}
            actionFilter={<div>
                <p>Theo tháng:</p>
                <Input type='date' value={date} onChange={(e: any) => setDate(e.target.value)} />
            </div>}
            search={{
                placeHolder: 'Nhập tên bài hát',
                searchValue: searchValue,
                setSearchValue: (e: any) => setSearchValue(e.target.value)
            }}
            actionData={actionData}
        >
            <p className={cx('table__title')}>Danh sách hợp đồng ủy quyền</p>
            <Table
                paginate={{
                    dataForPaginate: searchResult,
                    setCurrentItems: handleSetCurrentItems
                }}
                paginateClass={cx('table__paginate')}
                loading={loading}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={handleChange}
                thead={['STT', 'Hợp đồng ủy quyền', 'Người ủy quyền', 'Số bài hát ủy quyền', 'Doanh thu (VNĐ)',
                    'Hành chính phí (VNĐ)', 'Mức nhuận bút (VNĐ)', 'Ngày chốt đối soát', 'Chi tiết doanh thu']}
            >
                {currentItems.map((item, index) => (
                    <tr key={index} style={{ height: '56px' }}>
                        <td><p>{index + 1}</p></td>
                        <td><p>{item.contract.contractCode}</p></td>
                        <td><p>{item.contract.authorizedPerson.firstName} {item.contract.authorizedPerson.lastName}</p></td>
                        <td><p>{item.records.length}</p></td>
                        <td><p>{formatMoney(item.revenue).split('₫')[0]}</p></td>
                        <td><p>{formatMoney(item.royalties).split('₫')[0]}</p></td>
                        <td><p>{formatMoney(item.royalties).split('₫')[0]}</p></td>
                        <td><p>{item.contract.forControlDate === '' ? '-' : item.contract.forControlDate}</p></td>
                        <td><p className={cx('action')} onClick={() => handleDetailClick(item.contract.id)}>Chi tiết</p></td>
                    </tr>
                ))}
            </Table>
        </CommonPage>
    );
}

export default RevenueManagementPage;