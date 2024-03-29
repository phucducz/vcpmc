import classNames from "classnames/bind";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";

import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Device } from "~/api/deviceAPI";
import { CheckBox } from "~/components/CheckBox";
import { PagingItemType } from "~/components/Paging";
import { Table } from "~/components/Table";
import { routes } from "~/config/routes";
import { CommonPage } from "~/pages/CommonPage";
import { ScheduleDeviceInitialStateType } from "~/reducers/scheduleDevice";
import { RootState, useAppDispatch } from "~/store";
import { getDeviceList } from "~/thunk/deviceThunk";
import { getScheduleDeviceList, saveScheduleDevice } from "~/thunk/scheduleDeviceThunk";
import style from './ApplySchedule.module.scss';

const cx = classNames.bind(style);

function AppySchedulePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const device = useSelector((state: RootState) => state.device);
    const scheduleDevice = useSelector((state: RootState) => state.scheduleDevice);
    const { devices } = device;

    const [paging, setPaging] = useState<Array<PagingItemType>>([] as Array<PagingItemType>);
    const [deviceList, setDeviceList] = useState<Array<Device>>([] as Array<Device>);
    const [checkedAll, setCheckedAll] = useState<boolean>(false);
    const [actionData, setActionData] = useState<any[]>([] as any[]);
    const [loading, setLoading] = useState<boolean>(false);
    const [itemsPerPage, setItemsPerPage] = useState<string>('8');
    const [currentItems, setCurrentItems] = useState<Array<any>>([]);
    
    const handleAppyDevice = useCallback((deviceList: Array<Device>, scheduleDevice: ScheduleDeviceInitialStateType) => {
        console.log(scheduleDevice);

        dispatch(saveScheduleDevice({
            data: {
                id: scheduleDevice.scheduleDevices.find(scheduleDeviceItem => scheduleDeviceItem.schedulesId === id)?.id || '',
                devicesIds: deviceList.map(device => device.id),
            },
            navigate: () => navigate(`/playlist-schedule/detail/edit/${id}`)
        }));
    }, []);

    useEffect(() => {
        document.title = 'Áp lịch phát cho thiết bị';

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
                to: `/playlist-schedule/detail/edit/${id}`,
                active: false
            }, {
                title: 'Áp lịch cho thiết bị',
                to: '#',
                active: false
            }
        ]);

        dispatch(getScheduleDeviceList());
    }, []);

    useEffect(() => {
        if (device.loading === true) setLoading(true);
        else if (scheduleDevice.loading === true) setLoading(true);
        else setLoading(false);
    }, [device.loading, scheduleDevice.loading]);

    useEffect(() => {
        setActionData([
            {
                icon: <FontAwesomeIcon icon={faCheck} />,
                title: 'Chọn',
                onClick: () => handleAppyDevice(deviceList, scheduleDevice)
            }, {
                icon: <FontAwesomeIcon icon={faXmark} />,
                title: 'Hủy',
                onClick: () => navigate(`/playlist-schedule/detail/${id}`)
            }
        ]);
    }, [deviceList, scheduleDevice])

    useEffect(() => {
        dispatch(getDeviceList());
    }, []);

    const handleCheckClick = (item: Device, checked: boolean) => {
        console.log(checked);

        checked === true
            ? setDeviceList(deviceList.filter(device => device.id !== item.id))
            : setDeviceList([...deviceList, item]);
    }

    useEffect(() => {
        checkedAll === true ? setDeviceList(devices) : setDeviceList([]);
    }, [checkedAll]);

    const handleSetCurrentItems = (items: Array<any>) => {
        setCurrentItems(items);
    }

    const handleChange = (value: string) => {
        if (value === '' || value === '0')
            return;
        setItemsPerPage(value);
    }

    return (
        <div className={cx('apply-schedule-container')}>
            <CommonPage
                pagingData={paging}
                title='Chọn thiết bị'
                actionData={actionData}
            >
                <Table
                    paginate={{
                        dataForPaginate: devices,
                        setCurrentItems: handleSetCurrentItems
                    }}
                    loading={loading}
                    itemsPerPage={itemsPerPage}
                    setItemsPerPage={handleChange}
                    headerChildren={<th className={cx('table-checkbox')}><CheckBox checked={checkedAll} onChange={() => setCheckedAll(!checkedAll)} /></th>}
                    thead={['STT', 'Tên thiết bị', 'MAC Address', 'SKU/ID', 'Đơn vị sử dụng', 'Tên đăng nhập', 'Địa điểm hoạt động']}
                >
                    {devices.length && devices.map((item, index) => {
                        let deviceItem = deviceList.find(device => device.id === item.id);
                        let checked = typeof deviceItem !== 'undefined' ? true : false;

                        return (
                            <tr key={index} style={{ height: '47px' }} className={cx('content')} onClick={() => handleCheckClick(item, checked)}>
                                <td><CheckBox checked={checked} onChange={() => handleCheckClick(item, checked)} /></td>
                                <td><p>{index + 1}</p></td>
                                <td><p>{item.name}</p></td>
                                <td><p>{item.macAddress}</p></td>
                                <td><p>{item.SKUID}</p></td>
                                <td><p>{item.unitsUsed}</p></td>
                                <td><p>{item.userName}</p></td>
                                <td><p>{item.operatingLocation}</p></td>
                            </tr>
                        )
                    })}
                </Table>
            </CommonPage>
        </div>
    );
}

export default AppySchedulePage;