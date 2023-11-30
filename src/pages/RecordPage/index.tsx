import classNames from "classnames/bind";
import { ReactNode, memo, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { RootState, useAppDispatch } from "~/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPlay } from "@fortawesome/free-solid-svg-icons";

import style from './Record.module.scss';
import { MenuContext } from "~/context/Menu/MenuContext";
import { Icon, listTabGridIcon, listTabListIcon } from "~/icons";
import { ComboBox, ComboData } from "~/components/ComboBox";
import { getRecords } from "~/thunk/recordThunks";
import { useSelector } from "react-redux";
import { Record } from "~/api/recordAPI";
import { formatDateMDY, getCurrentDate } from "~/context";
import { Table } from "~/components/Table";
import { Grid } from "~/components/Grid";
import { useNavigate } from "react-router";
import { CommonPage } from "../CommonPage";
import { AudioDialog } from "~/components/AudioDialog";

const cx = classNames.bind(style);

type BoxItemType = {
    title: string;
    content: string
}

type BoxItemProps = {
    data: BoxItemType
}

const BoxItem = memo(({ data }: BoxItemProps) => {
    return (
        <div className={cx('box__item')}>
            <p className={cx('box__item__title')}>{data.title}</p>
            <p className={cx('box__item__content')}>{data.content}</p>
        </div>
    )
});

type GridItemType = {
    nameRecord: string;
    singer: string;
    author: string;
    ISRCCode: string;
    imageURL: string;
}

type GridItemProps = {
    data: GridItemType;
    boxItemData: Array<BoxItemType>;
    action?: ReactNode;
    onGridItemClick: () => void
}

export const GridItem = memo(({ data, boxItemData, action, onGridItemClick }: GridItemProps) => {
    return (
        <div className={cx('grid-container__item')} onClick={onGridItemClick}>
            <div
                className={cx('item__image')}
                style={{
                    backgroundImage: `url(${data.imageURL})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover'
                }}
            >
                <FontAwesomeIcon icon={faPlay} className={cx('item__image__icon')} />
            </div>
            <div className={cx('item__content')}>
                <div className={cx('item__content__right')}>
                    <div className={cx('group-content')}>
                        <p className={cx('content__right__title')}>{data.nameRecord}</p>
                        <div className={cx('singer')}>
                            <span className={cx('title')}>Ca sĩ:</span>
                            <span className={cx('content')}>{data.singer}</span>
                        </div>
                        <div className={cx('author')}>
                            <span className={cx('title')}>Sáng tác:</span>
                            <span className={cx('content')}>{data.author}</span>
                        </div>
                        <div className={cx('contract')}>
                            <span className={cx('title')}>Số hợp đồng:</span>
                            <span className={cx('content')}>{data.ISRCCode}</span>
                        </div>
                    </div>
                    <div className={cx('content__right__box')}>
                        {boxItemData.map(item => <BoxItem key={item.title} data={item} />)}
                    </div>
                </div>
                <div className={cx('item__content__left')}>
                    {action && action}
                </div>
            </div>
        </div>
    );
});

export const RecordPage = () => {
    const dispatch = useAppDispatch();

    const record = useSelector((state: RootState) => state.record);
    const category = useSelector((state: RootState) => state.category);
    const approval = useSelector((state: RootState) => state.approval);

    const navigate = useNavigate();
    const { menuActive, setMenuActive } = useContext(MenuContext);

    const [audioLink, setAudioLink] = useState<string>('');
    const [audioActive, setAudioActive] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState<string>('');
    const [typeLoad, setTypeLoad] = useState<'table' | 'grid'>('table');

    const [recordData, setRecordData] = useState<Array<Record>>([] as Array<Record>);
    const [currentItems, setCurrentItems] = useState<Array<any>>([]);

    const [itemsPerPage, setItemsPerPage] = useState<string>('8');
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
        }, {
            title: 'Thời hạn sử dụng',
            data: [
                { title: 'Tất cả' },
                { title: 'Còn thời hạn' },
                { title: 'Hết thời hạn' }
            ],
            visible: false,
            activeData: 'Tất cả'
        }, {
            title: 'Trạng thái',
            data: [
                { title: 'Tất cả' },
                { title: 'Duyệt bởi người dùng' },
                { title: 'Duyệt tự động' }
            ],
            visible: false,
            activeData: 'Tất cả'
        }
    ]);

    const handleClickItemAction = useCallback(() => {
        navigate('/approve-record');
    }, []);

    const [actionData, setActionData] = useState([
        {
            icon: <FontAwesomeIcon icon={faEdit} />,
            title: 'Quản lý phê duyệt',
            onClick: handleClickItemAction
        }
    ]);

    useEffect(() => {
        console.log(menuActive);
        setMenuActive(1);
    }, []);

    useEffect(() => {
        console.log(record.recordList);
        
        setRecordData(record.recordList.filter(record => record.approvalDate !== '' && record.status !== 'Bị từ chối' && record.status !== ''));
    }, [record.recordList]);

    useEffect(() => {
        if (!record.recordList.length) return;

        let search = searchValue.trim().toLowerCase();

        let category = comboBoxData[0].activeData;
        let format = comboBoxData[1].activeData;
        let contractTerm = comboBoxData[2].activeData;
        let status = comboBoxData[3].activeData;

        if (searchValue.trim() === '')
            setRecordData(record.recordList);

        let result = record.recordList.filter(item => {
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
            if (contractTerm === 'Tất cả')
                return itemData = item;
            else {
                if (contractTerm === 'Còn thời hạn') {
                    if (new Date(formatDateMDY(item.expirationDate)) > new Date(getCurrentDate())) {
                        itemData = item;
                        return itemData;
                    }
                }
                else if (contractTerm === 'Hết thời hạn')
                    if (new Date(formatDateMDY(item.expirationDate)) < new Date(getCurrentDate())) {
                        itemData = item;
                        return itemData;
                    }
            }

            return null;
        });

        setRecordData(result.filter(item =>
            item.author.toLowerCase().includes(search) ||
            item.singer.toLowerCase().includes(search) ||
            item.ISRCCode.toLowerCase().includes(search) ||
            item.nameRecord.toLowerCase().includes(search) ||
            item.format.toLowerCase().includes(search) ||
            item.category.name.toLowerCase().includes(search)
        ));
    }, [searchValue, comboBoxData]);

    useEffect(() => {
        category.categoryList.length
            && dispatch(getRecords(
                {
                    categoryList: category.categoryList,
                    approvalList: approval.approvalList
                }
            ));
    }, [category.categoryList, approval.approvalList]);

    const handleSetCategory = useCallback((item: ComboData, id: string) => {
        setComboBoxData(prev =>
            prev.map(data =>
                data.title === id ? { ...data, activeData: item.title } : data
            )
        );
    }, []);

    const handleChange = (value: string) => {
        setItemsPerPage(value);
    }

    const handleComboBoxClick = useCallback((item: any) => {
        setComboBoxData(prev =>
            prev.map(data =>
                data.title === item.title ? { ...data, visible: !item.visible } : data
            )
        );
    }, []);

    const handleBlurComboBox = useCallback((item: any) => {
        setComboBoxData(prev =>
            prev.map(data =>
                data.title === item.title ? { ...data, visible: false } : data
            )
        );
    }, []);

    const handleUpdateClick = useCallback((item: Record) => {
        let expirationDateRecord = new Date(formatDateMDY(item.expirationDate));
        let isExpiry = expirationDateRecord < new Date(getCurrentDate());

        if (isExpiry) return;

        navigate(`/record/edit/${item.ISRCCode}`);
    }, []);

    const handleListenAudioClick = useCallback((item: Record) => {
        setAudioLink(item.audioLink);
        setAudioActive(true);
    }, []);

    const handleSetCurrentItems = (items: Array<any>) => {
        setCurrentItems(items);
    }

    return (
        <CommonPage
            title='Kho bản ghi'
            search={{
                placeHolder: 'Tên bản ghi, ca sĩ,...',
                searchValue: searchValue,
                setSearchValue: (e: any) => setSearchValue(e.target.value)
            }}
            actionFilter={<>
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
                        onBlur={() => handleBlurComboBox(item)}
                    />
                ))}
            </>}
            actionType={
                <div className={cx('action__type-load', typeLoad === 'table' ? 'table-visible' : 'grid-visible')}>
                    <Icon icon={listTabListIcon} onClick={() => setTypeLoad('table')} />
                    <Icon icon={listTabGridIcon} onClick={() => setTypeLoad('grid')} />
                </div>
            }
            actionData={actionData}
        >
            <div className={cx('container-table-data')}>
                {typeLoad === 'grid'
                    ? <Grid
                        paginate={{
                            dataForPaginate: recordData,
                            setCurrentItems: handleSetCurrentItems
                        }}
                        loading={record.loading}
                        itemsPerPage={itemsPerPage}
                        setItemsPerPage={handleChange}
                    >
                        {currentItems.map((item, index) => {
                            if (index > parseInt(itemsPerPage) - 1) return null;

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
                                action={<FontAwesomeIcon
                                    icon={faEdit}
                                    className={cx('content__left__icon')}
                                    onClick={() => navigate(`/record/edit/${item.ISRCCode}`)}
                                />}
                                onGridItemClick={() => handleListenAudioClick(item)}
                            />
                        })}
                    </Grid>
                    : <Table
                        paginate={{
                            dataForPaginate: recordData,
                            setCurrentItems: handleSetCurrentItems
                        }}
                        loading={record.loading}
                        itemsPerPage={itemsPerPage}
                        setItemsPerPage={handleChange}
                        thead={['STT', 'Tên bản ghi', 'Mã ISRC', 'Thời lượng', 'Ca sĩ',
                            'Tác giả', 'Thể loại', 'Định dạng', 'Thời hạn sử dụng', '', '']}
                    >
                        {currentItems.map((item, index) => {
                            let expiryDateRecord = new Date(formatDateMDY(item.expirationDate));
                            let isExpiry = expiryDateRecord < new Date(getCurrentDate());

                            if (index > parseInt(itemsPerPage) - 1) return null;

                            return (
                                <tr key={index} style={{ height: '47px' }} className={cx('content')}>
                                    <td><p>{index + 1}</p></td>
                                    <td><p>{item.nameRecord}</p></td>
                                    <td><p>{item.ISRCCode}</p></td>
                                    <td><p>{item.time}</p></td>
                                    <td><p>{item.singer}</p></td>
                                    <td><p>{item.author}</p></td>
                                    <td><p>{item.category.name}</p></td>
                                    <td><p>{item.format}</p></td>
                                    <td className={cx('table-data__expiry-date', isExpiry ? 'expiry' : 'still-expiry')}>
                                        <p>{isExpiry ? 'Hết thời hạn' : 'Còn thời hạn'}</p>
                                        <p>{item.expirationDate}</p>
                                    </td>
                                    <td><p className={cx('action')} onClick={() => handleUpdateClick(item)}>Cập nhật</p></td>
                                    <td><p className={cx('action')} onClick={() => handleListenAudioClick(item)}>Nghe</p></td>
                                </tr>
                            )
                        })}
                    </Table>}
                <AudioDialog src={audioLink} visible={audioActive} setVisible={setAudioActive} />
            </div>
        </CommonPage >
    );
}