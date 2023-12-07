import classNames from "classnames/bind";
import { ChangeEvent, useEffect, useState, memo } from 'react';
import { useParams } from "react-router";

import style from './Edit.module.scss';
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "~/store";
import { useFormik } from "formik";
import { SchedulePlaylist, SchedulePlaylistDetail } from "~/api/playlistScheduleAPI";
import { CommonPage } from "~/pages/CommonPage";
import { routes } from "~/config/routes";
import { PagingItemType } from "~/components/Paging";
import { Input } from "~/components/Input";
import { formatDateYMD } from "~/context";
import { PlaylistRecordInitialState, getPlaylistsRecordsDetail } from "~/reducers/playlistsRecords";

const cx = classNames.bind(style);

type InputProps = {
    fieldName: string;
    name: string;
    type?: string;
    value: string;
    touched?: boolean;
    onChange(e: ChangeEvent<any>): void;
    onFocus: () => void;
    onBlur: () => void;
}

type PlaylistDetailProps = {
    data: any
}

const PlaylistItem = memo(({ data }: PlaylistDetailProps) => {
    console.log(data);

    return (
        <div className={cx('playlist-item')}>

        </div>
    );
});

type PlaylistScheduleDetail = {
    playbackCycle: string[];
    time: string[];
    playlist: PlaylistRecordInitialState
}

export const PlaylistScheduleEditPage = () => {
    const { id } = useParams();
    const dispatch = useAppDispatch();

    const playlistSchedule = useSelector((state: RootState) => state.playlistSchedule);
    const playlist = useSelector((state: RootState) => state.playlist);
    const record = useSelector((state: RootState) => state.record);
    const playlistsRecords = useSelector((state: RootState) => state.playlistsRecords);

    const [paging, setPaging] = useState<Array<PagingItemType>>([] as Array<PagingItemType>);
    const [scheduleInput, setScheduleInput] = useState<Array<InputProps>>([] as Array<InputProps>);

    const scheduleFormik = useFormik({
        initialValues: {
            id: '',
            name: '',
            playbackTime: '',
            // playlist: {} as PlaylistScheduleDetail,
            startDate: '',
            endDate: ''
        },
        onSubmit: values => {

        }
    });

    useEffect(() => {
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
                active: true
            }
        ]);

        if (typeof playlistSchedule.playlistScheduleDetail === 'undefined' ||
            typeof playlistSchedule.playlistScheduleDetail.playbackTime === 'undefined') return;

        const playlist = playlistSchedule.playlistScheduleDetail.playlist.map(playlist => playlist);
        console.log(playlist);
        
        const playbackTimeSplit = playlistSchedule.playlistScheduleDetail.playbackTime.split('-');
        scheduleFormik.setValues({
            ...playlistSchedule.playlistScheduleDetail,
            startDate: formatDateYMD(playbackTimeSplit[0].trim()),
            endDate: formatDateYMD(playbackTimeSplit[1].trim()),
            // playlist: {
                
            // }
        });

        // dispatch(getPlaylistsRecordsDetail({ playlist, playlistsRecords, record }));
    }, []);

    console.log(playlistsRecords.playlistsRecordsDetail);

    useEffect(() => {
        setScheduleInput([
            {
                fieldName: "Tên lịch phát:",
                name: 'name',
                value: scheduleFormik.values.name,
                touched: scheduleFormik.touched.name,
                onChange: scheduleFormik.handleChange,
                onFocus: () => scheduleFormik.setFieldTouched('name', true),
                onBlur: () => scheduleFormik.setFieldTouched('name', false)
            }, {
                fieldName: "Từ ngày",
                name: 'startDate',
                type: 'date',
                value: scheduleFormik.values.startDate,
                touched: scheduleFormik.touched.startDate,
                onChange: scheduleFormik.handleChange,
                onFocus: () => scheduleFormik.setFieldTouched('startDate', true),
                onBlur: () => scheduleFormik.setFieldTouched('startDate', false)
            }, {
                fieldName: "Đến ngày",
                name: 'endDate',
                type: 'date',
                value: scheduleFormik.values.endDate,
                touched: scheduleFormik.touched.endDate,
                onChange: scheduleFormik.handleChange,
                onFocus: () => scheduleFormik.setFieldTouched('endDate', true),
                onBlur: () => scheduleFormik.setFieldTouched('endDate', false)
            }
        ]);
    }, [scheduleFormik.values]);

    console.log(scheduleFormik.values);

    return (
        <div className={cx('playlist-schedule-edit')}>
            <CommonPage
                pagingData={paging}
                title='Lịch phát số 1'
            >
                <div className={cx('content')}>
                    <div className={cx('content__left')}>
                        <div className={cx('schedule-information')}>
                            <p>Thông tin lịch phát</p>
                            {scheduleInput.map((input: InputProps) => <Input key={input.name} {...input} />)}
                        </div>
                        <div className={cx('playlist')}>
                            <div className={cx('playlist__current')}>
                                <p>Thông tin lịch phát</p>
                                {/* {scheduleFormik.values.playlist.map(playlist => <PlaylistItem data={playlist} />)} */}
                            </div>
                            <div className={cx('playlist__new')}>
                                <p>Thông tin lịch phát</p>

                            </div>
                        </div>
                    </div>
                    <div className={cx('content__right')}>

                    </div>
                </div>
            </CommonPage>
        </div>
    );
}