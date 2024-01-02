import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

import { PlaylistSchedule } from "~/api/playlistScheduleAPI";
import { Table } from "~/components/Table";
import { useMenu } from "~/context/hooks";
import { Icon, playlistAddIcon } from "~/icons";
import { CommonPage } from "~/pages/CommonPage";
import { RootState, useAppDispatch } from "~/store";
import { getScheduleList } from "~/thunk/playlistSchedule";
import style from './Schedule.module.scss';

const cx = classNames.bind(style);

function PlaylistSchedulePage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { setActive, setMenuActive } = useMenu();

    const playlistSchedule = useSelector((state: RootState) => state.playlistSchedule);

    const [actionData, setActionData] = useState<any[]>([] as any[]);
    const [currentItems, setCurrentItems] = useState<Array<any>>([]);
    const [itemsPerPage, setItemsPerPage] = useState<string>('8');

    useEffect(() => {
        setActionData([
            {
                icon: <Icon icon={playlistAddIcon} />,
                title: 'Thêm lịch phát',
                onClick: () => { navigate('/playlist-schedule/add'); setActive(false); }
            }
        ]);

        dispatch(getScheduleList());
        setMenuActive(3);
        setActive(true);
    }, []);

    const handleSetCurrentItems = (items: Array<any>) => {
        setCurrentItems(items);
    }

    const handleChange = (value: string) => {
        setItemsPerPage(value);
    }

    const handleNavigate = (id: string) => {
        navigate(`/playlist-schedule/detail/${id}`);
        setActive(false);
    }

    return (
        <div className={cx('schedule-playlist-container')}>
            <CommonPage
                title='Danh sách lịch phát'
                actionData={actionData}
            >
                <Table
                    paginate={{
                        dataForPaginate: playlistSchedule.listSchedule,
                        setCurrentItems: handleSetCurrentItems
                    }}
                    loading={playlistSchedule.loading}
                    itemsPerPage={itemsPerPage}
                    setItemsPerPage={handleChange}
                    thead={['STT', 'Tên lịch', 'Thời gian phát', '', '']}
                >
                    {currentItems.map((item: PlaylistSchedule, index) => (
                        <tr key={index} style={{ height: '47px' }} className={cx('content')}>
                            <td><p>{index + 1}</p></td>
                            <td><p>{item.name}</p></td>
                            <td><p>{item.playbackTime}</p></td>
                            <td><p className={cx('action')} onClick={() => handleNavigate(item.id)}>Xem chi tiết</p></td>
                            <td><p className={cx('action')} onClick={() => { }}>Xóa</p></td>
                        </tr>
                    ))}
                </Table>
            </CommonPage>
        </div>
    );
}

export default PlaylistSchedulePage;