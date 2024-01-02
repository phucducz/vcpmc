import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";

import { Playlist } from "~/api/playlistAPI";
import { PlaybackCycle, PlaylistSchedule, SchedulePlaylist, SchedulePlaylistDetail } from "~/api/playlistScheduleAPI";
import Loading from "~/components/Loading";
import { PagingItemType } from "~/components/Paging";
import { Table } from "~/components/Table";
import { routes } from "~/config/routes";
import { useMenu } from "~/context/hooks";
import { CommonPage } from "~/pages/CommonPage";
import { setPlaylistScheduleDetail } from "~/reducers/playlistSchedule";
import { RootState, useAppDispatch } from "~/store";
import { getPlaylistList } from "~/thunk/playlistThunk";
import { getPlaylistsRecordsList } from "~/thunk/playlistsRecordsThunk";
import style from './Detail.module.scss';

const cx = classNames.bind(style);

function PlaylistScheduleDetailPage() {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { setType } = useMenu();

    const playlistSchedule = useSelector((state: RootState) => state.playlistSchedule);
    const playlist = useSelector((state: RootState) => state.playlist);
    const playlistsRecords = useSelector((state: RootState) => state.playlistsRecords);

    const [actionData, setActionData] = useState<any[]>([] as any[]);
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

        if (playlist.playlist.length <= 0 ||
            playlistsRecords.playlistsRecords.length <= 0) {
            // dispatch(getPlaylistList());
            // dispatch(getPlaylistsRecordsList());

            return;
        }

        let schedule: PlaylistSchedule = playlistSchedule.listSchedule.find(schedule => schedule.id === id) || {} as PlaylistSchedule;

        const scheduleDetail: SchedulePlaylistDetail = {
            id: schedule.id,
            name: schedule.name,
            playbackTime: schedule.playbackTime,
            playlist: schedule.playlistsIds.map(item => ({
                playbackCycle: item.playbackCycle,
                playlistDetail: playlist.playlist.find(playlist => item.playlistsId === playlist.id) || {} as Playlist
            }))
        }

        setScheduleDetail(scheduleDetail);
        dispatch(setPlaylistScheduleDetail(scheduleDetail));
    }, [playlist.playlist, playlistsRecords.playlistsRecords]);

    useEffect(() => {
        playlistsRecords.playlistsRecords.length <= 0 && dispatch(getPlaylistsRecordsList());
        playlist.playlist.length <= 0 && dispatch(getPlaylistList());
    }, []);

    useEffect(() => {
        if (playlistsRecords.loading) setLoading(true);
        else if (playlist.loading) setLoading(true);
        else if (playlistSchedule.loading === true) setLoading(true);
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
                                <td><div className={cx('table__time')}>{item.playbackCycle.map((item: PlaybackCycle, index: number) =>
                                    <p key={index}>{item.time.map(time => time)}</p>
                                )}</div></td>
                                <td><div className={cx('table__cycle')}>{item.playbackCycle.map((item: PlaybackCycle, index: number) => <span key={index}>{item.day}</span>)}</div></td>
                                <td><p>{scheduleDetail.playbackTime}</p></td>
                            </tr>
                        )
                    })}
                </Table>
                <Loading visible={loading} />
            </CommonPage>
        </div>
    );
}

export default PlaylistScheduleDetailPage;