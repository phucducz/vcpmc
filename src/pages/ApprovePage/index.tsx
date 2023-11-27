import classNames from "classnames/bind";
import { useCallback, useEffect, useRef, useState } from "react";

import style from './ApprovePage.module.scss';
import { PagingItemType } from "~/components/Paging";
import { routes } from "~/config/routes";
import { Icon, listTabGridIcon, listTabListIcon } from "~/icons";
import { CommonPage } from "../CommonPage";
import { ComboData } from "~/components/ComboBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faEdit, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Table } from "~/components/Table";
import { Grid } from "~/components/Grid";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "~/store";
import { Record, getContractList } from "~/api/recordAPI";
import { GridItem } from "../RecordPage";
import { useNavigate } from "react-router";
import { approveRecordList, getRecords } from "~/thunk/recordThunks";
import { Contract } from "~/api/contractAPI";
import { CheckBox } from "~/components/CheckBox";
import { ActionDataType } from "~/components/Action";
import { formatToLocalStringCurrentDate } from "~/context";

const cx = classNames.bind(style);

const PAGING_ITEMS: Array<PagingItemType> = [
    {
        title: 'Kho bản ghi',
        to: routes.RecordPage
    }, {
        title: 'Quản lý phê duyệt',
        to: "#"
    }
];

export type RecordDataType = Record & { contract: Contract };

