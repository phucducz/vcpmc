import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames/bind";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";

import { faCheckCircle, faEdit, faEye, faLock, faRefresh } from "@fortawesome/free-solid-svg-icons";
import { useFormik } from "formik";
import { Device } from "~/api/deviceAPI";
import { ActionDataType } from "~/components/Action";
import { Button } from "~/components/Button";
import { Form } from "~/components/Form";
import Image from "~/components/Image";
import { Input, InputProps } from "~/components/Input";
import { PagingItemType } from "~/components/Paging";
import { RadioButton } from "~/components/RadioButton";
import { routes } from "~/config/routes";
import { CommonPage } from "~/pages/CommonPage";
import { RootState, useAppDispatch } from "~/store";
import style from './Detail.module.scss';
import { Yup } from "~/constants";
import { changePasswordDevice, restoreMemory, updateDevice } from "~/thunk/deviceThunk";
import Loading from "~/components/Loading";
import { Toast } from "~/components/Toast";

const cx = classNames.bind(style);

type PasswordType = {
    currentPasswordType: 'password' | 'text';
    newPasswordType: 'password' | 'text';
    confirmPasswordType: 'password' | 'text';
}

function DeviceDetailPage() {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const device = useSelector((state: RootState) => state.device);

    const [paging, setPaging] = useState<Array<PagingItemType>>([] as Array<PagingItemType>);
    const [actionData, setActionData] = useState<any[]>([] as any[]);
    const [activeDialog, setActiveDialog] = useState<boolean>(false);
    const [activeDialogPassword, setActiveDialogPassword] = useState<boolean>(false);
    const [deviceInputs, setDeviceInputs] = useState<Array<InputProps>>([] as Array<InputProps>);
    const [devicePasswordInputs, setDevicePasswordInputs] = useState<Array<InputProps>>([] as Array<InputProps>);
    const [title, setTitle] = useState<string>('');
    const [types, setTypes] = useState<PasswordType>({} as PasswordType);
    const [currentAction, setCurrentAction] = useState<string>('');
    const [toastActive, setToastActive] = useState<boolean>(false);

    const deviceFormik = useFormik({
        initialValues: {
            id: '',
            SKUID: '',
            expirationDate: '',
            macAddress: '',
            memory: '',
            name: '',
            operatingLocation: '',
            status: '',
            unitsUsed: '',
            userName: '',
            imageURL: '',
            note: '',
            format: '',
            statusDevice: '',
            lastestVersion: [] as Array<string>,
            password: '',
        } as Device & {
            statusDevice: string
        },
        validationSchema: Yup.object({
            SKUID: Yup.string().required(),
            macAddress: Yup.string().required(),
            name: Yup.string().required(),
            operatingLocation: Yup.string().required(),
            userName: Yup.string().required()
        }),
        onSubmit: async (values) => {
            await dispatch(updateDevice({
                data: {
                    id: values.id,
                    SKUID: values.SKUID,
                    macAddress: values.macAddress,
                    name: values.name,
                    operatingLocation: values.operatingLocation,
                    userName: values.userName,
                    status: values.status
                },
                navigate: () => navigate(routes.DeviceManagement)
            }));

            handleActiveToast();
            deviceFormik.setErrors(deviceFormik.initialErrors);
            deviceFormik.setTouched(deviceFormik.initialTouched);
        }
    });

    const devicePasswordFormik = useFormik({
        initialValues: {
            id: '',
            password: '',
        } as Device & {
            confirmPassword: string,
            newPassword: string,
            currentPassword: string
        },
        validationSchema: Yup.object({
            confirmPassword: Yup.string().required().oneOf([Yup.ref('newPassword')], 'Mật khẩu không khớp'),
            newPassword: Yup.string().required(),
            currentPassword: Yup.string().required().oneOf([deviceFormik.values.password], 'Mật khẩu hiện tại không đúng'),
        }),
        onSubmit: async (values) => {
            await dispatch(changePasswordDevice({
                id: values.id,
                password: values.newPassword
            }));

            setActiveDialogPassword(false);

            handleActiveToast();
            deviceFormik.setErrors(deviceFormik.initialErrors);
            deviceFormik.setTouched(deviceFormik.initialTouched);
        }
    });

    useEffect(() => {
        setPaging([
            {
                title: 'Danh sách thiết bị',
                to: routes.DeviceManagement,
                active: true
            }, {
                title: 'Chi tiết thiết bị',
                to: `#`,
                active: false
            }
        ]);

        setTypes({
            currentPasswordType: 'password',
            newPasswordType: 'password',
            confirmPasswordType: 'password',
        })
    }, []);

    useEffect(() => {
        setActionData([
            {
                icon: <FontAwesomeIcon icon={faEdit} />,
                title: 'Chỉnh sửa',
                onClick: () => { setActiveDialog(true); setCurrentAction('Chỉnh sửa') },
                disable: deviceFormik.values.status === 'blocked'
            }, {
                icon: <FontAwesomeIcon icon={faLock} />,
                title: 'Khôi phục mật khẩu',
                onClick: () => { setActiveDialogPassword(true); setCurrentAction('Khôi phục mật khẩu') }
            }, {
                icon: <FontAwesomeIcon icon={faRefresh} />,
                title: 'Khôi phục bộ nhớ',
                onClick: () => dispatch(restoreMemory({ id: id || '', memory: `0.00GB/${deviceFormik.values.memory.split('/')[1]}` }))
            }
        ]);
    }, [deviceFormik.values.status]);

    useEffect(() => {
        const deviceDetail = device.devices.find(device => device.id === id) || {} as Device;
        let status: 'Hoạt động' | 'Bị khóa' | 'Ngừng hoạt động' = 'Hoạt động';

        if (deviceDetail.status === 'blocked') status = 'Bị khóa';
        else if (deviceDetail.status === 'activated') status = 'Hoạt động';
        else if (deviceDetail.status === 'deactivated') status = 'Ngừng hoạt động';

        deviceFormik.setValues({ ...deviceDetail, statusDevice: status });
        devicePasswordFormik.setFieldValue('id', deviceDetail.id);
        setTitle(deviceDetail.name);
    }, [device.devices]);

    useEffect(() => {
        setDeviceInputs([
            {
                fieldName: 'Tên thiết bị:',
                name: 'name',
                errorMessage: deviceFormik.errors.name,
                value: deviceFormik.values.name,
                touched: deviceFormik.touched.name,
                onChange: deviceFormik.handleChange,
                onFocus: () => deviceFormik.setFieldTouched('name', true),
                onBlur: () => deviceFormik.setFieldTouched('name', false),
            }, {
                fieldName: 'SKU/ID:',
                name: 'SKUID',
                errorMessage: deviceFormik.errors.SKUID,
                value: deviceFormik.values.SKUID,
                touched: deviceFormik.touched.SKUID,
                onChange: deviceFormik.handleChange,
                onFocus: () => deviceFormik.setFieldTouched('SKUID', true),
                onBlur: () => deviceFormik.setFieldTouched('SKUID', false),
            }, {
                fieldName: 'Địa chỉ Mac:',
                name: 'macAddress',
                errorMessage: deviceFormik.errors.macAddress,
                value: deviceFormik.values.macAddress,
                touched: deviceFormik.touched.macAddress,
                onChange: deviceFormik.handleChange,
                onFocus: () => deviceFormik.setFieldTouched('macAddress', true),
                onBlur: () => deviceFormik.setFieldTouched('macAddress', false),
            }, {
                fieldName: 'Tên đăng nhập:',
                name: 'userName',
                errorMessage: deviceFormik.errors.userName,
                value: deviceFormik.values.userName,
                touched: deviceFormik.touched.userName,
                onChange: deviceFormik.handleChange,
                onFocus: () => deviceFormik.setFieldTouched('userName', true),
                onBlur: () => deviceFormik.setFieldTouched('userName', false),
            }, {
                fieldName: 'Vị trí:',
                name: 'operatingLocation',
                errorMessage: deviceFormik.errors.operatingLocation,
                value: deviceFormik.values.operatingLocation,
                touched: deviceFormik.touched.operatingLocation,
                onChange: deviceFormik.handleChange,
                onFocus: () => deviceFormik.setFieldTouched('operatingLocation', true),
                onBlur: () => deviceFormik.setFieldTouched('operatingLocation', false),
            }
        ]);
    }, [deviceFormik.values, deviceFormik.errors, deviceFormik.touched]);

    useEffect(() => {
        setDevicePasswordInputs([
            {
                fieldName: 'Mật khẩu hiện tại:',
                name: 'currentPassword',
                rightIcon: <FontAwesomeIcon
                    icon={faEye}
                    onClick={() => setTypes({ ...types, currentPasswordType: types.currentPasswordType === 'password' ? 'text' : 'password' })}
                />,
                value: devicePasswordFormik.values.currentPassword,
                errorMessage: devicePasswordFormik.errors.currentPassword,
                touched: devicePasswordFormik.touched.currentPassword,
                type: types.currentPasswordType,
                onChange: devicePasswordFormik.handleChange,
                onFocus: () => devicePasswordFormik.setFieldTouched('currentPassword', true),
                onBlur: () => devicePasswordFormik.setFieldTouched('currentPassword', false),
            }, {
                fieldName: 'Mật khẩu mới:',
                name: 'newPassword',
                value: devicePasswordFormik.values.newPassword,
                rightIcon: <FontAwesomeIcon
                    icon={faEye}
                    onClick={() => setTypes({ ...types, newPasswordType: types.newPasswordType === 'password' ? 'text' : 'password' })}
                />,
                errorMessage: devicePasswordFormik.errors.newPassword,
                touched: devicePasswordFormik.touched.newPassword,
                type: types.newPasswordType,
                onChange: devicePasswordFormik.handleChange,
                onFocus: () => devicePasswordFormik.setFieldTouched('newPassword', true),
                onBlur: () => devicePasswordFormik.setFieldTouched('newPassword', false),
            }, {
                fieldName: 'Nhập lại mật khẩu mới:',
                name: 'confirmPassword',
                value: devicePasswordFormik.values.confirmPassword,
                rightIcon: <FontAwesomeIcon
                    icon={faEye}
                    onClick={() => setTypes({ ...types, confirmPasswordType: types.confirmPasswordType === 'password' ? 'text' : 'password' })}
                />,
                errorMessage: devicePasswordFormik.errors.confirmPassword,
                touched: devicePasswordFormik.touched.confirmPassword,
                type: types.confirmPasswordType,
                onChange: devicePasswordFormik.handleChange,
                onFocus: () => devicePasswordFormik.setFieldTouched('confirmPassword', true),
                onBlur: () => devicePasswordFormik.setFieldTouched('confirmPassword', false),
            }
        ]);
    }, [devicePasswordFormik.values, devicePasswordFormik.errors, devicePasswordFormik.touched, types, devicePasswordFormik.validateOnChange]);

    const handleChangeStatus = useCallback(() => {
        deviceFormik.setFieldValue('status', deviceFormik.values.status === 'activated' ? 'deactivated' : 'activated');
    }, [deviceFormik.values.status]);

    const handleActiveToast = () => {
        setToastActive(true);
        setTimeout(() => {
            setToastActive(false);
        }, 1000);
    }

    console.log(deviceFormik.values);

    return (
        <CommonPage
            title={`Thông tin thiết bị - ${title}`}
            actionData={actionData}
            pagingData={paging}
        >
            <div className={cx('device-detail-container')}>
                <div className={cx('device-detail__info-left')}>
                    <p className={cx('info-title')}>Thông tin thiết bị</p>
                    <Image src={deviceFormik.values.imageURL} alt='device-photo' width={340} height={160} />
                    <p className={cx('info-left__status', deviceFormik.values.status)}>{deviceFormik.values.statusDevice}</p>
                    <div className={cx('info-left__note')}>
                        <p>Ghi chú:</p>
                        <p>{deviceFormik.values.note}</p>
                    </div>
                </div>
                <div className={cx('device-detail__info-middle')}>
                    <p className={cx('info-title')}>{deviceFormik.values.name}</p>
                    <div className={cx('info-content')}>
                        <div className={cx('info-content__left')}>
                            <p>SKU/ID:</p>
                            <p>Địa chỉ Mac:</p>
                            <p>Tên đăng nhập:</p>
                            <p>Định dạng:</p>
                            <p>Vị trí:</p>
                            <p>Thời hạn bảo hành:</p>
                            <p>Trạng thái thiết bị:</p>
                        </div>
                        <div className={cx('content-right')}>
                            <p>{deviceFormik.values.SKUID}</p>
                            <p>{deviceFormik.values.macAddress}</p>
                            <p>{deviceFormik.values.userName}</p>
                            <p>{deviceFormik.values.format}</p>
                            <p>{deviceFormik.values.operatingLocation}</p>
                            <p>{deviceFormik.values.SKUID}</p>
                            <p>{deviceFormik.values.status}</p>
                        </div>
                    </div>
                </div>
                <div className={cx('device-detail__info-right')}>
                    <div className={cx('info-right__version')}>
                        <p className={cx('info-title')}>Thông tin phiên bản</p>
                        <div className={cx('version__content')}>
                            <div className={cx('version__content__left')}>
                                <p>Phiên bản cũ nhất:</p>
                            </div>
                            <div className={cx('content-right')}>
                                {deviceFormik.values.lastestVersion && deviceFormik.values.lastestVersion.map((version) => <p key={version}>{version}</p>)}
                            </div>
                        </div>
                    </div>
                    <div className={cx('info-right__memory')}>
                        <p className={cx('info-title')}>Dung lượng bộ nhớ</p>
                        <div className={cx('memory__content')}>
                            <div className={cx('memory__content__left')}>
                                <p>Dung lượng</p>
                                <p>Còn trống</p>
                            </div>
                            <div className={cx('content-right')}>
                                <p>{deviceFormik.values.memory !== '' && deviceFormik.values.memory.split('/')[1]}</p>
                                <p>{deviceFormik.values.memory !== '' && (parseFloat(deviceFormik.values.memory.split('/')[1]) - parseFloat(deviceFormik.values.memory.split('/')[0].split('.')[0]))}GB</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Form
                className={cx('device__form-edit__device')}
                visible={activeDialog}
                title='Chỉnh sửa thông tin thiết bị'
                type='dialog'
                onSubmit={deviceFormik.handleSubmit}
            >
                <div className={cx('device-detail__edit__inputs')}>
                    {deviceInputs.map((input, index) => <Input key={index} type='text' {...input} isRequired />)}
                    <div className={cx('device-detail__edit__inputs__status')}>
                        <p>Trạng thái thiết bị:</p>
                        <div className={cx('inputs__status__checkbox')}>
                            <RadioButton checked={deviceFormik.values.status === 'activated'} onChange={handleChangeStatus} title="Đã kích hoạt" />
                            <RadioButton checked={deviceFormik.values.status !== 'activated'} onChange={handleChangeStatus} title="Ngưng kích hoạt" />
                        </div>
                    </div>
                </div>
                <div className={cx('device-detail__edit__actions')}>
                    <Button
                        small
                        outline
                        type="button"
                        onClick={() => setActiveDialog(false)}
                    >
                        Hủy
                    </Button>
                    <Button small type="submit">Lưu</Button>
                </div>
            </Form>
            <Form
                className={cx('device__form-edit__password')}
                visible={activeDialogPassword}
                title='Chỉnh sửa mật khẩu thiết bị'
                type='dialog'
                onSubmit={devicePasswordFormik.handleSubmit}
            >
                <div className={cx('device-detail__edit__inputs')}>
                    {devicePasswordInputs.map((input, index) => <Input key={index} type='text' {...input} isRequired />)}
                </div>
                <div className={cx('device-detail__edit__actions')}>
                    <Button small outline type="button" onClick={() => setActiveDialogPassword(false)}>
                        Hủy
                    </Button>
                    <Button small type="submit">Lưu</Button>
                </div>
            </Form>
            <Loading visible={device.loading} />
            <Toast
                duration={800}
                visible={toastActive}
                type='success'
                message='Đổi mật khẩu thành công!'
                setVisible={setToastActive}
            />
        </CommonPage>
    );
}

export default DeviceDetailPage;