import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames/bind";
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

import { AuthorizedContractDetail, OwnerShip } from "~/api/authorizedContract";
import { EtmContract } from "~/api/etmContractAPI";
import { Button } from "~/components/Button";
import { ComboBox, ComboData } from "~/components/ComboBox";
import { Form } from "~/components/Form";
import { Input } from "~/components/Input";
import { PagingItemType } from "~/components/Paging";
import { TabItemProps } from "~/components/Tab";
import { Table } from "~/components/Table";
import { routes } from "~/config/routes";
import { formatDateYMD } from "~/context";
import { useMenu } from "~/context/hooks";
import { CommonPage } from "~/pages/CommonPage";
import { RootState, useAppDispatch } from "~/store";
import { getAuthorizedContracts } from "~/thunk/authorizedContractThunk";
import { getEtmContractList } from "~/thunk/etmContractThunk";
import style from './ManagementList.module.scss';

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

function ManagementList() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const etmContract = useSelector((state: RootState) => state.etmContract);
    const authorizedContract = useSelector((state: RootState) => state.authorized);

    const { setActive } = useMenu();

    const [searchValue, setSearchValue] = useState<string>('');
    const [searchResult, setSearchResult] = useState<Array<any>>([] as Array<any>);
    const [itemsCurrent, setItemsCurrent] = useState<Array<any>>([] as Array<any>);
    const [itemsPerPage, setItemsPerPage] = useState<string>('8');
    const [actionData, setActionData] = useState<Array<any>>([]);
    const [tab, setTab] = useState<TabItemProps[]>([]);
    const [entrustmentActive, setEntrustmentActive] = useState<boolean>(false);
    const [comboBoxData, setComboBoxData] = useState<Array<ComboData>>([] as Array<ComboData>);
    const [reasonCancelContractActive, setReasonCancelContractActive] = useState<boolean>(false);
    const [contractCancelled, setContractCancelled] = useState<{ code: string; reason: string; }>({ code: '', reason: '' });

    useEffect(() => {
        document.title = 'Danh sách hợp đồng';

        setTab([
            {
                title: 'Hợp đồng uỷ quyền',
                onClick: () => setEntrustmentActive(false),
            }, {
                title: 'Hợp đồng khai thác',
                onClick: () => setEntrustmentActive(true),
            }
        ]);

        dispatch(getEtmContractList());
        dispatch(getAuthorizedContracts());
        setActive(true);
    }, []);

    useEffect(() => {
        setActionData([
            {
                icon: <FontAwesomeIcon icon={faPlus} />,
                title: 'Thêm hợp đồng',
                onClick: () => {
                    entrustmentActive
                        ? navigate(routes.AddETMContract)
                        : navigate(routes.AddAuthorizedContract);
                    setActive(false);
                },
            }
        ]);
    }, [entrustmentActive]);

    useEffect(() => {
        setComboBoxData([
            {
                title: 'Quyền sở hữu:',
                data: [
                    { title: 'Người biểu diễn' },
                    { title: 'Nhà sản xuất' },
                    { title: 'Tất cả' }
                ],
                visible: false,
                activeData: 'Tất cả'
            }, {
                title: 'Hiệu lực hợp đồng:',
                data: [
                    { title: 'Mới' },
                    { title: 'Còn thời hạn' },
                    { title: 'Hết hạn' },
                    { title: 'Huỷ' },
                    { title: 'Tất cả' }
                ],
                visible: false,
                activeData: 'Tất cả'
            }
        ]);

        setSearchValue('');
        setSearchResult(entrustmentActive ? etmContract.etmContractList : authorizedContract.contracts);
    }, [entrustmentActive]);

    useEffect(() => {
        setSearchResult(entrustmentActive ? etmContract.etmContractList : authorizedContract.contracts);
    }, [etmContract.etmContractList, authorizedContract.contracts]);

    useEffect(() => {
        let value = searchValue.trim().toLowerCase();
        let result = authorizedContract.contracts;

        if (value === '')
            setSearchResult(entrustmentActive ? etmContract.etmContractList : authorizedContract.contracts);

        if (comboBoxData.length > 0) {
            let owner = comboBoxData[0].activeData;
            let effectiveContract = comboBoxData[1].activeData;

            result = result.filter((item: AuthorizedContractDetail) => {
                let contract: AuthorizedContractDetail | null = {} as AuthorizedContractDetail | null;

                switch (owner) {
                    case 'Tất cả':
                        if (owner === 'Tất cả')
                            contract = item;
                        break;
                    default:
                        contract = item.ownerShips
                            .find((ownerItem: OwnerShip) => ownerItem.name === owner) ? item : null;
                        break;
                }

                if (contract !== null)
                    switch (effectiveContract) {
                        case 'Còn thời hạn':
                            contract = +new Date(formatDateYMD(contract.expirationDate)) > +new Date() ? contract : null;
                            if (contract?.status === 'Đã hủy') contract = null;
                            break;
                        case 'Hết hạn':
                            contract = +new Date(formatDateYMD(contract.expirationDate)) < +new Date() ? contract : null;
                            break;
                        case 'Huỷ':
                            contract = contract.status === 'Đã hủy' ? contract : null;
                            break;
                        case 'Mới':
                            contract = contract.status === 'Mới' ? contract : null;
                            break;
                        default:
                            contract = contract;
                            break;
                    }

                return contract;
            });
        }

        setSearchResult(entrustmentActive
            ? etmContract.etmContractList.filter(contract =>
                contract.code.toLowerCase().includes(value) ||
                contract.name.toLowerCase().includes(value)
            )
            : result.filter(contract =>
                contract.contractCode.toLowerCase().includes(value) ||
                contract.authorizedPerson.firstName.toLowerCase().includes(value) ||
                contract.authorizedPerson.lastName.toLowerCase().includes(value) ||
                contract.customer.toLowerCase().includes(value) ||
                contract.status.toLowerCase().includes(value)
            )
        );
    }, [searchValue, comboBoxData]);

    const handleChange = (value: string) => {
        setItemsPerPage(value);
    }

    const handleSetCurrentItems = useCallback((item: Array<EtmContract>) => {
        setItemsCurrent(item);
    }, []);

    const handleComboBoxClick = useCallback((item: any) => {
        setComboBoxData(prev =>
            prev.map(data =>
                data.title === item.title ? { ...data, visible: !item.visible } : data
            )
        );
    }, []);

    const handleComboBoxItemClick = useCallback((item: ComboData, id: string) => {
        setComboBoxData(prev => prev.map(prevItem =>
            prevItem.title === id
                ? { ...prevItem, activeData: item.title }
                : prevItem
        ));
    }, []);

    return (
        <CommonPage
            title='Danh sách hợp đồng'
            pagingData={PAGING_ITEMS}
            actionData={actionData}
            tab={tab}
            search={{
                placeHolder: 'Tên hợp đồng, số hợp đồng, người uỷ quyền...',
                searchValue: searchValue,
                setSearchValue: (e: any) => setSearchValue(e.target.value)
            }}
            className={cx(entrustmentActive ? 'management-entrustment-contract' : 'management-authorized-contract')}
            actionFilter={<>
                {!entrustmentActive && comboBoxData.length ? comboBoxData.map((item, index) => (
                    <ComboBox
                        key={index}
                        title={item.title}
                        active={item.activeData}
                        visible={item.visible}
                        data={item.data}
                        className={cx('combo-data')}
                        onClick={() => handleComboBoxClick(item)}
                        onItemClick={handleComboBoxItemClick}
                    />
                )) : <></>}
            </>}
        >
            <div className={cx('entrustment-contract__table-data')}>
                <Table
                    paginate={{
                        dataForPaginate: searchResult,
                        setCurrentItems: handleSetCurrentItems
                    }}
                    loading={etmContract.loading}
                    itemsPerPage={itemsPerPage}
                    setItemsPerPage={handleChange}
                    thead={['STT', 'Số hợp đồng', 'Khách hàng', 'Ngày tạo',
                        'Ngày hiệu lực', 'Ngày hết hạn', 'Hiệu lực hợp đồng', '', '']}
                    className={cx('container-table-data', entrustmentActive && 'active')}
                >
                    {itemsCurrent.map((item, index) => {
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
                                <td><p className={cx('action')} onClick={() => navigate(`/entrustment-contract/detail/${item.id}`)}>Xem chi tiết</p></td>
                                <td><p className={cx('action')} onClick={() => navigate(`/entrustment-contract/copy/${item.id}`)}>Sao chép hợp đồng</p></td>
                            </tr>
                        );
                    })}
                </Table>
            </div>
            <div className={cx('authorized-contract__table-data', !entrustmentActive && 'active')}>
                <Table
                    paginate={{
                        dataForPaginate: searchResult,
                        setCurrentItems: handleSetCurrentItems
                    }}
                    loading={authorizedContract.loading}
                    itemsPerPage={itemsPerPage}
                    setItemsPerPage={handleChange}
                    thead={['STT', 'Số hợp đồng', 'Tên hợp đồng', 'Người uỷ quyền',
                        'Quyền sở hữu', 'Hiệu lực hợp đồng', 'Ngày tạo', '']}
                    className={cx('container-table-data', !entrustmentActive && 'active')}
                >
                    {itemsCurrent.map((item, index) => {
                        let status = 'cancelled';

                        if (item.expirationDate === '')
                            status = 'new';
                        else if (item.status === 'Đã hủy')
                            status = 'cancelled';
                        else status = +new Date(formatDateYMD(item.expirationDate)) > +new Date() ? 'still' : 'expiration';

                        return (
                            <tr key={index} style={{ height: '47px' }} className={cx('content')}>
                                <td><p>{index + 1}</p></td>
                                <td><p>{item.contractCode}</p></td>
                                <td><p>{item.customer}</p></td>
                                <td><p>{item.authorizedPerson && item.authorizedPerson.firstName} {item.authorizedPerson && item.authorizedPerson.lastName}</p></td>
                                <td>{typeof item.ownerShips !== 'undefined'
                                    && item.ownerShips.map((item: OwnerShip) => <p key={item.name}>{item.name}</p>)
                                }</td>
                                <td><p className={cx('status', status)}>{
                                    item.status === 'Đã hủy' ? item.status : (
                                        item.expirationDate === ''
                                            ? 'Mới'
                                            : +new Date(formatDateYMD(item.expirationDate)) > +new Date() ? 'Còn thời hạn' : 'Hết thời hạn'
                                    )
                                }</p></td>
                                <td><p>{item.dateCreated}</p></td>
                                <td><p className={cx('action')} onClick={() => {
                                    navigate(`/authorized-contract/detail/${item.id}`);
                                    setActive(false);
                                }}>Xem chi tiết</p></td>
                                {status === 'cancelled' && <td><p className={cx('action')} onClick={() => {
                                    setContractCancelled({ code: item.contractCode, reason: item.reason });
                                    setReasonCancelContractActive(true);
                                }}>Lý do hủy</p></td>}
                            </tr>
                        );
                    })}
                </Table>
                <Form
                    title={`Lý do hủy hợp đồng uỷ quyền ${contractCancelled.code}`}
                    visible={reasonCancelContractActive}
                    type="dialog"
                    className={cx('reason-cancel-contract-form')}
                >
                    <div className={cx("form__body")}>
                        <Input value={contractCancelled.reason} />
                    </div>
                    <div className={cx("form__action")}>
                        <Button small type="button" onClick={() => setReasonCancelContractActive(false)}>
                            Đóng
                        </Button>
                    </div>
                </Form>
            </div>
        </CommonPage>
    );
};

export default ManagementList;