export const ApprovePage = () => {
    const record = useSelector((state: RootState) => state.record);
    const category = useSelector((state: RootState) => state.category);
    const user = useSelector((state: RootState) => state.user);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [recordData, setRecordData] = useState<Array<RecordDataType>>([]);
    const [searchValue, setSearchValue] = useState<string>('');
    const [typeLoad, setTypeLoad] = useState<'table' | 'grid'>('table');
    const [showNumber, setShowNumber] = useState<number>(8);
    const [approveRecords, setApproveRecords] = useState<Array<RecordDataType>>([]);
    const [approveAll, setApproveAll] = useState<boolean>(false);
    const [comboBoxData, setComboBoxData] = useState([
        {
            title: 'Thể loại',
            data: [
                { title: 'Tất cả' },
                { title: 'Pop' },
                { title: 'EDM' },
                { title: 'Ballad' }
            ],
            visible: false,
            activeData: 'Tất cả'
        }, {
            title: 'Định dạng',
            data: [
                { title: 'Tất cả' },
                { title: 'Audio' },
                { title: 'Video' }
            ],
            visible: false,
            activeData: 'Tất cả'
        }
    ]);

    const handleGetData = async () => {
        category.categoryList && await dispatch(getRecords({
            categoryList: category.categoryList,
            status: 'not yet approved'
        }));
    }

    useEffect(() => {
        handleGetData();
    }, []);

    useEffect(() => {
        const getContracts = async () => {
            const contract = await getContractList();
            let newRecord: any = [];
            console.log(record.recordList);

            record.recordList.forEach(record => {
                contract.forEach(contract => {
                    if (record.contractId === contract.id)
                        newRecord.push({ ...record, contract });
                });
            });
            setRecordData(newRecord);
        }

        getContracts();
    }, [record.recordList]);

    const handleApprove = useCallback(async () => {
        const approveData = approveRecords.map((record: Record) => ({
            id: record.id,
            ISRCCode: record.ISRCCode,
            author: record.author,
            createdBy: record.createdBy,
            createdDate: record.createdDate,
            expiryDate: record.expiryDate,
            expirationDate: record.expirationDate,
            format: record.format,
            nameRecord: record.nameRecord,
            producer: record.producer,
            singer: record.singer,
            time: record.time,
            approvalBy: user.currentUser.id,
            categoriesId: record.category.id,
            contractId: record.contractId,
            approvalDate: formatToLocalStringCurrentDate()
        }));

        await dispatch(approveRecordList(approveData));
        await handleGetData();

        setApproveAll(false);
    }, [approveRecords]);

    const handleCancelApprove = useCallback(() => {
        console.log(approveRecords);
    }, [approveRecords]);

    const [actionData, setActionData] = useState<Array<ActionDataType>>([]);

    useEffect(() => {
        setActionData([
            {
                icon: <FontAwesomeIcon icon={faCheck} style={{ color: 'var(--color-green-2)' }} />,
                title: 'Phê duyệt',
                onClick: handleApprove
            }, {
                icon: <FontAwesomeIcon icon={faXmark} style={{ color: 'var(--color-red)' }} />,
                title: 'Từ chối',
                onClick: handleCancelApprove
            }
        ]);
    }, [handleApprove, handleCancelApprove]);

    const handleComboBoxClick = useCallback((item: any) => {
        setComboBoxData(prev =>
            prev.map(data =>
                data.title === item.title ? { ...data, visible: !item.visible } : data
            )
        );
    }, []);

    const handleSetCategory = useCallback((item: ComboData, id: string) => {
        setComboBoxData(prev =>
            prev.map(data =>
                data.title === id ? { ...data, activeData: item.title } : data
            )
        );
    }, []);

    const handleChange = (value: number) => {
        setShowNumber(value);
    }

    const handleCheck = (item: RecordDataType, isChecked: boolean) => {
        isChecked
            ? setApproveRecords(approveRecords.filter(record => record.id !== item.id))
            : setApproveRecords([...approveRecords, item]);
    }

    useEffect(() => {
        approveAll ? setApproveRecords(recordData) : setApproveRecords([]);
    }, [approveAll]);

    const handleActionClick = (type: 'table' | 'grid') => {
        let actionData = [
            {
                title: 'Thể loại',
                data: [
                    { title: 'Tất cả' },
                    { title: 'Pop' },
                    { title: 'EDM' },
                    { title: 'Ballad' }
                ],
                visible: false,
                activeData: 'Tất cả'
            }, {
                title: 'Định dạng',
                data: [
                    { title: 'Tất cả' },
                    { title: 'Audio' },
                    { title: 'Video' }
                ],
                visible: false,
                activeData: 'Tất cả'
            }
        ];

        switch (type) {
            case 'table':
                setTypeLoad(type);
                break;

            default:
                setTypeLoad(type);
                break;
        }
    }

    return (
        <CommonPage
            pagingData={PAGING_ITEMS}
            title='Phê duyệt bản ghi'
            search={{
                placeHolder: 'Tên bản ghi, ca sĩ,...',
                searchValue: searchValue,
                setSearchValue: (e: any) => setSearchValue(e.target.value)
            }}
            comboBoxData={comboBoxData}
            onComboBoxClick={handleComboBoxClick}
            onComboBoxItemClick={handleSetCategory}
            actionType={
                <div className={cx('action__type-load', typeLoad === 'table' ? 'table-visible' : 'grid-visible')}>
                    <Icon icon={listTabListIcon} onClick={() => setTypeLoad('table')} />
                    <Icon icon={listTabGridIcon} onClick={() => setTypeLoad('grid')} />
                </div>
            }
            actionData={actionData}
        >
            <div className={cx('container-table-data', 'approve-container-table-data')}>
                {typeLoad === 'grid'
                    ? <Grid loading={record.loading} showNumber={showNumber || 0} setShowNumber={handleChange}>
                        {recordData.map(item => {
                            return <GridItem
                                key={item.ISRCCode}
                                data={item}
                                boxItemData={[
                                    {
                                        title: 'Thể loại',
                                        content: item.category.name
                                    }, {
                                        title: 'Định dạng',
                                        content: item.format
                                    }, {
                                        title: 'Thời lượng',
                                        content: item.time
                                    }
                                ]}
                            />
                        })}
                    </Grid>
                    : <Table
                        loading={record.loading}
                        showNumber={showNumber || 0}
                        setShowNumber={handleChange}
                        thead={['STT', 'Tên bản ghi', 'Ca sĩ', 'Tác giả', 'Mã ISRC',
                            'Số hợp đồng', 'Ngày tải', '']}
                        headerChildren={<th className={cx('header-children')}>
                            <CheckBox checked={approveAll} onChange={() => setApproveAll(!approveAll)}
                            />
                        </th>}
                    >
                        {recordData.map((item, index) => {
                            let recordChecked = approveRecords.find(record => record.id === item.id);
                            let isChecked = typeof recordChecked !== 'undefined' ? true : false;

                            if (index > showNumber - 1) return null;
                            return (
                                <tr key={index} style={{ height: '47px' }} className={cx('content')}>
                                    <td><CheckBox
                                        checked={isChecked}
                                        onChange={() => handleCheck(item, isChecked)}
                                    /></td>
                                    <td><p>{index + 1}</p></td>
                                    <td><p>{item.nameRecord}</p></td>
                                    <td><p>{item.singer}</p></td>
                                    <td><p>{item.author}</p></td>
                                    <td><p>{item.ISRCCode}</p></td>
                                    <td><p>{item.contract.contractCode}</p></td>
                                    <td><p>{item.createdDate}</p></td>
                                    <td><p className={cx('action')}>Nghe</p></td>
                                </tr>
                            )
                        })}
                    </Table>}
            </div>
        </CommonPage >
    );
}   