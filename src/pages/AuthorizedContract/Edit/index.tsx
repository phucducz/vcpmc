import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useFormik } from "formik";

import { UserInfo } from "~/api/userAPI";
import { BlockInput } from "~/components/Block";
import { Button } from "~/components/Button";
import { ComboBox } from "~/components/ComboBox";
import { Input } from "~/components/Input";
import Loading from "~/components/Loading";
import { PagingItemType } from "~/components/Paging";
import { RadioButton } from "~/components/RadioButton";
import { routes } from "~/config/routes";
import { Yup } from "~/constants";
import { CommonPage } from "~/pages/CommonPage";
import { RootState, useAppDispatch } from "~/store";
import { changePasswordStatusUser } from "~/thunk/userThunk";
import style from './Edit.module.scss';

const cx = classNames.bind(style);

function EditAuthorizedContract() {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const authorizedContract = useSelector((state: RootState) => state.authorized);
    const user = useSelector((state: RootState) => state.user);
    const role = useSelector((state: RootState) => state.role);

    const [paging, setPaging] = useState<Array<PagingItemType>>([] as Array<PagingItemType>);
    const [userInputs, setUserInputs] = useState<Array<any>>([] as Array<any>);
    const [types, setTypes] = useState<{ password: string, confirmPassword: string }>({
        password: 'password',
        confirmPassword: 'password'
    });

    const userFormik = useFormik({
        initialValues: {
            id: '',
            userName: '',
            email: '',
            phoneNumber: '',
            rolesId: '',
            firstName: '',
            lastName: '',
            fullName: '',
            confirmPassword: '',
            status: ''
        } as UserInfo & { status: string },
        validationSchema: Yup.object({
            userName: Yup.string().required(),
            email: Yup.string().required(),
            phoneNumber: Yup.string().required(),
            rolesId: Yup.string().required(),
            firstName: Yup.string().required(),
            lastName: Yup.string().required(),
            fullName: Yup.string().required(),
            password: Yup.string().required(),
            confirmPassword: Yup.string().required().oneOf([Yup.ref('password')], 'Mật khẩu không khớp')
        }),
        onSubmit: values => {
            const { password, status, id } = values;

            dispatch(changePasswordStatusUser({ id: id, password: password, status: status, navigate: () => navigate(routes.AuthorizedContract) }));
        }
    })

    useEffect(() => {
        setPaging([
            {
                title: 'Quản lý',
                to: routes.AuthorizedContract,
                active: true
            }, {
                title: 'Đối tác uỷ quyền',
                to: routes.AuthorizedContract,
                active: true
            }, {
                title: 'Cập nhật thông tin người dùng',
                to: `/authorized-contract-management/edit/${id}`,
                active: true
            }
        ]);
    }, []);

    useEffect(() => {
        if (authorizedContract.contracts.length <= 0) return;

        const authorizedContractCurrent = authorizedContract.contracts.find(contract => contract.id === id);
        const userInfo = authorizedContractCurrent?.authorizedPerson || {} as UserInfo;

        userFormik.setValues({
            ...userInfo,
            fullName: `${userInfo.firstName} ${userInfo.lastName}`,
            confirmPassword: ''
        });
    }, [authorizedContract.contracts]);

    useEffect(() => {
        document.title = 'Danh sách đối tác ủy quyền | Cập nhật thông tin';
    }, []);

    useEffect(() => {
        setUserInputs([
            {
                fieldName: 'Tên người dùng',
                input: <Input
                    isRequired
                    name='fullName'
                    errorMessage={userFormik.errors.fullName}
                    value={userFormik.values.fullName}
                    touched={userFormik.touched.fullName}
                    onChange={() => { }}
                    onFocus={() => userFormik.setFieldTouched('fullName', true)}
                    onBlur={() => userFormik.setFieldTouched('fullName', false)}
                />
            }, {
                fieldName: 'Email',
                input: <Input
                    isRequired
                    name='email'
                    errorMessage={userFormik.errors.email}
                    value={userFormik.values.email}
                    touched={userFormik.touched.email}
                    onChange={() => { }}
                    onFocus={() => userFormik.setFieldTouched('email', true)}
                    onBlur={() => userFormik.setFieldTouched('email', false)}
                />
            }, {
                fieldName: 'Số điện thoại',
                input: <Input
                    isRequired
                    style={{ width: '256px' }}
                    name='phoneNumber'
                    errorMessage={userFormik.errors.phoneNumber}
                    value={userFormik.values.phoneNumber}
                    touched={userFormik.touched.phoneNumber}
                    onChange={() => { }}
                    onFocus={() => userFormik.setFieldTouched('phoneNumber', true)}
                    onBlur={() => userFormik.setFieldTouched('phoneNumber', false)}
                />
            }, {
                fieldName: 'Vai trò',
                input: <ComboBox
                    data={role.roleList.map(role => ({
                        id: role.id,
                        title: role.name
                    }))}
                    active={role.roleList.find(role => role.id === userFormik.values.rolesId)?.name || 'qc'}
                    visible={false}
                    onClick={() => { }}
                    style={{ width: '256px' }}
                    className={cx('edit__form-container__left__combo-box')}
                />
            }, {
                fieldName: 'Tên đăng nhập',
                input: <Input
                    isRequired
                    name='userName'
                    errorMessage={userFormik.errors.userName}
                    value={userFormik.values.userName}
                    touched={userFormik.touched.userName}
                    onChange={() => { }}
                    onFocus={() => userFormik.setFieldTouched('userName', true)}
                    onBlur={() => userFormik.setFieldTouched('userName', false)}
                />
            }, {
                fieldName: 'Mật khẩu',
                input: <Input
                    isRequired
                    style={{ width: '373px' }}
                    type={types.password}
                    name='password'
                    errorMessage={userFormik.errors.password}
                    value={userFormik.values.password}
                    touched={userFormik.touched.password}
                    onChange={userFormik.handleChange}
                    onFocus={() => userFormik.setFieldTouched('password', true)}
                    onBlur={() => userFormik.setFieldTouched('password', false)}
                    rightIcon={<FontAwesomeIcon
                        icon={faEye}
                        onClick={() => setTypes({ ...types, password: types.password === 'password' ? 'text' : 'password' })}
                    />}
                />
            }, {
                fieldName: 'Nhập lại mật khẩu',
                input: <Input
                    isRequired
                    style={{ width: '373px' }}
                    type={types.confirmPassword}
                    name='confirmPassword'
                    errorMessage={userFormik.errors.confirmPassword}
                    value={userFormik.values.confirmPassword}
                    touched={userFormik.touched.confirmPassword}
                    onChange={userFormik.handleChange}
                    onFocus={() => userFormik.setFieldTouched('confirmPassword', true)}
                    onBlur={() => userFormik.setFieldTouched('confirmPassword', false)}
                    rightIcon={<FontAwesomeIcon
                        icon={faEye}
                        onClick={() => setTypes({ ...types, confirmPassword: types.confirmPassword === 'password' ? 'text' : 'password' })}
                    />}
                />
            }
        ]);
    }, [userFormik.values, types]);

    return (
        <div className={cx('authorized-contract-edit')}>
            <CommonPage
                pagingData={paging}
                title='Cập nhật thông tin'
            >
                <form className={cx('edit__form-container')} onSubmit={userFormik.handleSubmit}>
                    <div className={cx('edit__form-container__body')}>
                        <div className={cx('edit__form-container__left')}>
                            <BlockInput data={userInputs.slice(0, 4)} />
                        </div>
                        <div className={cx('edit__form-container__right')}>
                            <BlockInput data={userInputs.slice(4, 7)} />
                            <div>
                                <p>Trạng thái</p>
                                <div className={cx('form-group-checkbox')}>
                                    <RadioButton title='Đã kích hoạt' checked={userFormik.values.status === 'active'} onChange={() => userFormik.setFieldValue('status', userFormik.values.status === 'active' ? 'deactive' : 'active')} />
                                    <RadioButton title='Ngưng kích hoạt' checked={userFormik.values.status !== 'active'} onChange={() => userFormik.setFieldValue('status', userFormik.values.status === 'active' ? 'deactive' : 'active')} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={cx('edit__form-container__action')}>
                        <Button outline type='button' onClick={() => navigate(routes.AuthorizedContract)}>Hủy</Button>
                        <Button type='submit'>Lưu</Button>
                    </div>
                </form>
                <Loading visible={user.loading} />
            </CommonPage>
        </div>
    );
}

export default EditAuthorizedContract;