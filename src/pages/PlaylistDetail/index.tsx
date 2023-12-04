import classNames from "classnames/bind";
import { useCallback, useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";

import style from './PlaylistDetail.module.scss';
import { CommonPage } from "../CommonPage";
import Loading from "~/components/Loading";
import { Table } from "~/components/Table";
import { ActionDataType } from "~/components/Action";
import { RootState } from "~/store";
import { PlaylistRecordDetail } from "~/api/playlistsRecords";
import { Record } from "~/api/recordAPI";
import { AudioDialog } from "~/components/AudioDialog";
import { Icon, trashIcon } from "~/icons";
import Image from "~/components/Image";
import { MenuContext } from "~/context/Menu/MenuContext";

const cx = classNames.bind(style);

export const PlaylistDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const { setActive, setType } = useContext(MenuContext);

    const playlistsRecords = useSelector((state: RootState) => state.playlistsRecords);
    const category = useSelector((state: RootState) => state.category);

    const [audioLink, setAudioLink] = useState<string>('');
    const [audioActive, setAudioActive] = useState<boolean>(false);
    const [actionData, setActionData] = useState<ActionDataType[]>([] as ActionDataType[]);
    const [playlistDetail, setPlaylistDetail] = useState<PlaylistRecordDetail>({} as PlaylistRecordDetail);
    const [currentItems, setCurrentItems] = useState<Array<Record>>([] as Array<Record>);
    const [itemsPerPage, setItemsPerPage] = useState<string>('8');

    useEffect(() => {
        setActive(false);
        setType('dynamic');

        setActionData([
            {
                icon: <FontAwesomeIcon icon={faEdit} />,
                title: 'Chỉnh sửa',
                onClick: () => navigate('#')
            }, {
                icon: <Icon icon={trashIcon} />,
                title: 'Xóa Playlist',
                onClick: () => navigate('#')
            }
        ]);

        let playlistRecordDetail = playlistsRecords.playlistsRecordsDetail.find(playlist => playlist.playlistId === id);

        if (typeof playlistRecordDetail !== 'undefined')
            setPlaylistDetail(playlistRecordDetail);
    }, []);

    const handleSetCurrentItems = useCallback((items: Array<any>) => {
        setCurrentItems(items);
    }, []);

    const handleChange = useCallback((value: string) => {
        setItemsPerPage(value);
    }, []);

    const handleListenAudioClick = useCallback((item: Record) => {
        setAudioLink(item.audioLink);
        setAudioActive(true);
    }, []);

    return (
        <>{playlistDetail.playlist && <CommonPage
            title={`Playlist ${playlistDetail.playlist.title}`}
            actionData={actionData}
            className={cx('common-page-container')}
        >
            <div className={cx('playlist-detail-container')}>
                <div className={cx('container__playlist-info')}>
                    <div className={cx('info__header')}>
                        <Image src={playlistDetail.playlist.imageURL} alt='playlist image' width={274} height={274} />
                        <p>{playlistDetail.playlist.title}</p>
                    </div>
                    <div className={cx('info__content')}>
                        <div className={cx('item__left')}>
                            <p>Người tạo:</p>
                            <p>Tổng số:</p>
                            <p>Tổng thời lượng:</p>
                        </div>
                        <div className={cx('item__right')}>
                            <p>{playlistDetail.playlist.createdBy.role.role || 'Admin'}</p>
                            <p>{playlistDetail.quantity} bản ghi</p>
                            <p>{playlistDetail.totalTime}</p>
                        </div>
                    </div>
                    <div className={cx('info__description')}>
                        <p>{playlistDetail.playlist.description}</p>
                    </div>
                    <div className={cx('info__category')}>
                        {playlistDetail.playlist.categories.map(id =>
                            <div className={cx('info__category__item')}>
                                <span></span>
                                <span>{category.categoryList.find(category => category.id === id)?.name}</span>
                            </div>
                        )}
                    </div>
                </div>
                <div className={cx('container-table-data', 'table-data')}>
                    <Table
                        paginate={{
                            dataForPaginate: playlistDetail.records,
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
                                        <td><p className={cx('action')} onClick={() => { }}>Gỡ</p></td>
                                    </tr>
                                );
                            })}
                    </Table>
                </div>
            </div>
            <AudioDialog src={audioLink} visible={audioActive} setVisible={setAudioActive} />
            <Loading visible={playlistsRecords.loading} />
        </CommonPage>}</>
    );
}