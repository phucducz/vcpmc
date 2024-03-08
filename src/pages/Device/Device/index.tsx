import { faLock, faPlus, faPowerOff } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames/bind";
import { useFormik } from "formik";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

import { Device } from "~/api/deviceAPI";
import { Button } from "~/components/Button";
import { CheckBox } from "~/components/CheckBox";
import { ComboBox, ComboData } from "~/components/ComboBox";
import { Form } from "~/components/Form";
import { Table } from "~/components/Table";
import { routes } from "~/config/routes";
import { useMenu } from "~/context/hooks";
import { Icon, trashIcon } from "~/icons";
import { CommonPage } from "~/pages/CommonPage";
import { RootState, useAppDispatch } from "~/store";
import { changeStatusDevice, deleteDevices, getDeviceList } from "~/thunk/deviceThunk";
import style from './Device.module.scss';
import Wrapper from "~/components/FilterBox/Wrapper";

const cx = classNames.bind(style);

function DeviceManagementPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { setActive, setType } = useMenu();

    const device = useSelector((state: RootState) => state.device);

    const [searchValue, setSearchValue] = useState<string>('');
    const [comboBoxData, setComboBoxData] = useState<Array<ComboData>>([] as Array<ComboData>);
    const [actionData, setActionData] = useState<Array<any>>([] as Array<any>);
    const [searchResult, setSearchResult] = useState<Array<Device>>([] as Array<Device>);
    const [currentItems, setCurrentItems] = useState<Array<Device>>([] as Array<Device>);
    const [itemsPerPage, setItemsPerPage] = useState<string>('8');
    const [itemsChosen, setItemsChosen] = useState<Array<Device>>([] as Array<Device>);
    const [checkedAll, setCheckedAll] = useState<boolean>(false);
    const [headerColumn, setHeaderColumn] = useState<string[]>([]);
    const [statusDevice, setStatusDevice] = useState<string>('');
    const [activeConfirmDialog, setActiveConfirmDialog] = useState<boolean>(false);

    const deviceFormik = useFormik({
        initialValues: {
            ids: [] as Array<Pick<Device, 'id'>>
        },
        onSubmit: () => {
            setActiveConfirmDialog(false);

            dispatch(deleteDevices(itemsChosen.map(itemChosen => ({ id: itemChosen.id }))));
        }
    })

    useEffect(() => {
        document.title = 'Quản lý thiết bị';
        setType('dynamic');

        setHeaderColumn(['STT', 'Tên thiết bị', 'Trạng thái', 'Địa điểm', 'Hạn hợp đồng', 'MAC Addresss', 'Memory']);

        !device.devices.length && dispatch(getDeviceList());
        setActive(true);
    }, []);

    useEffect(() => {
        setActionData([
            {
                icon: <FontAwesomeIcon icon={faPlus} />,
                title: 'Thêm thiết bị',
                onClick: () => { navigate(routes.AddDevice); setActive(true); },
                disable: false
            }, {
                icon: <FontAwesomeIcon icon={faPowerOff} />,
                title: 'Kích hoạt thiết bị',
                onClick: changeStatus,
                disable: false
            }, {
                icon: <FontAwesomeIcon icon={faLock} />,
                title: 'Khoá thiết bị',
                onClick: changeStatus,
                disable: false
            }, {
                icon: <Icon icon={trashIcon} />,
                title: 'Xoá thiết bị',
                onClick: () => { itemsChosen.length > 0 && setActiveConfirmDialog(true) },
                disable: false
            }
        ]);
    }, [itemsChosen]);

    const changeStatus = (item: string) => {
        setStatusDevice(item);
    }

    useEffect(() => {
        setActionData(prev => prev.map((item, index) => {
            if (index === 1) {
                let isHasItemsActive = itemsChosen.filter(itemChosen => itemChosen.status === 'activated').length > 0;
                let isHasItemsDeActive = itemsChosen.filter(itemChosen => itemChosen.status === 'deactivated').length > 0;
                let isHasItemsBlock = itemsChosen.filter(itemChosen => itemChosen.status === 'blocked').length > 0;

                if ((isHasItemsActive && isHasItemsDeActive) || (isHasItemsActive && isHasItemsBlock) || (isHasItemsDeActive && isHasItemsBlock))
                    return {
                        ...item,
                        title: 'Kích hoạt thiết bị',
                        disable: true
                    }
                else if (isHasItemsActive)
                    return {
                        ...item,
                        title: 'Ngừng kích hoạt thiết bị',
                        disable: false
                    }
                else if (isHasItemsDeActive)
                    return {
                        ...item,
                        title: 'Kích hoạt thiết bị',
                        disable: false
                    }
                else
                    return {
                        ...item,
                        title: 'Kích hoạt thiết bị',
                        disable: true
                    }
            }
            if (index === 2) {
                let isHasItemsBlock = itemsChosen.filter(itemChosen => itemChosen.status === 'blocked').length > 0;
                let isHasItemsActive = itemsChosen.filter(itemChosen => itemChosen.status === 'activated').length > 0;
                let isHasItemsDeActive = itemsChosen.filter(itemChosen => itemChosen.status === 'deactivated').length > 0;

                if ((isHasItemsActive && isHasItemsDeActive) || (isHasItemsActive && isHasItemsBlock) || (isHasItemsDeActive && isHasItemsBlock))
                    return {
                        ...item,
                        title: 'Khoá thiết bị',
                        disable: true
                    }
                else if (isHasItemsActive)
                    return {
                        ...item,
                        title: 'Khoá thiết bị',
                        disable: false
                    }
                else if (isHasItemsBlock)
                    return {
                        ...item,
                        title: 'Mở thiết bị',
                        disable: false
                    }
                else
                    return {
                        ...item,
                        title: 'Khoá thiết bị',
                        disable: true
                    }
            }
            else return item;
        }));
    }, [itemsChosen]);

    useEffect(() => {
        setSearchResult(device.devices);

        setComboBoxData([
            {
                id: 0,
                title: '',
                data: [{ title: 'Tất cả' }, ...device.devices.map((deviceItem, index) => {
                    if (device.devices.slice(0, index + 1).filter(item => deviceItem.unitsUsed === item.unitsUsed).length === 1)
                        return { title: deviceItem.unitsUsed }
                    return { title: '' }
                })].filter(item => item.title !== ''),
                visible: false,
                size: 'xl',
                activeData: 'Tất cả'
            }, {
                id: 1,
                title: '',
                data: [{ title: 'Tất cả' }, ...headerColumn.map(col => ({ title: col }))],
                visible: false,
                size: 'xl',
                activeData: 'Tất cả'
            }
        ]);
    }, [device.devices, headerColumn]);

    useEffect(() => {
        let value = searchValue.trim().toLowerCase();
        let result = device.devices;
        const groupAccount = comboBoxData.length && comboBoxData[0].activeData;
        
        if (value === '')
            setSearchResult(device.devices);

        if (groupAccount === 'Tất cả')
            result = result;
        else result = result.filter(item => item.unitsUsed === groupAccount);

        setSearchResult(result.filter(item =>
            item.SKUID.toLowerCase().includes(value) ||
            item.operatingLocation.toLowerCase().includes(value) ||
            item.macAddress.toLowerCase().includes(value) ||
            item.name.toLowerCase().includes(value)
        ));
    }, [searchValue, comboBoxData]);

    const handleComboBoxClick = useCallback((item: any) => {
        setComboBoxData(prev =>
            prev.map(data =>
                data.title === item.title ? { ...data, visible: !item.visible } : data
            )
        );
    }, []);

    const handleComboBoxItemClick = useCallback((item: ComboData, id: string) => {
        setComboBoxData(prev => prev.map(prevItem =>
            (prevItem.title === id)
                ? { ...prevItem, activeData: item.title }
                : prevItem
        ));
    }, []);

    const handleSetCurrentItems = useCallback((items: Array<any>) => {
        setCurrentItems(items);
    }, []);

    const handleChange = useCallback((value: string) => {
        setItemsPerPage(value);
    }, []);

    const handleItemCheck = (checked: boolean, item: Device) => {
        checked
            ? setItemsChosen(itemsChosen.filter(itemChosen => itemChosen.id !== item.id))
            : setItemsChosen([...itemsChosen, item]);
    }

    const handleCheckedAll = (checkedAll: boolean) => {
        checkedAll
            ? setItemsChosen([])
            : setItemsChosen(device.devices);

        setCheckedAll(!checkedAll);
    }

    useEffect(() => {
        handleChangeStatusDevice(statusDevice);
    }, [statusDevice]);

    const handleChangeStatusDevice = useCallback((status: string) => {
        let statusDevice = '';

        if (status === 'Ngừng kích hoạt thiết bị') statusDevice = 'deactivated';
        else if (status === 'Kích hoạt thiết bị') statusDevice = 'activated';
        else if (status === 'Khoá thiết bị') statusDevice = 'blocked';
        else statusDevice = 'activated';

        dispatch(changeStatusDevice({
            data: itemsChosen.map(item => ({
                id: item.id,
                status: statusDevice
            }))
        }));

        setItemsChosen([]);
    }, [itemsChosen]);

    const handleNavigate = (id: string) => {
        navigate(`/device-management/detail/${id}`);
        setActive(false);
    }

    return (
        <CommonPage
            className={cx('device-management-container')}
            title='Danh sách thiết bị'
            search={{
                placeHolder: 'Tìm thiết bị theo tên, SKU, địa điểm, địa chỉ Mac...',
                searchValue: searchValue,
                setSearchValue: (e: any) => setSearchValue(e.target.value)
            }}
            actionFilter={<Wrapper
                data={comboBoxData}
                onClick={handleComboBoxClick}
                onItemClick={handleComboBoxItemClick}
            />}
            actionData={actionData}
        >
            <Table
                paginate={{
                    dataForPaginate: searchResult,
                    setCurrentItems: handleSetCurrentItems
                }}
                loading={device.loading}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={handleChange}
                headerChildren={<th style={{ padding: '8px 0px 8px 8px' }}><CheckBox checked={checkedAll} onChange={() => handleCheckedAll(checkedAll)} /></th>}
                thead={headerColumn}
            >
                {currentItems.length > 0
                    && currentItems.map((item, index) => {
                        let status = '';
                        let checked = itemsChosen.indexOf(item) > -1;

                        if (item.status === 'activated')
                            status = 'Đang kích hoạt | Đang hoạt động';
                        else if (item.status === 'deactivated')
                            status = 'Ngừng kích hoạt';
                        else status = 'Đang bị khoá';

                        return (
                            <tr
                                key={item.id}
                                style={{ height: '47px', cursor: 'pointer' }}
                                className={cx('content')}
                                onClick={() => handleItemCheck(checked, item)}
                            >
                                <td><CheckBox checked={checked} onChange={() => handleItemCheck(checked, item)} /></td>
                                <td><p>{index + 1}</p></td>
                                <td><p>{item.name}</p></td>
                                <td><p className={cx(item.status)}>{status}</p></td>
                                <td><p>{item.operatingLocation}</p></td>
                                <td><p>{item.expirationDate}</p></td>
                                <td><p>{item.macAddress}</p></td>
                                <td><p>{item.memory}</p></td>
                                <td><p className={cx('action')} onClick={() => handleNavigate(item.id)}
                                >Chi tiết</p></td>
                            </tr>
                        );
                    })}
            </Table>
            <Form
                className={cx('form-remove-device')}
                visible={activeConfirmDialog}
                title='Xóa thiết bị'
                subTitle='Bạn có chắc chắn muốn xoá các thiết bị này? Hành động này không thể hoàn tác.'
                type='dialog'
                onSubmit={deviceFormik.handleSubmit}
            >
                <div className={cx('device-detail__edit__actions')}>
                    <Button small outline type="button" onClick={() => setActiveConfirmDialog(false)}>
                        Hủy
                    </Button>
                    <Button small type="submit">Xóa</Button>
                </div>
            </Form>
        </CommonPage>
    );
}

export default DeviceManagementPage;