import classNames from "classnames/bind";
import { memo, useCallback, useEffect, useState, useRef } from 'react';

import style from './RecordPlaylist.module.scss';
import { ComboBox, ComboData } from "~/components/ComboBox";
import { CommonPage } from "~/pages/CommonPage";
import { Table } from "~/components/Table";
import { Record } from "~/api/recordAPI";
import { AudioDialog } from "~/components/AudioDialog";
import { PlaylistRecordDetail } from "~/api/playlistsRecords";

const cx = classNames.bind(style);

type RecordPlaylistProps = {
    data: PlaylistRecordDetail;
    loading?: boolean;
    onItemRemoveClick(recordId: string): void;
}

export const RecordPlaylist = memo(({ data, loading = false, onItemRemoveClick }: RecordPlaylistProps) => {
    const [searchValue, setSearchValue] = useState<string>('');
    const [comboBoxData, setComboBoxData] = useState<Array<ComboData>>([] as Array<ComboData>);
    const [audioLink, setAudioLink] = useState<string>('');
    const [audioActive, setAudioActive] = useState<boolean>(false);
    const [currentItems, setCurrentItems] = useState<Array<any>>([]);
    const [itemsPerPage, setItemsPerPage] = useState<string>('5');
    const [searchResult, setSearchResult] = useState<Array<Record>>([] as Array<Record>);

    useEffect(() => {
        setComboBoxData([
            {
                title: 'Định dạng',
                data: [
                    { title: 'Tất cả' },
                    { title: 'Video' },
                    { title: 'Audio' },
                ],
                visible: false,
                activeData: 'Tất cả'
            }
        ]);
    }, []);

    useEffect(() => {
        const { records } = data;

        if (typeof records !== 'undefined' && records.length <= 0 || comboBoxData.length <= 0) return;

        let search = searchValue.trim().toLowerCase();
        let format = comboBoxData[0].activeData;

        if (searchValue.trim() === '')
            setSearchResult(records);

        let result = records.filter((item: Record) => {
            if (format === 'Tất cả')
                return item;
            else {
                if (item.format.includes(format))
                    return item;
                else
                    return null;
            }
        });

        setSearchResult(result.filter(item =>
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
        <div className={cx('record-playlist-container')}>
            <CommonPage
                title='Danh sách bản ghi được thêm vào Playlist'
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
                contentHeader={
                    <div className={cx('record-playlist__status')}>
                        <div className={cx('status__quantity')}>
                            <span>Tổng số:</span>
                            <span>{data.quantity}</span>
                        </div>
                        <div className={cx('status__total-time')}>
                            <span>Tổng thời lượng:</span>
                            <span>{data.totalTime}</span>
                        </div>
                    </div>
                }
            >
                <Table
                    paginate={{
                        dataForPaginate: searchResult,
                        setCurrentItems: handleSetCurrentItems
                    }}
                    itemsPerPage={itemsPerPage}
                    setItemsPerPage={handleChange}
                    thead={['STT', 'Tên bản ghi', 'Ca sĩ', 'Tác giả', '', '']}
                >
                    {currentItems.map((item: Record, index: number) => {
                        return (
                            <tr key={index} style={{ height: '47px' }} className={cx('content')}>
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
                                <td><p className={cx('action')} onClick={() => onItemRemoveClick(item.id)}>Gỡ</p></td>
                            </tr>
                        )
                    })}
                </Table>
                <AudioDialog src={audioLink} visible={audioActive} setVisible={setAudioActive} />
            </CommonPage>
        </div>
    );
});