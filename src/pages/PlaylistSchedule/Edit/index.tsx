import classNames from "classnames/bind";
import { useFormik } from "formik";
import { ChangeEvent, ReactNode, memo, useCallback, useContext, useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import { PlaylistRecordDetail } from "~/api/playlistsRecords";
import { ActionDataType } from "~/components/Action";
import { Input } from "~/components/Input";
import { PagingItemType } from "~/components/Paging";
import { routes } from "~/config/routes";
import { formatDateDMYHPTS, formatDateYMD } from "~/context";
import { Icon, calendarIcon } from "~/icons";
import { CommonPage } from "~/pages/CommonPage";
import { getPlaylistsRecordsDetail } from "~/reducers/playlistsRecords";
import { RootState, useAppDispatch } from "~/store";
import { Table } from "../Table";
import style from './Edit.module.scss';
import { Button } from "~/components/Button";
import { PlaybackCycle } from "~/api/playlistScheduleAPI";
import { CheckBox } from "~/components/CheckBox";
import { MenuContext } from "~/context/Menu/MenuContext";
import { savePlaylistSchedule } from "~/thunk/playlistSchedule";
import Loading from "~/components/Loading";
import { CommonPlaylistSchedulePage } from "../CommonPlaylistSchedulePage";
import { Yup } from "~/constants";

const cx = classNames.bind(style);

// type InputProps = {
//     fieldName: string;
//     name: string;
//     type?: string;
//     value: string;
//     touched?: boolean;
//     onChange(e: ChangeEvent<any>): void;
//     onFocus: () => void;
//     onBlur: () => void;
// }

// type PlaylistDetailProps = {
//     data: PlaylistRecordDetail;
//     className?: string;
//     style?: any;
//     closeActionClick?: () => void;
//     onClick?: () => void;
// }

// type DialogConfirmProps = {
//     children: ReactNode;
//     className?: string;
//     onSubmit?: () => void;
//     active: boolean;
//     onClose?: () => void;
// }

// type Time = {
//     hour: string;
//     minute: string;
//     second: string;
// }

// type TimeBoxProps = {
//     day: string;
//     start: Time;
//     end: Time;
//     index: number;
//     onTimeChange(index: number, start: Time, end: Time): void;
// }

// export const DAYS = ['Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy', 'Chủ nhật'];
// export const DAYSNUM = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];

// export const DialogConfirm = memo(({ children, className, onSubmit, onClose, active }: DialogConfirmProps) => {
//     return (
//         <div className={cx('dialog-confirm', active && 'active', className)}>
//             <div className={cx('dialog-confirm__content')}>{children}</div>
//             <div className={cx('dialog-confirm__action-button')}>
//                 <Button type='button' outline onClick={onClose}>Hủy</Button>
//                 <Button type='button' onClick={onSubmit}>Lưu</Button>
//             </div>
//         </div>
//     );
// });

// const TimeBox = memo(({ day, start, index, end, onTimeChange }: TimeBoxProps) => {
//     const [startTime, setStartTime] = useState<Time>({} as Time);
//     const [endTime, setEndTime] = useState<Time>({} as Time);

//     useEffect(() => {
//         setStartTime(start);
//         setEndTime(end)
//     }, []);

//     useEffect(() => {
//         onTimeChange(index, startTime, endTime);
//     }, [startTime, endTime]);

//     return (
//         <div className={cx('time-box-container')}>
//             <p>{day}</p>
//             <div className={cx('time-box-item__time')}>
//                 <Input className={cx('time')} value={startTime.hour} onChange={(e: any) => setStartTime({ ...startTime, hour: e.target.value })} />
//                 <span>:</span>
//                 <Input className={cx('time')} value={startTime.minute} onChange={(e: any) => setStartTime({ ...startTime, minute: e.target.value })} />
//                 <span>:</span>
//                 <Input className={cx('time')} value={startTime.second} onChange={(e: any) => setStartTime({ ...startTime, second: e.target.value })} />
//                 <span> - </span>
//                 <Input className={cx('time')} value={endTime.hour} onChange={(e: any) => setEndTime({ ...endTime, hour: e.target.value })} />
//                 <span>:</span>
//                 <Input className={cx('time')} value={endTime.minute} onChange={(e: any) => setEndTime({ ...endTime, hour: e.target.value })} />
//                 <span>:</span>
//                 <Input className={cx('time')} value={endTime.second} onChange={(e: any) => setEndTime({ ...endTime, hour: e.target.value })} />
//             </div>
//         </div>
//     )
// });

// export const PlaylistItem = memo(({ data, className, style, closeActionClick, onClick }: PlaylistDetailProps) => {
//     return (
//         <div className={cx('playlist-item', className)} style={style} onClick={onClick}>
//             <div className={cx('playlist-item__title')}><p>{data.playlist.title}</p></div>
//             <div className={cx('playlist-item__time')}>
//                 <p>Thời lượng:</p>
//                 <p>{data.totalTime}</p>
//             </div>
//             <FontAwesomeIcon icon={faXmark} className={cx('playlist-item__close-action')} onClick={closeActionClick} />
//         </div>
//     );
// });

export type PlaylistScheduleDetail = {
    playbackCycle: PlaybackCycle[];
    playlist: PlaylistRecordDetail;
}

// export type TimeActive = {
//     id: string;
//     time: string;
//     index: number;
// }

// type ChosenDay = {
//     day: string;
//     start: Time;
//     end: Time;
// }

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
            newPlaylist: [],
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

// export const PlaylistScheduleEditPage = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const dispatch = useAppDispatch();

//     const { setActive: setActiveMenu } = useContext(MenuContext);

//     const playlistSchedule = useSelector((state: RootState) => state.playlistSchedule);
//     const playlist = useSelector((state: RootState) => state.playlist);
//     const record = useSelector((state: RootState) => state.record);
//     const playlistsRecords = useSelector((state: RootState) => state.playlistsRecords);

//     const [paging, setPaging] = useState<Array<PagingItemType>>([] as Array<PagingItemType>);
//     const [scheduleInput, setScheduleInput] = useState<Array<InputProps>>([] as Array<InputProps>);
//     const [newPlaylist, setNewPlaylist] = useState<Array<PlaylistRecordDetail>>([] as Array<PlaylistRecordDetail>);
//     const [actionData, setActionData] = useState<ActionDataType[]>([] as ActionDataType[]);
//     const [timeActive, setTimeActive] = useState<TimeActive>({} as TimeActive);
//     const [itemActive, setItemActive] = useState<Array<PlaylistScheduleDetail>>([] as Array<PlaylistScheduleDetail>);
//     const [active, setActive] = useState<boolean>(false);
//     const [daysChosen, setDaysChosen] = useState<ChosenDay[]>([] as ChosenDay[]);
//     const [playlistChosen, setplaylistChosen] = useState<PlaylistRecordDetail>({} as PlaylistRecordDetail);
//     const [itemChosen, setItemChosen] = useState<PlaylistScheduleDetail>({} as PlaylistScheduleDetail);

//     const scheduleFormik = useFormik({
//         initialValues: {
//             id: '',
//             name: '',
//             playbackTime: '',
//             playlist: [] as Array<PlaylistScheduleDetail>,
//             startDate: '',
//             endDate: ''
//         },
//         onSubmit: values => {
//             let playlists = itemActive.map(item => ({
//                 playbackCycle: item.playbackCycle.filter(playbackCycle => playbackCycle.time.length > 0),
//                 playlistsId: item.playlist.playlistId
//             }));

//             let playbackTime = `${formatDateDMYHPTS(values.startDate)} - ${formatDateDMYHPTS(values.endDate)}`;

//             dispatch(savePlaylistSchedule({
//                 id: values.id,
//                 playlistsIds: playlists.filter(playlist => playlist.playbackCycle.length > 0),
//                 navigate: () => navigate('/playlist-schedule'),
//                 name: values.name,
//                 playbackTime: playbackTime
//             }));

//             setActiveMenu(true);
//         }
//     });

//     useEffect(() => {
//         setActionData([
//             {
//                 icon: <Icon icon={calendarIcon} />,
//                 title: 'Áp lịch cho thiết bị',
//                 onClick: () => navigate(`/playlist-schedule/detail/edit/${id}/apply-schedule`)
//             }
//         ]);

//         setPaging([
//             {
//                 title: 'Lập lịch phát',
//                 to: routes.PlaylistSchedule,
//                 active: true
//             }, {
//                 title: 'Chi tiết',
//                 to: `/playlist-schedule/detail/${id}`,
//                 active: false
//             }, {
//                 title: 'Chỉnh sửa lịch phát',
//                 to: '#',
//                 active: false
//             }
//         ]);

//         dispatch(getPlaylistsRecordsDetail({ playlist, playlistsRecords, record }));
//     }, []);

//     useEffect(() => {
//         if (typeof playlistSchedule.playlistScheduleDetail === 'undefined' ||
//             typeof playlistSchedule.playlistScheduleDetail.playbackTime === 'undefined' ||
//             playlistsRecords.playlistsRecordsDetail.length <= 0)
//             return;

//         const playlistDetailList: Array<PlaylistScheduleDetail> = playlistSchedule.playlistScheduleDetail.playlist.map(playlist => ({
//             playbackCycle: playlist.playbackCycle,
//             playlist: playlistsRecords.playlistsRecordsDetail.find((playlistDetail: PlaylistRecordDetail) => playlistDetail.playlistId === playlist.playlistDetail.id) || {} as PlaylistRecordDetail
//         }));

//         const playbackTimeSplit = playlistSchedule.playlistScheduleDetail.playbackTime.split('-');
//         scheduleFormik.setValues({
//             ...playlistSchedule.playlistScheduleDetail,
//             playlist: playlistDetailList,
//             startDate: formatDateYMD(playbackTimeSplit[0].trim()),
//             endDate: formatDateYMD(playbackTimeSplit[1].trim())
//         });

//         setNewPlaylist(playlistsRecords.playlistsRecordsDetail.filter(playlistsRecordsDetail =>
//             !playlistDetailList.some(playlistDetail => playlistDetail.playlist.playlistId === playlistsRecordsDetail.playlistId)
//         ));
//     }, [playlistsRecords.playlistsRecordsDetail]);

//     useEffect(() => {
//         setScheduleInput([
//             {
//                 fieldName: "Tên lịch phát:",
//                 name: 'name',
//                 value: scheduleFormik.values.name,
//                 touched: scheduleFormik.touched.name,
//                 onChange: scheduleFormik.handleChange,
//                 onFocus: () => scheduleFormik.setFieldTouched('name', true),
//                 onBlur: () => scheduleFormik.setFieldTouched('name', false)
//             }, {
//                 fieldName: "Từ ngày",
//                 name: 'startDate',
//                 type: 'date',
//                 value: scheduleFormik.values.startDate,
//                 touched: scheduleFormik.touched.startDate,
//                 onChange: scheduleFormik.handleChange,
//                 onFocus: () => scheduleFormik.setFieldTouched('startDate', true),
//                 onBlur: () => scheduleFormik.setFieldTouched('startDate', false)
//             }, {
//                 fieldName: "Đến ngày",
//                 name: 'endDate',
//                 type: 'date',
//                 value: scheduleFormik.values.endDate,
//                 touched: scheduleFormik.touched.endDate,
//                 onChange: scheduleFormik.handleChange,
//                 onFocus: () => scheduleFormik.setFieldTouched('endDate', true),
//                 onBlur: () => scheduleFormik.setFieldTouched('endDate', false)
//             }
//         ]);

//         setItemActive(scheduleFormik.values.playlist);
//     }, [scheduleFormik.values]);

//     // console.log(scheduleFormik.values);

//     const handleRemoveSchedule = ({ time, playlistsId, playbackCycleIndex }: { time: string, playlistsId: string, playbackCycleIndex: number }) => {
//         setTimeActive({
//             id: playlistsId,
//             time: time,
//             index: playbackCycleIndex
//         });
//     }

//     const handleSaveChange = useCallback((dayActive: { title: string, checked: boolean }) => {
//         setItemActive(itemActive.map(item => {
//             if (item.playlist.playlistId === timeActive.id)
//                 return {
//                     ...item,
//                     playbackCycle: dayActive.checked === true
//                         ? item.playbackCycle.filter(playbackCycle => playbackCycle.day !== dayActive.title)
//                         : item.playbackCycle.map(playbackCycle => {
//                             return {
//                                 ...playbackCycle,
//                                 time: playbackCycle.time.filter(time => time !== timeActive.time)
//                             }
//                         })
//                 }
//             return {
//                 ...item,
//                 playbackCycle: dayActive.checked === true
//                     ? item.playbackCycle.filter(playbackCycle => playbackCycle.day !== dayActive.title)
//                     : item.playbackCycle
//             }
//         }));
//     }, [timeActive]);

//     const handleTimeChange = (index: number, start: Time, end: Time) => {
//         let newDaysChosen = daysChosen;
//         newDaysChosen[index] = {
//             ...daysChosen[index],
//             start: start,
//             end: end
//         }

//         setDaysChosen(newDaysChosen);
//         setItemChosen({
//             playbackCycle: newDaysChosen.map(dayChosen => ({
//                 day: dayChosen.day,
//                 time: [`${dayChosen.start.hour}:${dayChosen.start.minute}:${dayChosen.start.second} - ${dayChosen.end.hour}:${dayChosen.end.minute}:${dayChosen.end.second}`]
//             })),
//             playlist: playlistChosen
//         });
//     }

//     const handlePlaylistItemClick = (playlist: PlaylistRecordDetail) => {
//         setActive(true);
//         setplaylistChosen(playlist);
//     }

//     const handleAddPlaylist = () => {
//         setActive(false);
//         setDaysChosen([]);
//         setItemActive([...itemActive, itemChosen]);
//         setItemChosen({} as PlaylistScheduleDetail);
//     }

//     const handleCancleDialog = () => {
//         setActive(false);
//         setDaysChosen([]);
//         setItemChosen({} as PlaylistScheduleDetail);
//     }

//     return (
//         <div className={cx('playlist-schedule-edit')}>
//             <CommonPage
//                 pagingData={paging}
//                 title='Lịch phát số 1'
//                 actionData={actionData}
//             >
//                 <form className={cx('content')} onSubmit={scheduleFormik.handleSubmit}>
//                     <div className={cx('content__left')}>
//                         <div className={cx('schedule-information')}>
//                             <p>Thông tin lịch phát</p>
//                             {scheduleInput.map((input: InputProps) => <Input key={input.name} {...input} />)}
//                         </div>
//                         <div className={cx('playlist')}>
//                             <div className={cx('playlist__current')}>
//                                 <p>Danh sách Playlist</p>
//                                 {scheduleFormik.values.playlist.map((playlist: PlaylistScheduleDetail, index) => <PlaylistItem key={index} data={playlist.playlist} />)}
//                             </div>
//                             <div className={cx('playlist__new')}>
//                                 <p>Playlist mới</p>
//                                 {newPlaylist.map((playlist: PlaylistRecordDetail, index) =>
//                                     <PlaylistItem
//                                         key={index}
//                                         data={playlist}
//                                         onClick={() => handlePlaylistItemClick(playlist)}
//                                     />)}
//                             </div>
//                         </div>
//                     </div>
//                     <div className={cx('content__right')}>
//                         <Table
//                             data={{
//                                 id: scheduleFormik.values.id,
//                                 data: itemActive
//                             }}
//                             onRemoveItem={handleRemoveSchedule}
//                             saveChange={handleSaveChange}
//                         />
//                         <div className={cx('action')}>
//                             <Button type='button' outline onClick={() => navigate(`/playlist-schedule/detail/${id}`)}>Hủy</Button>
//                             <Button type='submit'>Lưu</Button>
//                         </div>
//                     </div>
//                 </form>
//                 <DialogConfirm
//                     className={cx('playlist-schedule-edit__dialog')}
//                     active={active}
//                     onClose={handleCancleDialog}
//                     onSubmit={handleAddPlaylist}
//                 >
//                     <p>Xóa lịch phát</p>
//                     <p>Xóa tất cả lịch phát trong ngày </p>
//                     <div className={cx('dialog__choose-days')}>
//                         {DAYSNUM.map((day, index) => {
//                             let checked = typeof daysChosen.find((dayChosen: ChosenDay) => dayChosen.day === day) !== 'undefined' ? true : false;

//                             return <CheckBox
//                                 key={day}
//                                 className={cx('table__body__dialog__checkbox')}
//                                 title={DAYS[index]}
//                                 checked={checked}
//                                 onChange={() => {
//                                     checked
//                                         ? setDaysChosen(daysChosen.filter(dayChosen => dayChosen.day !== day))
//                                         : setDaysChosen([...daysChosen, {
//                                             day: day, start: {
//                                                 hour: '06',
//                                                 minute: '00',
//                                                 second: '00'
//                                             }, end: {
//                                                 hour: '08',
//                                                 minute: '00',
//                                                 second: '00'
//                                             }
//                                         }])
//                                 }}
//                             />
//                         })}
//                     </div>
//                     <div className={cx('dialog__choose-times')}>
//                         {daysChosen.map((dayChosen, index) => {
//                             const { day, start, end } = dayChosen;

//                             return <TimeBox
//                                 key={index}
//                                 index={index}
//                                 day={day}
//                                 start={start}
//                                 end={end}
//                                 onTimeChange={handleTimeChange}
//                             />
//                         })}
//                     </div>
//                 </DialogConfirm>
//                 <Loading visible={playlistSchedule.loading} />
//             </CommonPage>
//         </div>
//     );
// }