import classNames from "classnames/bind";
import { useEffect, useState, useCallback } from 'react';
import { useFormik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";

import style from './AddPlaylist.module.scss';
import { CommonPlaylistPage, PlaylistValue } from "../CommonPage";
import { Record } from "~/api/recordAPI";
import { User } from "~/api/userAPI";
import { PagingItemType } from "~/components/Paging";
import { routes } from "~/config/routes";
import { ActionDataType } from "~/components/Action";
import { Table } from "~/components/Table";
import { useSelector } from "react-redux";
import { RootState } from "~/store";
import moment from "moment";

const cx = classNames.bind(style);

export const AddPlaylistPage = () => {
    const navigate = useNavigate();

    const playlistsRecords = useSelector((state: RootState) => state.playlistsRecords);

    const [paging, setPaging] = useState<Array<PagingItemType>>([] as Array<PagingItemType>);
    const [actionData, setActionData] = useState<ActionDataType[]>([] as ActionDataType[]);
    const [audioLink, setAudioLink] = useState<string>('');
    const [audioActive, setAudioActive] = useState<boolean>(false);
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
            
        }
    });

    useEffect(() => {
        setPaging([
            {
                title: 'Playlist',
                to: routes.PlaylistManagement,
                active: true
            }, {
                title: 'Thêm playlist mới',
                to: routes.AddPlaylist,
                active: false
            }
        ]);
        setActionData([
            {
                icon: <FontAwesomeIcon icon={faPlus} />,
                title: 'Thêm bản ghi',
                onClick: () => navigate('#')
            }
        ]);
    }, []);

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
        <div className={cx('playlist-container')}>
            <CommonPlaylistPage
                titlePage='Thêm Playlist'
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
            </CommonPlaylistPage>
        </div>
    );
}