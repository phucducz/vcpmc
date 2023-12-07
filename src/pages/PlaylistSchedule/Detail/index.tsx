import classNames from "classnames/bind";
import { useState, useEffect, useContext } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router";

import style from './Detail.module.scss';
import { CommonPage } from "~/pages/CommonPage";
import { Table } from "~/components/Table";
import { RootState, useAppDispatch } from "~/store";
import { ActionDataType } from "~/components/Action";
import { PlaylistSchedule, SchedulePlaylist, SchedulePlaylistDetail } from "~/api/playlistScheduleAPI";
import { PagingItemType } from "~/components/Paging";
import { routes } from "~/config/routes";
import { MenuContext } from "~/context/Menu/MenuContext";
import { Playlist } from "~/api/playlistAPI";
import { getPlaylistList } from "~/thunk/playlistThunk";
import { setPlaylistScheduleDetail } from "~/reducers/playlistSchedule";
import { getPlaylistsRecordsList } from "~/thunk/playlistsRecordsThunk";
import Loading from "~/components/Loading";

const cx = classNames.bind(style);

export const PlaylistScheduleDetailPage = () => {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { setType } = useContext(MenuContext);

    const playlistSchedule = useSelector((state: RootState) => state.playlistSchedule);
    const playlist = useSelector((state: RootState) => state.playlist);
    const playlistsRecords = useSelector((state: RootState) => state.playlistsRecords);
    const record = useSelector((state: RootState) => state.record);

    const [actionData, setActionData] = useState<ActionDataType[]>([] as ActionDataType[]);
    const [currentItems, setCurrentItems] = useState<Array<any>>([]);
    const [itemsPerPage, setItemsPerPage] = useState<string>('8');
    const [scheduleDetail, setScheduleDetail] = useState<SchedulePlaylistDetail>({
        id: '',
        name: '',
        playbackTime: '',
        playlist: []
    } as SchedulePlaylistDetail);
    const [paging, setPaging] = useState<Array<PagingItemType>>([] as Array<PagingItemType>);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setType('dynamic');

        setPaging([
            {
                title: 'Lập lịch phát',
                to: routes.PlaylistSchedule,
                active: true
            }, {
                title: 'Chi tiết',
                to: `#`,
                active: false
            }
        ]);

        setActionData([
            {
                icon: <FontAwesomeIcon icon={faEdit} />,
                title: 'Chỉnh sửa lịch phát',
                onClick: () => navigate(`/playlist-schedule/detail/edit/${id}`)
            }
        ]);

        let schedule: PlaylistSchedule = playlistSchedule.listSchedule.find(schedule => schedule.id === id) || {} as PlaylistSchedule;

        const scheduleDetail: SchedulePlaylistDetail = {
            id: schedule.id,
            name: schedule.name,
            playbackTime: schedule.playbackTime,
            playlist: schedule.playlistsIds.map(item => ({
                playbackCycle: item.playbackCycle,
                time: item.time,
                playlistDetail: playlist.playlist.find(playlist => item.playlistsId === playlist.id) || {} as Playlist
            }))
        }

        setScheduleDetail(scheduleDetail);
        dispatch(setPlaylistScheduleDetail(scheduleDetail));

        playlistsRecords.playlistsRecords.length <= 0 && dispatch(getPlaylistsRecordsList());
        playlist.playlist.length <= 0 && dispatch(getPlaylistList());
    }, []);

    useEffect(() => {
        if (playlistsRecords.loading)
            setLoading(true);
        else if (playlist.loading)
            setLoading(true);
        else setLoading(false);
    }, [playlistsRecords, playlist]);

    const handleSetCurrentItems = (items: Array<any>) => {
        setCurrentItems(items);
    }

    const handleChange = (value: string) => {
        setItemsPerPage(value);
    }

    return (
        <div className={cx('schedule-playlist-detail-container')}>
            <CommonPage
                pagingData={paging}
                title={scheduleDetail.name}
                actionData={actionData}
            >
                <p className={cx('header')}>Danh sách Playlist</p>
                <Table
                    paginate={{
                        dataForPaginate: scheduleDetail.playlist,
                        setCurrentItems: handleSetCurrentItems
                    }}
                    loading={playlistSchedule.loading}
                    itemsPerPage={itemsPerPage}
                    setItemsPerPage={handleChange}
                    thead={['STT', 'Tên lịch', 'Ngày phát Playlist', 'Bắt đầu - Kết thúc', 'Chu kỳ phát', 'Thiết bị']}
                >
                    {currentItems.map((item: SchedulePlaylist, index) => {
                        return (
                            <tr key={index} style={{ height: '47px' }} className={cx('content')}>
                                <td><p>{index + 1}</p></td>
                                <td><p>{item.playlistDetail.title}</p></td>
                                <td><p>{scheduleDetail.playbackTime}</p></td>
                                <td><p className={cx('table__time')}>{item.time.map((item: string, index: number) => <span key={index}>{item}</span>)}</p></td>
                                <td><p className={cx('table__cycle')}>{item.playbackCycle.map((cycle: string, index: number) => <span key={index}>{cycle}</span>)}</p></td>
                                <td><p>{scheduleDetail.playbackTime}</p></td>
                            </tr>
                        )
                    }
                    )}
                </Table>
                <Loading visible={loading} />
            </CommonPage>
        </div>
    );
}