import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames/bind";
import { useFormik } from "formik";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { routes } from "~/config/routes";

import { Contract } from "~/api/contractAPI";
import { Record, getContractList } from "~/api/recordAPI";
import { AudioDialog } from "~/components/AudioDialog";
import { Button } from "~/components/Button";
import { CheckBox } from "~/components/CheckBox";
import { ComboBox, ComboData } from "~/components/ComboBox";
import { Form } from "~/components/Form";
import { Grid } from "~/components/Grid";
import { Input } from "~/components/Input";
import { PagingItemType } from "~/components/Paging";
import { Table } from "~/components/Table";
import { formatToLocalStringCurrentDate } from "~/context";
import { Icon, listTabGridIcon, listTabListIcon } from "~/icons";
import { CommonPage } from "~/pages/CommonPage";
import { RootState, useAppDispatch } from "~/store";
import { approveRecordList, getApprovalList } from "~/thunk/approvalThunk";
import { getRecords } from "~/thunk/recordThunks";
import { GridItem } from "../Record";
import style from './ApprovePage.module.scss';

const cx = classNames.bind(style);

export type RecordDataType = Record & { contract: Contract };

function ApprovePage() {
    const record = useSelector((state: RootState) => state.record);
    const category = useSelector((state: RootState) => state.category);
    const user = useSelector((state: RootState) => state.user);
    const approval = useSelector((state: RootState) => state.approval);
    const dispatch = useAppDispatch();

    const reasonInputRef = useRef<HTMLInputElement>(null);

    const [audioLink, setAudioLink] = useState<string>('');
    const [audioActive, setAudioActive] = useState<boolean>(false);
    const [currentItems, setCurrentItems] = useState<Array<any>>([]);
    const [activeFormNote, setActiveFormNote] = useState<boolean>(false);
    const [recordData, setRecordData] = useState<Array<RecordDataType>>([]);
    const [searchResult, setSearchResult] = useState<Array<RecordDataType>>([]);
    const [searchValue, setSearchValue] = useState<string>('');
    const [typeLoad, setTypeLoad] = useState<'table' | 'grid'>('table');
    const [itemsPerPage, setItemsPerPage] = useState<string>("8");
    const [approveRecords, setApproveRecords] = useState<Array<RecordDataType>>([]);
    const [approveAll, setApproveAll] = useState<boolean>(false);
    const [paging, setPaging] = useState<Array<PagingItemType>>([] as Array<PagingItemType>);
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

    useEffect(() => {
        setPaging([
            {
                title: 'Kho bản ghi',
                to: routes.RecordPage,
                active: true
            }, {
                title: 'Quản lý phê duyệt',
                to: "#",
                active: true
            }
        ]);
        document.title = 'Quản lý phê duyệt';
    }, []);

    const handleApprove = async (status: string, reason: string) => {
        setActiveFormNote(false);

        const approveData = approveRecords.map((record: Record) => ({
            id: record.approvalsId,
            approvalBy: user.currentUser.id,
            approvalDate: formatToLocalStringCurrentDate(),
            reason: reason,
            recordsId: record.id,
            status: status
        }));

        await dispatch(approveRecordList(approveData));
        await dispatch(getApprovalList());

        setApproveAll(false);
        setApproveRecords([]);
    }

    const reasonFormik = useFormik({
        initialValues: {
            reason: ''
        },
        onSubmit: async values => {
            await handleApprove('Bị từ chối', values.reason);
            reasonFormik.setValues(reasonFormik.initialValues);
        }
    });

    useEffect(() => {
        category.categoryList.length
            && dispatch(getRecords(
                {
                    categoryList: category.categoryList,
                    approvalList: approval.approvalList
                }
            ));
    }, [approval.approvalList, category.categoryList]);

    useEffect(() => {
        const getContracts = async () => {
            const contract = await getContractList();
            let newRecord: any = [];

            record.recordList.forEach(record => {
                console.log(record.id, record.approvalDate);
                
                contract.forEach(contract => {
                    if (record.contractId === contract.id && record.approvalDate === '')
                        newRecord.push({ ...record, contract });
                });
            });

            setRecordData(newRecord);
            setSearchResult(newRecord);
        }

        getContracts();
    }, [record.recordList]);

    const handleApproveClick = useCallback(async () => {
        await handleApprove('approved', '');
    }, [approveRecords]);

    const handleCancelApproveClick = useCallback(() => {
        setActiveFormNote(true);
        reasonInputRef.current?.focus();
    }, [approveRecords]);

    const [actionData, setActionData] = useState<Array<any>>([]);

    useEffect(() => {
        setActionData([
            {
                icon: <FontAwesomeIcon icon={faCheck} style={{ color: 'var(--color-green-2)' }} />,
                title: 'Phê duyệt',
                onClick: handleApproveClick
            }, {
                icon: <FontAwesomeIcon icon={faXmark} style={{ color: 'var(--color-red)' }} />,
                title: 'Từ chối',
                onClick: handleCancelApproveClick
            }
        ]);
    }, [handleApproveClick, handleCancelApproveClick]);

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

    useEffect(() => {
        if (!record.recordList.length) return;

        let search = searchValue.trim().toLowerCase();
        let category = comboBoxData[0].activeData;
        let format = comboBoxData[1].activeData;

        if (searchValue === '')
            setSearchResult(recordData);

        let result = recordData.filter(item => {
            let itemData;

            if (category === 'Tất cả')
                itemData = item;
            else {
                if (item.category.name.includes(category))
                    itemData = item;
                else
                    return null;
            }
            if (format === 'Tất cả')
                itemData = item;
            else {
                if (item.format.includes(format))
                    itemData = item;
                else return null;
            }

            return itemData;
        });

        setSearchResult(result.filter(item =>
            item.author.toLowerCase().includes(search) ||
            item.singer.toLowerCase().includes(search) ||
            item.ISRCCode.toLowerCase().includes(search) ||
            item.nameRecord.toLowerCase().includes(search) ||
            item.format.toLowerCase().includes(search) ||
            item.category.name.toLowerCase().includes(search)
        ));
    }, [searchValue, comboBoxData]);

    const handleChange = (value: string) => {
        setItemsPerPage(value);
    }

    const handleCheck = (item: RecordDataType, isChecked: boolean) => {
        isChecked
            ? setApproveRecords(approveRecords.filter(record => record.id !== item.id))
            : setApproveRecords([...approveRecords, item]);
    }

    useEffect(() => {
        approveAll ? setApproveRecords(recordData) : setApproveRecords([]);
    }, [approveAll]);

    const handleListenAudioClick = useCallback((item: Record) => {
        setAudioLink(item.audioLink);
        setAudioActive(true);
    }, []);

    const handleSetCurrentItems = (items: Array<any>) => {
        setCurrentItems(items);
    }

    return (
        <CommonPage
            pagingData={paging}
            title='Phê duyệt bản ghi'
            search={{
                placeHolder: 'Tên bản ghi, ca sĩ,...',
                searchValue: searchValue,
                setSearchValue: (e: any) => setSearchValue(e.target.value)
            }}
            actionFilter={<div>
                {comboBoxData?.length && comboBoxData.map((item, index) => (
                    <ComboBox
                        key={index}
                        title={item.title}
                        active={item.activeData}
                        visible={item.visible}
                        data={item.data}
                        className={cx('combo-data')}
                        onClick={() => handleComboBoxClick(item)}
                        onItemClick={handleSetCategory}
                    />
                ))}
                {typeLoad === 'grid' && <CheckBox title="Chọn tất cả" checked={approveAll} onChange={() => setApproveAll(!approveAll)} />}
            </div>}
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
                    ? <Grid
                        paginate={{
                            dataForPaginate: searchResult,
                            setCurrentItems: handleSetCurrentItems
                        }}
                        loading={record.loading}
                        itemsPerPage={itemsPerPage}
                        setItemsPerPage={handleChange}
                    >
                        {currentItems.map(item => {
                            let recordChecked = approveRecords.find(record => record.id === item.id);
                            let isChecked = typeof recordChecked !== 'undefined' ? true : false;

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
                                action={<CheckBox checked={isChecked} onChange={() => handleCheck(item, isChecked)} />}
                                onGridItemClick={() => handleListenAudioClick(item)}
                            />
                        })}
                    </Grid>
                    : <Table
                        paginate={{
                            dataForPaginate: searchResult,
                            setCurrentItems: handleSetCurrentItems
                        }}
                        loading={record.loading}
                        itemsPerPage={itemsPerPage}
                        setItemsPerPage={handleChange}
                        thead={['STT', 'Tên bản ghi', 'Ca sĩ', 'Tác giả', 'Mã ISRC',
                            'Số hợp đồng', 'Ngày tải', '']}
                        headerChildren={<th className={cx('header-children')}>
                            <CheckBox checked={approveAll} onChange={() => setApproveAll(!approveAll)}
                            />
                        </th>}
                    >
                        {currentItems.length > 0
                            ? currentItems.map((item, index) => {
                                let recordChecked = approveRecords.find(record => record.id === item.id);
                                let isChecked = typeof recordChecked !== 'undefined' ? true : false;

                                if (index > parseInt(itemsPerPage) - 1) return null;
                                return (
                                    <tr
                                        key={index}
                                        style={{ height: '47px' }}
                                        className={cx('content')}
                                        onClick={() => handleCheck(item, isChecked)}
                                    >
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
                                        <td><p className={cx('action')} onClick={() => handleListenAudioClick(item)}>Nghe</p></td>
                                    </tr>
                                )
                            })
                            : <tr
                                style={{ height: '47px' }}
                                className={cx('not-exs-content')}
                            >
                                <td colSpan={9}><p style={{ textAlign: 'center', padding: '18px 0', opacity: '.8' }}>Không có bản ghi mới nào cần phê duyệt</p></td>
                            </tr>
                        }
                    </Table>}
                <AudioDialog src={audioLink} visible={audioActive} setVisible={setAudioActive} />
            </div>
            <Form
                className={cx('form__note-approve')}
                visible={activeFormNote}
                title='Lý do từ chối phê duyệt'
                type='dialog'
                onSubmit={reasonFormik.handleSubmit}
            >
                <Input
                    medium
                    type='textarea'
                    name='reason'
                    placeholder="Cho chúng tôi biết lý do bạn muốn từ chối phê duyệt bản ghi này..."
                    inputRef={reasonInputRef}
                    value={reasonFormik.values.reason}
                    onChange={reasonFormik.handleChange}
                />
                <Button
                    small
                    outline
                    type="button"
                    onClick={() => {
                        setActiveFormNote(false);
                        reasonFormik.setValues(reasonFormik.initialValues);
                    }}
                >
                    Hủy
                </Button>
                <Button
                    small
                    type="submit"
                >
                    Lưu
                </Button>
            </Form>
        </CommonPage >
    );
}

export default ApprovePage;