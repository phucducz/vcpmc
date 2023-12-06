import classNames from "classnames/bind";
import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";
import { Formik, useFormik } from "formik";

import style from './AddRecord.module.scss';
import { CommonPage } from "~/pages/CommonPage";
import { PagingItemType } from "~/components/Paging";
import { routes } from "~/config/routes";
import { RootState, useAppDispatch } from "~/store";
import { PlaylistRecordDetail } from "~/api/playlistsRecords";
import { RecordPlaylistWareHouse } from "../Components/RecordPlaylistWareHouse/RecordWarehouse";
import { RecordPlaylist } from "../Components/RecordPlaylist";
import { Record } from "~/api/recordAPI";
import { getMoment } from "~/context";
import { Button } from "~/components/Button";
import { editRecordsPlaylist } from "~/thunk/playlistsRecordsThunk";
import Loading from "~/components/Loading";

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
        initialValues: {} as PlaylistRecordDetail,
        onSubmit: values => {
            console.log({
                playlistRecordId: values.playlistRecordId,
                recordList: values.records.map(record => record.id)
            });

            dispath(editRecordsPlaylist({
                playlistRecordId: values.playlistRecordId,
                recordList: values.records.map(record => record.id),
                navigate: () => navigate(`/playlist-detail/edit/${id}`)
            }));
        }
    });

    useEffect(() => {
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
    }, []);

    useEffect(() => {
        if (typeof playlistRecordsFormik.values.records === 'undefined') return;

        let recordList = [...record.recordList];
        
        playlistRecordsFormik.values.records.forEach((recordItem: Record) => {
            let index = recordList.indexOf(recordItem);
            if (index > -1) recordList.splice(index, 1);
        });
        setRecords(recordList);

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
                        <RecordPlaylist data={playlistRecordsFormik.values} loading={playlistsRecords.loading} onItemRemoveClick={handleRemoveRecord} />
                    </div>
                    <div className={cx('record-container__action')}>
                        <Button outline type='button' onClick={() => navigate(`/playlist-detail/edit/${id}`)}>Hủy</Button>
                        <Button type='submit'>Lưu</Button>
                    </div>
                </form>
            </CommonPage>
            <Loading visible={playlistsRecords.loading} />
        </div>
    );
}