import classNames from "classnames/bind";
import { useState, useEffect, useContext } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

import style from './Schedule.module.scss';
import { CommonPage } from "~/pages/CommonPage";
import { Icon, playlistAddIcon } from "~/icons";
import { ActionDataType } from "~/components/Action";
import { Table } from "~/components/Table";
import { RootState, useAppDispatch } from "~/store";
import { getScheduleList } from "~/thunk/playlistSchedule";
import { PlaylistSchedule } from "~/api/playlistScheduleAPI";
import { MenuContext } from "~/context/Menu/MenuContext";

const cx = classNames.bind(style);

export const PlaylistSchedulePage = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { setActive, setMenuActive } = useContext(MenuContext);

    const playlistSchedule = useSelector((state: RootState) => state.playlistSchedule);

    const [actionData, setActionData] = useState<ActionDataType[]>([] as ActionDataType[]);
    const [currentItems, setCurrentItems] = useState<Array<any>>([]);
    const [itemsPerPage, setItemsPerPage] = useState<string>('8');

    useEffect(() => {
        setActionData([
            {
                icon: <Icon icon={playlistAddIcon} />,
                title: 'Thêm lịch phát',
                onClick: () => { }
            }
        ]);

        dispatch(getScheduleList());
        setMenuActive(3);
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