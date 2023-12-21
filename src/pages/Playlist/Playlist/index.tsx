import classNames from "classnames/bind";
import { ReactNode, memo, useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Icon, circleExclaminationIcon, listTabGridIcon, listTabListIcon, playlistAddIcon } from "~/icons";

import { Category } from "~/api/categoryAPI";
import { Playlist } from "~/api/playlistAPI";
import { PlaylistRecordDetail } from "~/api/playlistsRecords";
import { BoxItem } from "~/components/BoxItem";
import { Grid } from "~/components/Grid";
import { Table } from "~/components/Table";
import { routes } from "~/config/routes";
import { useMenu } from "~/context/hooks";
import { CommonPage } from "~/pages/CommonPage";
import { GridItemProps } from "~/pages/Record/Record";
import { getPlaylistsRecordsDetail, setPlaylistsRecordsDetail } from "~/reducers/playlistsRecords";
import { RootState, useAppDispatch } from "~/store";
import { getPlaylistList } from "~/thunk/playlistThunk";
import { getPlaylistsRecordsList } from "~/thunk/playlistsRecordsThunk";
import style from './PlaylistPage.module.scss';

const cx = classNames.bind(style);

type ActionDataType = {
    icon: ReactNode;
    title: string;
    onClick: () => void;
}

const CategoryBoxItem = memo(({ title }: { title?: string }) => {
    return (
        <div className={cx('category-box')}>
            {title && <p>{title}</p>}
        </div>
    );
});

