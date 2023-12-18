import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames/bind";
import { useCallback, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";

import { Record } from "~/api/recordAPI";
import { ActionDataType } from "~/components/Action";
import Loading from "~/components/Loading";
import { PagingItemType } from "~/components/Paging";
import { Table } from "~/components/Table";
import { routes } from "~/config/routes";
import { MenuContext } from "~/context/Menu/MenuContext";
import { Icon, trashIcon } from "~/icons";
import { getPlaylistsRecordsDetail } from "~/reducers/playlistsRecords";
import { RootState, useAppDispatch } from "~/store";
import { deletePlaylist } from "~/thunk/playlistThunk";
import { getPlaylistsRecordsList, removeRecord } from "~/thunk/playlistsRecordsThunk";
import { CommonPlaylistPage, PlaylistValue } from "../CommonPage";
import style from './PlaylistDetail.module.scss';

const cx = classNames.bind(style);

const PAGING_ITEMS: Array<PagingItemType> = [
    {
        title: 'Playlist',
        to: routes.PlaylistManagement,
        active: true
    }, {
        title: 'Chi tiết playlist',
        to: "#",
    }
];

function PlaylistDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { setActive, setType } = useContext(MenuContext);

    const playlist = useSelector((state: RootState) => state.playlist);
    const record = useSelector((state: RootState) => state.record);
    const playlistsRecords = useSelector((state: RootState) => state.playlistsRecords);

    const [audioLink, setAudioLink] = useState<string>('');
    const [audioActive, setAudioActive] = useState<boolean>(false);
    const [actionData, setActionData] = useState<ActionDataType[]>([] as ActionDataType[]);
    const [playlistDetail, setPlaylistDetail] = useState<PlaylistValue>({} as PlaylistValue);
    const [currentItems, setCurrentItems] = useState<Array<Record>>([] as Array<Record>);
    const [itemsPerPage, setItemsPerPage] = useState<string>('8');

    const handleDeletePlaylist = useCallback(() => {
        const playlistId = playlistsRecords.playlistsRecords.find(playlistRecords => playlistRecords.id === id)?.playlistsId;

        if (typeof playlistId !== 'undefined' && typeof id !== 'undefined')
            dispatch(deletePlaylist({
                playlistId: playlistId,
                playlistRecordsId: id,
                navigate: () => navigate(routes.PlaylistManagement),
            }));
    }, []);

    useEffect(() => {
        setActive(false);
        setType('dynamic');

        setActionData([
            {
                icon: <FontAwesomeIcon icon={faEdit} />,
                title: 'Chỉnh sửa',
                onClick: () => navigate(`/playlist-detail/edit/${id}`)
            }, {
                icon: <Icon icon={trashIcon} />,
                title: 'Xóa Playlist',
                onClick: () => handleDeletePlaylist()
            }
        ]);
    }, []);

    useEffect(() => {
        if (typeof playlistsRecords.playlistsRecordsDetail === 'undefined') return;

        let playlistRecordDetail = playlistsRecords.playlistsRecordsDetail.find(playlist => playlist.playlistRecordId === id);
        if (typeof playlistRecordDetail !== 'undefined') {
            const { playlist, playlistId, playlistRecordId, quantity,
                records, totalTime } = playlistRecordDetail;

            setPlaylistDetail({
                title: playlist.title,
                categories: playlist.categories,
                createdDate: playlist.createdDate,
                createdBy: playlist.createdBy,
                description: playlist.description,
                mode: playlist.mode,
                imageURL: playlist.imageURL,
                records: records,
                quantity: quantity,
                totalTime: totalTime,
                playlistId: playlistId,
                playlistRecordId: playlistRecordId,
            });
        }
    }, [playlistsRecords.playlistsRecordsDetail]);

    useEffect(() => {
        if (playlist.playlist.length <= 0) return;

        dispatch(getPlaylistsRecordsDetail({ playlist, playlistsRecords, record }));
    }, [playlistsRecords.playlistsRecords]);

    const handleSetCurrentItems = useCallback((items: Array<any>) => {
        setCurrentItems(items);
    }, []);

    const handleChange = useCallback((value: string) => {
        setItemsPerPage(value);
    }, []);

    const handleListenAudioClick = (item: Record) => {
        setAudioLink(item.audioLink);
        setAudioActive(true);
    };

    const handleRemoveRecord = async (id: string) => {
        await dispatch(removeRecord({
            recordList: playlistDetail.records.map(record => record.id),
            recordId: id,
            playlistRecordId: playlistDetail.playlistRecordId
        }));
        await dispatch(getPlaylistsRecordsList());
    }

    return (
        <CommonPlaylistPage
            type='read'
            paging={PAGING_ITEMS}
            actionData={actionData}
            playlistDetail={playlistDetail}
            audio={{
                audioLink: audioLink,
                active: audioActive,
                setActive: setAudioActive
            }}
        >
            <Table
                paginate={{
                    dataForPaginate: playlistDetail.records,
                    setCurrentItems: handleSetCurrentItems
                }}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={handleChange}
                thead={['STT', 'Tên bản ghi', 'Ca sĩ', 'Tác giả', '', '']}
            >
                {currentItems.length > 0
                    && currentItems.map((item: Record, index) => {
                        return (
                            <tr key={index} style={{ height: '47px' }} className={cx('content')}>
                                <td><p>{index + 1}</p></td>
                                <td><p>{item.nameRecord}</p></td>
                                <td><p>{item.singer}</p></td>
                                <td><p>{item.author}</p></td>
                                <td><p className={cx('action')} onClick={() => handleListenAudioClick(item)}>Nghe</p></td>
                                <td><p className={cx('action')} onClick={() => handleRemoveRecord(item.id)}>Gỡ</p></td>
                            </tr>
                        );
                    })}
            </Table>
            <Loading visible={playlist.loading} />
        </CommonPlaylistPage>
    );
}

export default PlaylistDetailPage;