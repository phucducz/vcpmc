import classNames from "classnames/bind";
import { useContext, useEffect, useState } from "react";
import { RootState, useAppDispatch } from "~/store";

import style from './Record.module.scss';
import { MenuContext } from "~/context/Menu/MenuContext";
import Input from "~/components/Input";
import { Icon, listTabGridIcon, listTabListIcon, searchIcon } from "~/icons";
import { ComboBox, ComboData } from "~/components/ComboBox";
import { Table } from "~/components/Table";
import { getRecords } from "~/thunk/recordThunks";
import { useSelector } from "react-redux";
import Loading from "~/components/Loading";
import { Action } from "~/components/Action";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(style);

export const RecordPage = () => {
    const dispatch = useAppDispatch();

    const record = useSelector((state: RootState) => state.record);
    const type = useSelector((state: RootState) => state.type);

    const { setMenuActive } = useContext(MenuContext);

    const [searchValue, setSearchValue] = useState<string>('');
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
                { title: 'Âm thanh' },
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
                { title: 'Duyệt bởi ngươi dùng' },
                { title: 'Duyệt tự động' }
            ],
            visible: false,
            activeData: 'Tất cả'
        }
    ]);
    const [actionData, setActionData] = useState([
        {
            icon: <FontAwesomeIcon icon={faEdit} />,
            title: 'Quản lý phê duyệt',
            onClick: () => { }
        }
    ]);

    useEffect(() => {
        setMenuActive(1);
    }, []);

    useEffect(() => {
        type.typeList.length && dispatch(getRecords({ typeList: type.typeList }));
    }, [type.typeList]);

    const handleSetCategory = (item: ComboData, id: string) => {
        setComboBoxData(prev =>
            prev.map(data =>
                data.title === id ? { ...data, activeData: item.title } : data
            )
        );
    }

    return (
        <div className={cx('record-store-container')}>
            <header><h3>Kho bản ghi</h3></header>
            <div className={cx('record-store')}>
                <Input
                    large
                    name='search'
                    value={searchValue}
                    onChange={(e: any) => setSearchValue(e.target.value)}
                    placeholder="Tên bản ghi, ca sĩ,..."
                    rightIcon={<Icon icon={searchIcon} style={{ color: 'var(--white)' }} />}
                />
                <div className={cx('content')}>
                    <div className={cx('record-store__action')}>
                        <div className={cx('combobox-data')}>
                            {comboBoxData.map((item, index) => (
                                <ComboBox
                                    key={index}
                                    title={item.title}
                                    active={item.activeData}
                                    visible={item.visible}
                                    data={item.data}
                                    className={cx('combo-data')}
                                    onClick={() => setComboBoxData(prev =>
                                        prev.map(data =>
                                            data.title === item.title ? { ...data, visible: !item.visible } : data
                                        )
                                    )}
                                    onItemClick={handleSetCategory}
                                />
                            ))}
                        </div>
                        <div className={cx('action__type-load')}>
                            <Icon icon={listTabListIcon} />
                            <Icon icon={listTabGridIcon} />
                        </div>
                    </div>
                    <div className={cx('record-store__table-data')}>
                        <Table loading={record.loading}>
                            {record.recordList.map((item, index) => (
                                <tr key={index} style={{ height: '47px' }} className={cx('content')}>
                                    <td><p>{index + 1}</p></td>
                                    <td><p>{item.nameRecord}</p></td>
                                    <td><p>{item.ISRCCode}</p></td>
                                    <td><p>{item.time}</p></td>
                                    <td><p>{item.singer}</p></td>
                                    <td><p>{item.author}</p></td>
                                    <td><p>Ballad</p></td>
                                    <td><p>{item.format}</p></td>
                                    <td><p>{item.expiryDate}</p></td>
                                    <td><p className={cx('action')}>Cập nhật</p></td>
                                    <td><p className={cx('action')}>Nghe</p></td>
                                </tr>
                            ))}
                        </Table>
                    </div>
                    <Action placement="top-right" data={actionData} />
                </div>
            </div>
            <Loading visible={false} />
        </div>
    );
}