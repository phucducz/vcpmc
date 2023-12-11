import classNames from "classnames/bind";

import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { PlaybackCycle } from "~/api/playlistScheduleAPI";
import { PlaylistRecordDetail } from "~/api/playlistsRecords";
import { ActionDataType } from "~/components/Action";
import Loading from "~/components/Loading";
import { PagingItemType } from "~/components/Paging";
import { routes } from "~/config/routes";
import { Yup } from "~/constants";
import { formatDateDMYHPTS } from "~/context";
import { Icon, calendarIcon } from "~/icons";
import { getPlaylistsRecordsDetail } from "~/reducers/playlistsRecords";
import { RootState, useAppDispatch } from "~/store";
import { savePlaylistSchedule } from "~/thunk/playlistSchedule";
import { getPlaylistList } from "~/thunk/playlistThunk";
import { getPlaylistsRecordsList } from "~/thunk/playlistsRecordsThunk";
import { CommonPlaylistSchedulePage, PlaylistScheduleDetail } from "../CommonPlaylistSchedulePage";
import style from './AddPlaylistSchedule.module.scss';

const cx = classNames.bind(style);

function AddPlaylistSchedulePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const playlistsRecords = useSelector((state: RootState) => state.playlistsRecords);
    const playlistSchedule = useSelector((state: RootState) => state.playlistSchedule);
    const playlist = useSelector((state: RootState) => state.playlist);
    const record = useSelector((state: RootState) => state.record);

    const [itemActive, setItemActive] = useState<Array<PlaylistScheduleDetail>>([] as Array<PlaylistScheduleDetail>);
    const [paging, setPaging] = useState<Array<PagingItemType>>([] as Array<PagingItemType>);
    const [actionData, setActionData] = useState<ActionDataType[]>([] as ActionDataType[]);

    const scheduleFormik = useFormik({
        initialValues: {
            id: '',
            name: '',
            playbackTime: '',
            playlist: [] as Array<PlaylistScheduleDetail>,
            newPlaylist: [] as Array<PlaylistRecordDetail>,
            startDate: '',
            endDate: '',
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
                title: 'Thêm lịch phát mới',
                to: '#',
                active: false
            }
        ]);

        playlistsRecords.playlistsRecords.length <= 0 && dispatch(getPlaylistsRecordsList());
        playlist.playlist.length <= 0 && dispatch(getPlaylistList());
    }, []);

    useEffect(() => {
        dispatch(getPlaylistsRecordsDetail({ playlist, playlistsRecords, record }));
    }, [playlistsRecords.playlistsRecords, playlist]);

    useEffect(() => {
        console.log(scheduleFormik.values.playlist);

        setItemActive(scheduleFormik.values.playlist);
    }, [scheduleFormik.values.playlist]);


    useEffect(() => {
        scheduleFormik.setValues({
            ...scheduleFormik.values,
            newPlaylist: playlistsRecords.playlistsRecordsDetail
        });
    }, [playlistsRecords.playlistsRecordsDetail]);

    useEffect(() => {
        scheduleFormik.setFieldValue(
            'newPlaylist',
            playlistsRecords.playlistsRecordsDetail.filter(playlistsRecordsDetail => !scheduleFormik.values.playlist.some(playlist => playlist.playlist.playlistId === playlistsRecordsDetail.playlistId))
        );
    }, [scheduleFormik.values.playlist]);

    useEffect(() => {
        scheduleFormik.setFieldValue('playlist', itemActive);
    }, [itemActive]);

    return <div>
        <CommonPlaylistSchedulePage
            title='Lập lịch phát'
            data={itemActive}
            setData={setItemActive}
            newPlaylist={scheduleFormik.values.newPlaylist}
            formik={scheduleFormik}
            action={actionData}
            paging={paging}
        />
        <Loading visible={false} />
    </div>
}

export default AddPlaylistSchedulePage;