import classNames from "classnames/bind";
import { memo, useCallback, useEffect, useState } from 'react';

import { ComboBox, ComboData } from "~/components/ComboBox";
import { CommonPage } from "~/pages/CommonPage";
import style from './RecordWarehouse.module.scss';
import { Table } from "~/components/Table";
import { Record } from "~/api/recordAPI";
import { AudioDialog } from "~/components/AudioDialog";
import { useSelector } from "react-redux";
import { RootState } from "~/store";

const cx = classNames.bind(style);

type RecordPlaylistWareHouseProps = {
    data: Array<Record>;
    loading?: boolean;
    onItemAddClick(item: Record): void;
}

export const RecordPlaylistWareHouse = memo(({ data, loading = false, onItemAddClick }: RecordPlaylistWareHouseProps) => {
    const playlistsRecords = useSelector((state: RootState) => state.playlistsRecords);

    const [searchValue, setSearchValue] = useState<string>('');
    const [comboBoxData, setComboBoxData] = useState<Array<ComboData>>([] as Array<ComboData>);
    const [audioLink, setAudioLink] = useState<string>('');
    const [audioActive, setAudioActive] = useState<boolean>(false);
    const [currentItems, setCurrentItems] = useState<Array<any>>([]);
    const [itemsPerPage, setItemsPerPage] = useState<string>('5');
    const [searchResult, setSearchResult] = useState<Array<Record>>([] as Array<Record>);

    useEffect(() => {
        let playlistSample = playlistsRecords.playlistsRecordsDetail.map(item => ({
            title: item.playlist.title
        }));

        setComboBoxData([
            {
                title: 'Thể loại',
                data: [
                    { title: 'Tất cả' },
                    { title: 'Video' },
                    { title: 'Audio' },
                ],
                visible: false,
                activeData: 'Tất cả'
            }, {
                title: 'Playlist mẫu',
                data: [
                    { title: 'Playlist mẫu' },
                    ...playlistSample
                ],
                visible: false,
                activeData: 'Playlist mẫu'
            }
        ]);
    }, [playlistsRecords]);

    useEffect(() => {
        if ((data && data.length <= 0) || comboBoxData.length <= 0) {
            setSearchResult([]);
            return;
        }

        let search = searchValue.trim().toLowerCase();
        let format = comboBoxData[0].activeData;
        let playlistSample = comboBoxData[1].activeData;

        if (searchValue.trim() === '')
            setSearchResult(data);

        const resultPlaylist = playlistsRecords.playlistsRecordsDetail.find(item => item.playlist.title === playlistSample)?.records;

        let dataSearch: Record[] = data;

        if (typeof resultPlaylist !== 'undefined')
            dataSearch = resultPlaylist.filter(playlist => data.find(item => item.id === playlist.id));

        let resultRecord: Record[] = dataSearch.filter((item: Record) => {
            if (format === 'Tất cả')
                return item;
            else {
                if (item.format.includes(format))
                    return item;
                else
                    return null;
            }
        });

        setSearchResult(resultRecord.filter(item =>
            item.author.toLowerCase().includes(search) ||
            item.singer.toLowerCase().includes(search) ||
            item.nameRecord.toLowerCase().includes(search)
        ));
    }, [searchValue, comboBoxData, data]);

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

    const handleBlurComboBox = useCallback((item: any) => {
        setComboBoxData(prev =>
            prev.map(data =>
                data.title === item.title ? { ...data, visible: false } : data
            )
        );
    }, []);

    const handleListenAudioClick = useCallback((item: Record) => {
        setAudioLink(item.audioLink);
        setAudioActive(true);
    }, []);

    const handleSetCurrentItems = (items: Array<any>) => {
        setCurrentItems(items);
    }

    const handleChange = (value: string) => {
        setItemsPerPage(value);
    }

    return (
        <div className={cx('record-warehouse-container')}>
            <CommonPage
                title='Kho bản ghi'
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
                            onBlur={() => handleBlurComboBox(item)}
                        />
                    ))}
                </div>}
            >
                <Table
                    paginate={{
                        dataForPaginate: searchResult,
                        setCurrentItems: handleSetCurrentItems
                    }}
                    loading={loading}
                    itemsPerPage={itemsPerPage}
                    setItemsPerPage={handleChange}
                    thead={['STT', 'Tên bản ghi', 'Ca sĩ', 'Tác giả', '', '']}
                >
                    {currentItems.map((item: Record, index: number) => {
                        return (
                            <tr key={index} style={{ height: `27px` }} className={cx('content')}>
                                <td><p>{index + 1}</p></td>
                                <td className={cx('record-name')}>
                                    <p>{item.nameRecord}</p>
                                    <p>
                                        <span>{item.category.name}</span>
                                        <span>{item.format}</span>
                                        <span>{item.time}</span>
                                    </p>
                                </td>
                                <td><p>{item.singer}</p></td>
                                <td><p>{item.author}</p></td>
                                <td><p className={cx('action')} onClick={() => handleListenAudioClick(item)}>Nghe</p></td>
                                <td><p className={cx('action')} onClick={() => onItemAddClick(item)}>Thêm</p></td>
                            </tr>
                        )
                    })}
                </Table>
                <AudioDialog src={audioLink} visible={audioActive} setVisible={setAudioActive} />
            </CommonPage>
        </div>
    );
});