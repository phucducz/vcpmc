import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames/bind";
import { useFormik } from "formik";
import { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from "react-router";

import moment from "moment";
import { useSelector } from "react-redux";
import { Record } from "~/api/recordAPI";
import { User } from "~/api/userAPI";
import { ActionDataType } from "~/components/Action";
import { Button } from "~/components/Button";
import Loading from "~/components/Loading";
import { PagingItemType } from "~/components/Paging";
import { Table } from "~/components/Table";
import { routes } from "~/config/routes";
import { getCurrentDate } from "~/context";
import { MenuContext } from "~/context/Menu/MenuContext";
import { setRecordsOfPlaylist } from "~/reducers/playlistsRecords";
import { RootState, useAppDispatch } from "~/store";
import { savePlaylistRecords } from "~/thunk/playlistsRecordsThunk";
import { CommonPlaylistPage, PlaylistValue } from "../CommonPage";
import style from './AddPlaylist.module.scss';

const cx = classNames.bind(style);

function AddPlaylistPage() {
    const dispath = useAppDispatch();
    const navigate = useNavigate();

    const { setActive } = useContext(MenuContext);

    const playlistsRecords = useSelector((state: RootState) => state.playlistsRecords);
    const user = useSelector((state: RootState) => state.user);

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
            createdBy: {} as Pick<User, 'id'>,
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
            if (values.records.length <= 0) return;

            const playlist = {
                title: values.title,
                categories: ['NyVjFmpolxH9UbyFOYAo', 'NcKduGPiNK2wN2WIM0Bz'],
                createdDate: getCurrentDate(),
                createdBy: user.currentUser.id,
                description: values.description,
                mode: values.mode,
                imageURL: values.imageURL === '' ? 'https://res.cloudinary.com/dvlzvsyxs/image/upload/v1701837054/image-playlist-default_wwfydk.jpg' : values.imageURL,
            }
            const playlistRecords = {
                recordsId: values.records.map(record => record.id)
            }

            dispath(savePlaylistRecords({
                playlist,
                playlistRecords,
                navigate: () => navigate(routes.PlaylistManagement)
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
                title: 'Thêm playlist mới',
                to: routes.AddPlaylist,
                active: false
            }
        ]);
        setActionData([
            {
                icon: <FontAwesomeIcon icon={faPlus} />,
                title: 'Thêm bản ghi',
                onClick: () => navigate(`/playlist-detail/${'new-playlist'}/add-record`)
            }
        ]);
        playlistFormik.setFieldValue('records', playlistsRecords.recordsOfPlaylist);
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

        playlistFormik.setValues({
            ...playlistFormik.values,
            records: recordsCurrent,
            totalTime: momentTime.toISOString().split('T')[1].slice(0, 8),
            quantity: recordsCurrent.length
        });
        dispath(setRecordsOfPlaylist(recordsCurrent));
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
                    itemsPerPage={itemsPerPage}
                    setItemsPerPage={handleChange}
                    thead={['STT', 'Tên bản ghi', 'Ca sĩ', 'Tác giả', '', '']}
                >
                    {currentItems.length > 0
                        ? currentItems.map((item: Record, index) => {
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
                        })
                        : <tr>
                            <td colSpan={6}>
                                <p style={{ textAlign: 'center', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                    <span>Vui lòng chọn bản ghi để thêm vào Playlist</span>
                                    <span style={{ color: 'var(--color-red)' }}>*</span>
                                </p>
                            </td>
                        </tr>
                    }
                </Table>
                <Button outline type='button' onClick={() => { navigate(routes.PlaylistManagement); setActive(true) }}>Hủy</Button>
                <Button type='submit'>Lưu</Button>
                <Loading visible={playlistsRecords.loading} />
            </CommonPlaylistPage>
        </div>
    );
}

export default AddPlaylistPage;