const GridItem = memo(({ data, action, categories, onGridItemClick, quantity, totalTime }:
    Omit<GridItemProps, 'data' | 'boxItemData'> &
    { data: Omit<Playlist, 'id'> } &
    { categories: Array<Category> } &
    { quantity: number, totalTime: string }
) => {
    return (
        <div className={cx('grid-container__item')} onClick={onGridItemClick}>
            <div
                className={cx('item__image')}
                style={{
                    backgroundImage: `url(${data.imageURL})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center center'
                }}
            >
            </div>
            <div className={cx('item__content')}>
                <div className={cx('item__content__right')}>
                    <div className={cx('group-content')}>
                        <p className={cx('content__right__title')}>{data.title}</p>
                    </div>
                    <div className={cx('box__category')}>
                        {data.categories && data.categories.length > 0
                            && data.categories.map(id => <CategoryBoxItem key={id} title={categories.find(category => category.id === id)?.name} />)
                        }
                    </div>
                    <div className={cx('box__content')}>
                        <div>
                            <p className={cx('title')}>Người tạo:</p>
                            <p className={cx('content')}>{data.createdBy.firstName} {data.createdBy.lastName}</p>
                        </div>
                        <div>
                            <p className={cx('title')}>Ngày tạo:</p>
                            <p className={cx('content')}>{data.createdDate}</p>
                        </div>
                    </div>
                    <div className={cx('box__content-more')}>
                        <BoxItem data={{ title: 'Số bản ghi', content: quantity.toString() }} />
                        <BoxItem data={{ title: 'Thời lượng', content: totalTime }} />
                    </div>
                </div>
                <div className={cx('item__content__left')}>
                    {action && action}
                </div>
            </div>
        </div>
    );
});

function PlaylistPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { setMenuActive, setActive, active } = useMenu();

    const playlist = useSelector((state: RootState) => state.playlist);
    const playlistsRecords = useSelector((state: RootState) => state.playlistsRecords);
    const record = useSelector((state: RootState) => state.record);
    const category = useSelector((state: RootState) => state.category);

    const [searchValue, setSearchValue] = useState<string>('');
    const [typeLoad, setTypeLoad] = useState<'table' | 'grid'>('table');
    const [actionData, setActionData] = useState<any[]>([] as any[]);
    const [searchResult, setSearchResult] = useState<Array<PlaylistRecordDetail>>([] as Array<PlaylistRecordDetail>);
    const [currentItems, setCurrentItems] = useState<Array<PlaylistRecordDetail>>([] as Array<PlaylistRecordDetail>);
    const [itemsPerPage, setItemsPerPage] = useState<string>('8');
    const [playlistRecords, setPlaylistRecords] = useState<Array<PlaylistRecordDetail>>([] as Array<PlaylistRecordDetail>);

    useEffect(() => {
        setActionData([
            {
                icon: <Icon icon={playlistAddIcon} />,
                title: 'Thêm Playlist',
                onClick: () => { navigate(routes.AddPlaylist); setActive(false); }
            }
        ]);
        setMenuActive(2);
        setActive(true);

        dispatch(getPlaylistsRecordsList());
        dispatch(getPlaylistList());
    }, []);

    useEffect(() => {
        if (playlist.playlist.length <= 0) return;

        dispatch(getPlaylistsRecordsDetail({ playlist, playlistsRecords, record }));
    }, [playlist.playlist, playlistsRecords.playlistsRecords]);

    useEffect(() => {
        setPlaylistRecords(playlistsRecords.playlistsRecordsDetail);
        setSearchResult(playlistsRecords.playlistsRecordsDetail);
    }, [playlistsRecords.playlistsRecordsDetail]);

    useEffect(() => {
        if (playlistRecords.length < 0) return;

        dispatch(setPlaylistsRecordsDetail(playlistRecords));
    }, [playlistRecords]);

    const handleSetCurrentItems = useCallback((items: Array<any>) => {
        setCurrentItems(items);
    }, []);

    const handleChange = useCallback((value: string) => {
        setItemsPerPage(value);
    }, []);

    useEffect(() => {
        let value = searchValue.trim().toLowerCase();

        if (value === '') {
            setSearchResult(playlistRecords);
            return;
        }

        setSearchResult(playlistRecords.filter(playlist =>
            playlist.playlist.title.toLowerCase().includes(value) ||
            playlist.playlist.createdBy.firstName.toLowerCase().includes(value) ||
            playlist.playlist.createdBy.lastName.toLowerCase().includes(value)
        ));
    }, [searchValue]);

    return (
        <CommonPage
            title='Playlist'
            search={{
                placeHolder: 'Tên bản ghi, ca sĩ,...',
                searchValue: searchValue,
                setSearchValue: (e: any) => setSearchValue(e.target.value)
            }}
            actionType={
                <div className={cx('action__type-load', typeLoad === 'table' ? 'table-visible' : 'grid-visible')}>
                    <Icon icon={listTabListIcon} onClick={() => setTypeLoad('table')} />
                    <Icon icon={listTabGridIcon} onClick={() => setTypeLoad('grid')} />
                </div>
            }
            actionData={actionData}
            className={cx('common-page-container')}
        >
            <div className={cx('container-table-data')}>
                {typeLoad !== 'grid'
                    ? <Table
                        paginate={{
                            dataForPaginate: searchResult,
                            setCurrentItems: handleSetCurrentItems
                        }}
                        loading={playlist.loading}
                        itemsPerPage={itemsPerPage}
                        setItemsPerPage={handleChange}
                        thead={['STT', 'Tiêu đề', 'Số bản ghi', 'Thời lượng', 'Chủ đề', 'Ngày tạo', 'Người tạo', '']}
                    >
                        {currentItems.length > 0
                            && currentItems.map((item: PlaylistRecordDetail, index) => {
                                return (
                                    <tr key={index} style={{ height: '47px' }} className={cx('content')}>
                                        <td><p>{index + 1}</p></td>
                                        <td><p>{item.playlist.title}</p></td>
                                        <td><p>{item.quantity}</p></td>
                                        <td><p>{item.totalTime}</p></td>
                                        <td className={cx('td__category')}>
                                            {item.playlist.categories && item.playlist.categories.length > 0
                                                && item.playlist.categories.map(id =>
                                                    <CategoryBoxItem key={id} title={category.categoryList.find(category => category.id === id)?.name} />
                                                )}
                                        </td>
                                        <td><p>{item.playlist.createdDate}</p></td>
                                        <td>{item.playlist.createdBy && <p>{item.playlist.createdBy.firstName} {item.playlist.createdBy.lastName}</p>}</td>
                                        <td><p className={cx('action')} onClick={() => navigate(`/playlist-detail/${item.playlistRecordId}`)}>Chi tiết</p></td>
                                    </tr>
                                );
                            })}
                    </Table>
                    : <Grid
                        paginate={{
                            dataForPaginate: searchResult,
                            setCurrentItems: handleSetCurrentItems
                        }}
                        loading={record.loading}
                        itemsPerPage={itemsPerPage}
                        setItemsPerPage={handleChange}
                    >
                        {currentItems.map((item, index) => {
                            if (index > parseInt(itemsPerPage) - 1) return null;

                            return <GridItem
                                key={item.playlistRecordId}
                                data={item.playlist}
                                categories={category.categoryList}
                                action={<Icon icon={circleExclaminationIcon} style={{ color: 'var(--color-orange)' }} onClick={() => navigate(`/playlist-detail/${item.playlistRecordId}`)} />}
                                onGridItemClick={() => { }}
                                quantity={item.quantity}
                                totalTime={item.totalTime}
                            />
                        })}
                    </Grid>}
            </div>
        </CommonPage>
    );
}

export default PlaylistPage;