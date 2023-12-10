import classNames from "classnames/bind";
import { useFormik } from "formik";
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";

import { PlaylistRecordDetail } from "~/api/playlistsRecords";
import { Record } from "~/api/recordAPI";
import { User } from "~/api/userAPI";
import { Button } from "~/components/Button";
import Loading from "~/components/Loading";
import { PagingItemType } from "~/components/Paging";
import { routes } from "~/config/routes";
import { getMoment } from "~/context";
import { CommonPage } from "~/pages/CommonPage";
import { setRecordsOfPlaylist } from "~/reducers/playlistsRecords";
import { RootState, useAppDispatch } from "~/store";
import { editRecordsPlaylist } from "~/thunk/playlistsRecordsThunk";
import { RecordPlaylist } from "../Components/RecordPlaylist";
import { RecordPlaylistWareHouse } from "../Components/RecordPlaylistWareHouse/RecordWarehouse";
import style from './AddRecord.module.scss';

const cx = classNames.bind(style);

export const AddRecordPlaylistPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispath = useAppDispatch();

    const playlistsRecords = useSelector((state: RootState) => state.playlistsRecords);
    const record = useSelector((state: RootState) => state.record);

    const [paging, setPaging] = useState<Array<PagingItemType>>([] as Array<PagingItemType>);
    const [records, setRecords] = useState<Array<Record>>([] as Array<Record>);

    const playlistRecordsFormik = useFormik({
        initialValues: {
            playlist: {
                categories: [] as string[],
                createdBy: {} as User,
                createdDate: '',
                description: '',
                id: '',
                imageURL: '',
                mode: '',
                title: '',
            },
            playlistId: '',
            playlistRecordId: '',
            records: [] as Record[],
            quantity: 0,
            totalTime: '--:--:--',
        } as PlaylistRecordDetail,
        onSubmit: values => {
            if (values.playlistRecordId !== '')
                dispath(editRecordsPlaylist({
                    playlistRecordId: values.playlistRecordId,
                    recordList: values.records.map(record => record.id),
                    navigate: () => navigate(`/playlist-detail/edit/${id}`)
                }));
            else {
                dispath(setRecordsOfPlaylist(values.records));
                navigate(routes.AddPlaylist);
            }
        }
    });

    useEffect(() => {
        switch (id) {
            case 'new-playlist':
                setPaging([
                    {
                        title: 'Playlist',
                        to: routes.PlaylistManagement,
                        active: true
                    }, {
                        title: 'Thêm playlist mới',
                        to: routes.AddPlaylist,
                        active: false
                    }, {
                        title: 'Thêm bản ghi vào playlist',
                        to: "#",
                        active: false
                    }
                ]);
                playlistRecordsFormik.setFieldValue('records', playlistsRecords.recordsOfPlaylist);

                break;

            default:
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
                        active: false
                    }
                ]);

                let playlistsRecordsDetail = playlistsRecords.playlistsRecordsDetail.find((playlistRecordDetail: PlaylistRecordDetail) =>
                    playlistRecordDetail.playlistRecordId === id) || {} as PlaylistRecordDetail;
                playlistRecordsFormik.setValues(playlistsRecordsDetail);

                break;
        }
    }, [playlistsRecords]);

    useEffect(() => {
        let recordList = [...record.recordList];

        playlistRecordsFormik.values.records.forEach((recordItem: Record) => {
            let index = recordList.indexOf(recordItem);
            if (index > -1) recordList.splice(index, 1);
        });
        setRecords(recordList);

        if (playlistRecordsFormik.values.records.length <= 0) return;

        let totalTime = getMoment(playlistRecordsFormik.values.records);

        playlistRecordsFormik.setValues({
            ...playlistRecordsFormik.values,
            totalTime: totalTime.split('T')[1].slice(0, 8),
            quantity: playlistRecordsFormik.values.records.length
        });
    }, [playlistRecordsFormik.values.records]);

    const handleAddRecord = useCallback((item: Record) => {
        playlistRecordsFormik.setFieldValue('records', [...playlistRecordsFormik.values.records, item]);
    }, [playlistRecordsFormik.values.records]);

    const handleRemoveRecord = useCallback((id: string) => {
        playlistRecordsFormik.setFieldValue('records', playlistRecordsFormik.values.records.filter(record => record.id !== id));
    }, [playlistRecordsFormik.values.records]);

    const handleCancelClick = () => {
        switch (id) {
            case 'new-playlist':
                navigate(routes.AddPlaylist);
                break;

            default:
                navigate(`/playlist-detail/edit/${id}`);
                break;
        }
    }

    return (
        <div className={cx('playlist-edit__add-record')}>
            <CommonPage
                pagingData={paging}
                title='Playlist Top ca khúc 2021'
                className={cx('common-page-container')}
            >
                <form className={cx('record-container')} onSubmit={playlistRecordsFormik.handleSubmit}>
                    <div className={cx('record-container__data')}>
                        <RecordPlaylistWareHouse data={records} loading={record.loading} onItemAddClick={handleAddRecord} />
                        <RecordPlaylist data={playlistRecordsFormik.values} onItemRemoveClick={handleRemoveRecord} />
                    </div>
                    <div className={cx('record-container__action')}>
                        <Button outline type='button' onClick={handleCancelClick}>Hủy</Button>
                        <Button type='submit'>Lưu</Button>
                    </div>
                </form>
            </CommonPage>
            <Loading visible={playlistsRecords.loading} />
        </div>
    );
}