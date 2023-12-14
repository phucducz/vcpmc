import classNames from "classnames/bind";
import { useFormik } from "formik";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

import { Device } from "~/api/deviceAPI";
import { BlockInput } from "~/components/Block";
import { Button } from "~/components/Button";
import { Input } from "~/components/Input";
import Loading from "~/components/Loading";
import { PagingItemType } from "~/components/Paging";
import { Upload } from "~/components/Upload";
import { routes } from "~/config/routes";
import { Yup } from "~/constants";
import { CommonPage } from "~/pages/CommonPage";
import { RootState, useAppDispatch } from "~/store";
import style from './Add.module.scss';
import { addDevice } from "~/thunk/deviceThunk";
import image from '~/images/Frame 534.png';

const cx = classNames.bind(style);

function AddDevicePage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const device = useSelector((state: RootState) => state.device);

    const [paging, setPaging] = useState<Array<PagingItemType>>([] as Array<PagingItemType>);
    const [deviceInfoInputs, setDeviceInfoInputs] = useState<Array<any>>([] as Array<any>);
    const [deviceMoreInfoInputs, setDeviceMoreInfoInputs] = useState<Array<any>>([] as Array<any>);
    const [deviceAccountInputs, setDeviceAccountInputs] = useState<Array<any>>([] as Array<any>);

    const deviceFormik = useFormik({
        initialValues: {
            id: '',
            SKUID: '',
            expirationDate: '',
            macAddress: '',
            memory: '',
            name: '',
            operatingLocation: '',
            status: 'activated',
            unitsUsed: '',
            userName: '',
            imageURL: 'https://res.cloudinary.com/dvlzvsyxs/image/upload/v1702394038/hq720_h481ry.webp',
            note: '',
            format: '',
            lastestVersion: [] as Array<string>,
            password: '',
            confirmPassword: '',
        } as Device & {
            confirmPassword: string,
        },
        validationSchema: Yup.object({
            SKUID: Yup.string().required(),
            expirationDate: Yup.string().required(),
            macAddress: Yup.string().required(),
            memory: Yup.string().required(),
            name: Yup.string().required(),
            operatingLocation: Yup.string().required(),
            unitsUsed: Yup.string().required(),
            userName: Yup.string().required(),
            format: Yup.string().required(),
            password: Yup.string().required(),
            confirmPassword: Yup.string().required().oneOf([Yup.ref('password')], 'Mật khẩu không khớp'),
        }),
        onSubmit: values => {
            const { SKUID, expirationDate, macAddress, memory, name, operatingLocation,
                status, unitsUsed, userName, imageURL, note, format, password } = values;

            dispatch(addDevice({
                data: {
                    SKUID, expirationDate, macAddress, memory, name, operatingLocation,
                    status, unitsUsed, userName, imageURL, note, format, password
                },
                navigate: () => navigate(routes.DeviceManagement)
            }));
        }
    });

    useEffect(() => {
        setPaging([
            {
                title: 'Danh sách thiết bị',
                to: routes.DeviceManagement,
                active: true
            }, {
                title: 'Thêm mới thiết bị',
                to: `#`,
                active: true
            }
        ]);

        setDeviceInfoInputs([
            {
                fieldName: 'Tên thiết bị:',
                input: <Input
                    name='name'
                    errorMessage={deviceFormik.errors.name}
                    value={deviceFormik.values.name}
                    touched={deviceFormik.touched.name}
                    onChange={deviceFormik.handleChange}
                    onFocus={() => deviceFormik.setFieldTouched('name', true)}
                    onBlur={() => deviceFormik.setFieldTouched('name', false)}
                />
            }, {
                fieldName: 'SKU/ID:',
                input: <Input
                    name={'SKUID'}
                    errorMessage={deviceFormik.errors.SKUID}
                    value={deviceFormik.values.SKUID}
                    touched={deviceFormik.touched.SKUID}
                    onChange={deviceFormik.handleChange}
                    onFocus={() => deviceFormik.setFieldTouched('SKUID', true)}
                    onBlur={() => deviceFormik.setFieldTouched('SKUID', false)}
                />
            }, {
                fieldName: 'Địa chỉ Mac:',
                input: <Input
                    name={'macAddress'}
                    errorMessage={deviceFormik.errors.macAddress}
                    value={deviceFormik.values.macAddress}
                    touched={deviceFormik.touched.macAddress}
                    onChange={deviceFormik.handleChange}
                    onFocus={() => deviceFormik.setFieldTouched('macAddress', true)}
                    onBlur={() => deviceFormik.setFieldTouched('macAddress', false)}
                />
            }, {
                fieldName: 'Vị trí:',
                input: <Input
                    name={'operatingLocation'}
                    errorMessage={deviceFormik.errors.operatingLocation}
                    value={deviceFormik.values.operatingLocation}
                    touched={deviceFormik.touched.operatingLocation}
                    onChange={deviceFormik.handleChange}
                    onFocus={() => deviceFormik.setFieldTouched('operatingLocation', true)}
                    onBlur={() => deviceFormik.setFieldTouched('operatingLocation', false)}
                />
            }, {
                fieldName: 'Ngày hết hạn:',
                input: <Input
                    type='date'
                    name={'expirationDate'}
                    errorMessage={deviceFormik.errors.expirationDate}
                    value={deviceFormik.values.expirationDate}
                    touched={deviceFormik.touched.expirationDate}
                    onChange={deviceFormik.handleChange}
                    onFocus={() => deviceFormik.setFieldTouched('expirationDate', true)}
                    onBlur={() => deviceFormik.setFieldTouched('expirationDate', false)}
                />
            }, {
                fieldName: 'Bộ nhớ',
                input: <Input
                    name={'memory'}
                    errorMessage={deviceFormik.errors.memory}
                    value={deviceFormik.values.memory}
                    touched={deviceFormik.touched.memory}
                    onChange={deviceFormik.handleChange}
                    onFocus={() => deviceFormik.setFieldTouched('memory', true)}
                    onBlur={() => deviceFormik.setFieldTouched('memory', false)}
                />
            }, {
                fieldName: 'Đơn vị sử dụng:',
                input: <Input
                    name={'unitsUsed'}
                    errorMessage={deviceFormik.errors.unitsUsed}
                    value={deviceFormik.values.unitsUsed}
                    touched={deviceFormik.touched.unitsUsed}
                    onChange={deviceFormik.handleChange}
                    onFocus={() => deviceFormik.setFieldTouched('unitsUsed', true)}
                    onBlur={() => deviceFormik.setFieldTouched('unitsUsed', false)}
                />
            }
        ]);

        setDeviceAccountInputs([
            {
                fieldName: 'Tên đăng nhập:',
                input: <Input
                    name={'userName'}
                    errorMessage={deviceFormik.errors.userName}
                    value={deviceFormik.values.userName}
                    touched={deviceFormik.touched.userName}
                    onChange={deviceFormik.handleChange}
                    onFocus={() => deviceFormik.setFieldTouched('userName', true)}
                    onBlur={() => deviceFormik.setFieldTouched('userName', false)}
                />
            }, {
                fieldName: 'Mật khẩu:',
                input: <Input
                    name={'password'}
                    errorMessage={deviceFormik.errors.password}
                    value={deviceFormik.values.password}
                    touched={deviceFormik.touched.password}
                    onChange={deviceFormik.handleChange}
                    onFocus={() => deviceFormik.setFieldTouched('password', true)}
                    onBlur={() => deviceFormik.setFieldTouched('password', false)}
                />
            }, {
                fieldName: 'Nhập lại mật khẩu:',
                input: <Input
                    name={'confirmPassword'}
                    errorMessage={deviceFormik.errors.confirmPassword}
                    value={deviceFormik.values.confirmPassword}
                    touched={deviceFormik.touched.confirmPassword}
                    onChange={deviceFormik.handleChange}
                    onFocus={() => deviceFormik.setFieldTouched('confirmPassword', true)}
                    onBlur={() => deviceFormik.setFieldTouched('confirmPassword', false)}
                />
            }
        ]);

        setDeviceMoreInfoInputs([
            {
                fieldName: 'Định dạng',
                input: <Input
                    name={'format'}
                    errorMessage={deviceFormik.errors.format}
                    value={deviceFormik.values.format}
                    touched={deviceFormik.touched.format}
                    onChange={deviceFormik.handleChange}
                    onFocus={() => deviceFormik.setFieldTouched('format', true)}
                    onBlur={() => deviceFormik.setFieldTouched('format', false)}
                />
            }, {
                fieldName: 'Ghi chú:',
                input: <Input
                    as='textarea'
                    rows={5}
                    cols={5}
                    name={'note'}
                    errorMessage={deviceFormik.errors.note}
                    value={deviceFormik.values.note}
                    touched={deviceFormik.touched.note}
                    onChange={deviceFormik.handleChange}
                    onFocus={() => deviceFormik.setFieldTouched('note', true)}
                    onBlur={() => deviceFormik.setFieldTouched('note', false)}
                    style={{ resize: 'none' }}
                />
            }
        ]);
    }, [deviceFormik.values, deviceFormik.isValidating]);

    return (
        <CommonPage
            className={cx('device-add-container')}
            title="Thêm thiết bị mới"
            pagingData={paging}
        >
            <form onSubmit={deviceFormik.handleSubmit}>
                <div className={cx('form__device-inputs')}>
                    <BlockInput data={deviceInfoInputs} />
                    <div className={cx('device-inputs__information')}>
                        <div className={cx('image')}>
                            <p>Hình ảnh:</p>
                            <Upload />
                        </div>
                        <BlockInput data={deviceMoreInfoInputs} />
                    </div>
                    <BlockInput data={deviceAccountInputs} />
                </div>
                <div className={cx('form__actions')}>
                    <Button small outline type="button" onClick={() => navigate(routes.DeviceManagement)}>
                        Hủy
                    </Button>
                    <Button small type="submit">Lưu</Button>
                </div>
            </form>
            <Loading visible={device.loading} />
        </CommonPage>
    );
}

export default AddDevicePage;