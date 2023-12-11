import classNames from "classnames/bind";
import { useFormik } from "formik";
import { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";

import { PlaybackCycle } from "~/api/playlistScheduleAPI";
import { PlaylistRecordDetail } from "~/api/playlistsRecords";
import { ActionDataType } from "~/components/Action";
import { PagingItemType } from "~/components/Paging";
import { routes } from "~/config/routes";
import { Yup } from "~/constants";
import { formatDateDMYHPTS, formatDateYMD } from "~/context";
import { Icon, calendarIcon } from "~/icons";
import { getPlaylistsRecordsDetail } from "~/reducers/playlistsRecords";
import { RootState, useAppDispatch } from "~/store";
import { savePlaylistSchedule } from "~/thunk/playlistSchedule";
import { CommonPlaylistSchedulePage } from "../CommonPlaylistSchedulePage";
import style from './Edit.module.scss';

const cx = classNames.bind(style);

export type PlaylistScheduleDetail = {
    playbackCycle: PlaybackCycle[];
    playlist: PlaylistRecordDetail;
}

export const PlaylistScheduleEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const playlist = useSelector((state: RootState) => state.playlist);
    const record = useSelector((state: RootState) => state.record);
    const playlistsRecords = useSelector((state: RootState) => state.playlistsRecords);
    const playlistSchedule = useSelector((state: RootState) => state.playlistSchedule);

    const [itemActive, setItemActive] = useState<Array<PlaylistScheduleDetail>>([] as Array<PlaylistScheduleDetail>);
    const [paging, setPaging] = useState<Array<PagingItemType>>([] as Array<PagingItemType>);
    const [actionData, setActionData] = useState<ActionDataType[]>([] as ActionDataType[]);
    const [title, setTitle] = useState<string>('');

    const scheduleFormik = useFormik({
        initialValues: {
            id: '',
            name: '',
            playbackTime: '',
            playlist: [] as Array<PlaylistScheduleDetail>,
            newPlaylist: [] as Array<PlaylistRecordDetail>,
            startDate: '',
            endDate: ''
        },
        validationSchema: Yup.object({
            startDate: Yup.string().required(),
            endDate: Yup.string().required(),
            name: Yup.string().required()
        }),
        onSubmit: values => {
            let playlists = itemActive.map((item: PlaylistScheduleDetail) => ({
                playbackCycle: item.playbackCycle.filter((playbackCycle: PlaybackCycle) => playbackCycle.time.length > 0),
                playlistsId: item.playlist.playlistId
            }));

            let playbackTime = `${formatDateDMYHPTS(values.startDate)} - ${formatDateDMYHPTS(values.endDate)}`;

            dispatch(savePlaylistSchedule({
                id: values.id,
                playlistsIds: playlists.filter(playlist => playlist.playbackCycle.length > 0),
                navigate: () => navigate('/playlist-schedule'),
                name: values.name,
                playbackTime: playbackTime
            }));
        }
    });

    useEffect(() => {
        setActionData([
            {
                icon: <Icon icon={calendarIcon} />,
                title: 'Áp lịch cho thiết bị',
                onClick: () => navigate(`/playlist-schedule/detail/edit/${id}/apply-schedule`)
            }
        ]);

        setPaging([
            {
                title: 'Lập lịch phát',
                to: routes.PlaylistSchedule,
                active: true
            }, {
                title: 'Chi tiết',
                to: `/playlist-schedule/detail/${id}`,
                active: false
            }, {
                title: 'Chỉnh sửa lịch phát',
                to: '#',
                active: false
            }
        ]);

        dispatch(getPlaylistsRecordsDetail({ playlist, playlistsRecords, record }));
    }, []);

    useEffect(() => {
        setItemActive(scheduleFormik.values.playlist);

        typeof scheduleFormik.values.playlist !== 'undefined' && scheduleFormik.values.playlist.length > 0 &&
            scheduleFormik.setFieldValue('newPlaylist', playlistsRecords.playlistsRecordsDetail.filter(playlistsRecordsDetail =>
                !scheduleFormik.values.playlist.some((playlistDetail: PlaylistScheduleDetail) => playlistDetail.playlist.playlistId === playlistsRecordsDetail.playlistId)
            ));
    }, [scheduleFormik.values.playlist]);

    useEffect(() => {
        if (typeof playlistSchedule.playlistScheduleDetail === 'undefined' ||
            typeof playlistSchedule.playlistScheduleDetail.playbackTime === 'undefined' ||
            playlistsRecords.playlistsRecordsDetail.length <= 0)
            return;

        const playlistDetailList: Array<PlaylistScheduleDetail> = playlistSchedule.playlistScheduleDetail.playlist.map(playlist => ({
            playbackCycle: playlist.playbackCycle,
            playlist: playlistsRecords.playlistsRecordsDetail.find((playlistDetail: PlaylistRecordDetail) => playlistDetail.playlistId === playlist.playlistDetail.id) || {} as PlaylistRecordDetail
        }));

        const playbackTimeSplit = playlistSchedule.playlistScheduleDetail.playbackTime.split('-');

        scheduleFormik.setValues({
            ...playlistSchedule.playlistScheduleDetail,
            newPlaylist: playlistsRecords.playlistsRecordsDetail.filter(playlistsRecordsDetail => !playlistDetailList.some(playlistDetail => playlistDetail.playlist.playlistId === playlistsRecordsDetail.playlistId)),
            playlist: playlistDetailList,
            startDate: formatDateYMD(playbackTimeSplit[0].trim()),
            endDate: formatDateYMD(playbackTimeSplit[1].trim()),
        });

        setTitle(playlistSchedule.playlistScheduleDetail.name);
    }, [playlistsRecords.playlistsRecordsDetail]);

    useEffect(() => {
        scheduleFormik.setFieldValue('playlist', itemActive);
    }, [itemActive]);

    return <CommonPlaylistSchedulePage
        title={title}
        data={itemActive}
        setData={setItemActive}
        newPlaylist={scheduleFormik.values.newPlaylist}
        formik={scheduleFormik}
        action={actionData}
        paging={paging}
    />
}