import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames/bind";
import { useCallback, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

import { EtmContractDetail } from "~/api/etmContractAPI";
import { ActionDataType } from "~/components/Action";
import { CheckBox } from "~/components/CheckBox";
import { PagingItemType } from "~/components/Paging";
import { Switch } from "~/components/Switch";
import { Table } from "~/components/Table";
import { MenuContext } from "~/context/Menu/MenuContext";
import { CommonPage } from "~/pages/CommonPage";
import { RootState, useAppDispatch } from "~/store";
import { getEtmContractListDetail } from "~/thunk/etmContractThunk";
import style from './UnitManagement.module.scss';

const cx = classNames.bind(style);

function UnitManagementPage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { setActive, setMenuActive } = useContext(MenuContext);

    const entrustmentContract = useSelector((state: RootState) => state.etmContract);

    const { etmContractsDetail } = entrustmentContract;

    const [searchValue, setSearchValue] = useState<string>('');
    const [actionData, setActionData] = useState<ActionDataType[]>([] as ActionDataType[]);
    const [searchResult, setSearchResult] = useState<Array<EtmContractDetail>>([] as Array<EtmContractDetail>);
    const [itemsPerPage, setItemsPerPage] = useState<string>('8');
    const [currentItems, setCurrentItems] = useState<Array<EtmContractDetail>>([] as Array<EtmContractDetail>);
    const [paging, setPaging] = useState<Array<PagingItemType>>([] as Array<PagingItemType>);

    useEffect(() => {
        setActionData([
            {
                icon: <FontAwesomeIcon icon={faXmark} />,
                title: 'Thêm Playlist',
                onClick: () => { }
            }
        ]);
        setMenuActive(4);
        setActive(true);

        setPaging([
            {
                title: 'Quản lý',
                to: '#',
                active: true
            }, {
                title: 'Đơn vị sử dụng',
                to: '#',
                active: true
            }
        ]);

        dispatch(getEtmContractListDetail());
        etmContractsDetail.length > 0 && setSearchResult(etmContractsDetail);

    }, []);
    
    useEffect(() => {
        setSearchResult(etmContractsDetail);
    }, [etmContractsDetail]);

    useEffect(() => {
        if (!etmContractsDetail.length) return;

        if (searchValue === '') {
            setSearchResult(etmContractsDetail);
            return;
        }

        let value = searchValue.trim().toLowerCase();

        setSearchResult(etmContractsDetail.filter(contract =>
            contract.user.userName.toLowerCase().includes(value) ||
            contract.code.toLowerCase().includes(value) ||
            contract.createdBy.id.includes(value) ||
            contract.user.id.includes(value)
        ));
    }, [searchValue]);

    const handleSetCurrentItems = useCallback((items: Array<any>) => {
        setCurrentItems(items);
    }, []);

    const handleChange = useCallback((value: string) => {
        setItemsPerPage(value);
    }, []);

    return (
        <div className={cx('unit-management-container')}>
            <CommonPage
                pagingData={paging}
                title='Danh sách đơn vị sử dụng'
                search={{
                    placeHolder: 'Tên tài khoản quản trị, số hợp đồng,...',
                    searchValue: searchValue,
                    setSearchValue: (e: React.ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value)
                }}
                actionData={actionData}
            >
                <Table
                    paginate={{
                        dataForPaginate: searchResult,
                        setCurrentItems: handleSetCurrentItems
                    }}
                    paginateClass={cx('table__row__paginate')}
                    loading={entrustmentContract.loading}
                    itemsPerPage={itemsPerPage}
                    setItemsPerPage={handleChange}
                    headerChildren={
                        <th className={cx('table__row__checkbox')}><CheckBox
                            checked={false}
                            onChange={() => { }}
                        /></th>
                    }
                    thead={['STT', 'Tên tài khoản quản trị', 'Số hợp đồng', 'Admin', 'Người dùng',
                        'Thiết bị được chỉ định', 'Ngày hết hạn', 'Trạng thái', '']}
                >
                    {currentItems.map((item, index) => (
                        <tr>
                            <td className={cx('table__row__checkbox')}><CheckBox
                                checked={false}
                                onChange={() => { }}
                            /></td>
                            <td><p>{index + 1}</p></td>
                            <td><p>{item.createdBy.userName}</p></td>
                            <td><p>{item.code}</p></td>
                            <td><p>{item.createdBy.id}</p></td>
                            <td><p>{item.user.id}</p></td>
                            <td><p>{1}</p></td>
                            <td><p>{item.expirationDate}</p></td>
                            <td>{
                                <Switch
                                    title={item.user.status === 'active' ? 'Đang kích hoạt' : 'Ngừng kích hoạt'}
                                    status={item.user.status === 'active'}
                                    onClick={() => { }} />
                            }</td>
                            <td><p className={cx('action')}>Chỉnh sửa</p></td>
                        </tr>
                    ))}
                </Table>
            </CommonPage>
        </div>
    );
}

export default UnitManagementPage;