import classNames from "classnames/bind";
import { useNavigate, useParams } from "react-router";
import { useCallback, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

import style from './Edit.module.scss';
import { RootState, useAppDispatch } from "~/store";
import { MenuContext } from "~/context/Menu/MenuContext";
import { ActionDataType } from "~/components/Action";
import { Icon, trashIcon } from "~/icons";
import { Record } from "~/api/recordAPI";
import { getPlaylistsRecordsDetail } from "~/reducers/playlistsRecords";
import { editPlaylist } from "~/thunk/playlistsRecordsThunk";
import { CommonPlaylistPage, PlaylistValue } from "../CommonPage";
import { PagingItemType } from "~/components/Paging";
import { routes } from "~/config/routes";
import { Table } from "~/components/Table";
import { useFormik } from "formik";
import { User } from "~/api/userAPI";
import moment from "moment";
import { Button } from "~/components/Button";

const cx = classNames.bind(style);

export const EditPlaylistDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { setActive, setType } = useContext(MenuContext);

    const playlist = useSelector((state: RootState) => state.playlist);
    const record = useSelector((state: RootState) => state.record);
    const playlistsRecords = useSelector((state: RootState) => state.playlistsRecords);

    const [paging, setPaging] = useState<Array<PagingItemType>>([] as Array<PagingItemType>);
    const [audioLink, setAudioLink] = useState<string>('');
    const [audioActive, setAudioActive] = useState<boolean>(false);
    const [actionData, setActionData] = useState<ActionDataType[]>([] as ActionDataType[]);
    const [currentItems, setCurrentItems] = useState<Array<Record>>([] as Array<Record>);
    const [itemsPerPage, setItemsPerPage] = useState<string>('8');

    const playlistFormik = useFormik({
        initialValues: {
            title: '',
            categories: [] as Array<string>,
            createdDate: '',
            createdBy: {} as User,
            description: '',
            mode: '',
            imageURL: '',
            records: [] as Array<Record>,
            quantity: 0,
            totalTime: '--:--:--',
            playlistId: '',
            playlistRecordId: '',
        } as PlaylistValue,
        onSubmit: values => {
            dispatch(editPlaylist({
                recordList: values.records.map(record => record.id),
                playlistRecordId: values.playlistRecordId,
                playlist: {
                    id: values.playlistId,
                    description: values.description,
                    mode: values.mode,
                    categories: values.categories,
                    title: values.title
                },
                navigate: () => navigate(`/playlist-detail/${id}`)
            }));
        }
    });

    useEffect(() => {
        setActive(false);
        setType('dynamic');

        setPaging([
            {
                title: 'Playlist',
                to: routes.PlaylistManagement,
                active: true
            }, {
                title: 'Chi tiết playlist',
                to: `/playlist-detail/${id}`,
                active: false
            }, {
                title: 'Chỉnh sửa',
                to: "#",
            }
        ]);

        setActionData([
            {
                icon: <FontAwesomeIcon icon={faEdit} />,
                title: 'Thêm bản ghi',
                onClick: () => navigate(`/playlist-detail/${id}/add-record`)
            }
        ]);
    }, []);

    useEffect(() => {
        if (typeof playlistsRecords.playlistsRecordsDetail === 'undefined') return;

        let playlistRecordDetail = playlistsRecords.playlistsRecordsDetail.find(playlist => playlist.playlistRecordId === id);

        if (typeof playlistRecordDetail !== 'undefined') {
            const { playlist, playlistId, playlistRecordId, quantity,
                records, totalTime } = playlistRecordDetail;

            playlistFormik.setValues({
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
                playlistRecordId: playlistRecordId
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
        let momentTime = moment
            ("00000000", "hh:mm:ss")
            .utcOffset(0)
            .set({ hour: 0, minute: 0, second: 0, millisecond: 0 });

        const recordsCurrent = playlistFormik.values.records.filter(record => {
            if (record.id !== id) {
                let timeSplit = record.time.split(':');
                momentTime.add("minutes", timeSplit[0]).add("seconds", timeSplit[1]);
                return record.id !== id;
            }
        });

        playlistFormik.setFieldValue('records', recordsCurrent);
        playlistFormik.setValues({
            ...playlistFormik.values,
            records: recordsCurrent,
            totalTime: momentTime.toISOString().split('T')[1].slice(0, 8),
            quantity: recordsCurrent.length
        });
    }

    return (
        <CommonPlaylistPage
            type={{
                type: 'modify',
                formik: playlistFormik
            }}
            paging={paging}
            actionData={actionData}
            playlistDetail={playlistFormik.values}
            audio={{
                audioLink: audioLink,
                active: audioActive,
                setActive: setAudioActive
            }}
        >
            <Table
                paginate={{
                    dataForPaginate: playlistFormik.values.records,
                    setCurrentItems: handleSetCurrentItems
                }}
                loading={playlistsRecords.loading}
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
            <Button outline type='button' onClick={() => navigate(`/playlist-detail/${id}`)}>Hủy</Button>
            <Button type='submit'>Lưu</Button>
        </CommonPlaylistPage>
    );
}