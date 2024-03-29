import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames/bind";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

import { Role } from "~/api/roleAPI";
import { User } from "~/api/userAPI";
import { Button } from "~/components/Button";
import { ComboBox } from "~/components/ComboBox";
import { Form } from "~/components/Form";
import { Input } from "~/components/Input";
import Loading from "~/components/Loading";
import { PagingItemType } from "~/components/Paging";
import { routes } from "~/config/routes";
import { Yup } from "~/constants";
import { formatDateDMYHPTS } from "~/context";
import { Icon } from "~/icons";
import keySkeletonAltIcon from "~/icons/key-skeleton-alt";
import userXIcon from "~/icons/user-x-icon";
import { CommonPage } from "~/pages/CommonPage";
import { RootState, useAppDispatch } from "~/store";
import { getRoles } from "~/thunk/roleThunk";
import { addUser, deleteUser } from "~/thunk/userThunk";
import style from '../EditUser/Edit.module.scss';
import { useWindowsResize } from "~/context/hooks";

const cx = classNames.bind(style);

function AddUserPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const user = useSelector((state: RootState) => state.user);
    const role = useSelector((state: RootState) => state.role);

    const [paging, setPaging] = useState<Array<PagingItemType>>([] as Array<PagingItemType>);
    const [actionData, setActionData] = useState<any[]>([] as any[]);
    const [visibleComboBox, setVisibleComboBox] = useState<boolean>(false);
    const [type, setType] = useState<string>('password');
    const [mobileMode, setMobileMode] = useState(false);

    const userFormik = useFormik({
        initialValues: {
            email: '',
            firstName: '',
            lastName: '',
            password: '',
            phoneNumber: '',
            rolesId: '',
            userName: '',
            status: '',
            fullName: '',
            role: {} as Pick<Role, 'id' | 'name'>,
            expirationDate: ''
        } as User & { fullName: string },
        validationSchema: Yup.object({
            email: Yup.string()
                .required("Không được để trống")
                .matches(/^\S+@\S+\.\S+$/, "Vui lòng nhập địa chỉ đúng định dạng"),
            password: Yup.string().required(),
            phoneNumber: Yup.string().required().matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g),
            rolesId: Yup.string().required(),
            userName: Yup.string().required(),
            fullName: Yup.string().required(),
            expirationDate: Yup.string().required()
        }),
        onSubmit: async values => {
            const fullNameArray = values.fullName.split(' ');

            const user = {
                avatar: '',
                bank: '',
                bankNumber: '',
                dateOfBirth: '',
                dateRange: '',
                email: values.email,
                gender: '',
                idNumber: '',
                issuedBy: '',
                nationality: '',
                password: values.password,
                phoneNumber: values.phoneNumber,
                residence: '',
                rolesId: values.rolesId,
                taxCode: '',
                userName: values.userName,
                companyName: '',
                status: 'active',
                firstName: fullNameArray[0],
                lastName: fullNameArray[fullNameArray.length - 1],
                expirationDate: formatDateDMYHPTS(values.expirationDate || 'yyyy/MM/dd'),
            };

            dispatch(addUser({ user: user, navigate: () => navigate(routes.UserAuthorizationManagement) }));
        }
    });

    useEffect(() => {
        document.title = 'Thêm mới người dùng';

        setPaging([
            {
                title: 'Cài đặt',
                to: routes.UserAuthorizationManagement,
                active: true
            }, {
                title: 'Phân quyền người dùng',
                to: routes.UserAuthorizationManagement,
                active: true
            }, {
                title: 'Phân quyền người dùng',
                to: '#',
                active: false
            }
        ]);

        role.roleList.length <= 0 && dispatch(getRoles);
    }, []);

    useEffect(() => {
        setActionData([
            {
                icon: <Icon icon={userXIcon} />,
                title: 'Xóa người dùng',
                onClick: () => dispatch(deleteUser({
                    id: userFormik.values.id,
                    navigate: () => navigate(routes.UserAuthorizationManagement)
                }))
            }, {
                icon: <Icon icon={keySkeletonAltIcon} />,
                title: 'Khôi phục mật khẩu',
                onClick: () => { }
            }
        ]);
    }, [userFormik.values]);

    useWindowsResize(() => {
        if (window.matchMedia('(max-width: 1140px)').matches) {
            setMobileMode(true);
            return
        }
        setMobileMode(false);
    });

    const INPUTS = [
        {
            fieldName: 'Tên người dùng:',
            type: 'text',
            name: 'fullName',
            errorMessage: userFormik.errors.fullName,
            value: userFormik.values.fullName,
            touched: userFormik.touched.fullName,
            onChange: userFormik.handleChange,
            onFocus: () => userFormik.setFieldTouched('fullName', true),
            onBlur: () => userFormik.setFieldTouched('fullName', false)
        }, {
            fieldName: 'Số điện thoại:',
            type: 'text',
            name: 'phoneNumber',
            errorMessage: userFormik.errors.phoneNumber,
            value: userFormik.values.phoneNumber,
            touched: userFormik.touched.phoneNumber,
            onChange: userFormik.handleChange,
            onFocus: () => userFormik.setFieldTouched('phoneNumber', true),
            onBlur: () => userFormik.setFieldTouched('phoneNumber', false)
        }, {
            fieldName: 'Ngày hết hạn:',
            type: 'date',
            name: 'expirationDate',
            errorMessage: userFormik.errors.expirationDate,
            value: userFormik.values.expirationDate || '',
            touched: userFormik.touched.expirationDate,
            onChange: userFormik.handleChange,
            onFocus: () => userFormik.setFieldTouched('expirationDate', true),
            onBlur: () => userFormik.setFieldTouched('expirationDate', false)
        }, {
            fieldName: 'Email:',
            type: 'text',
            name: 'email',
            errorMessage: userFormik.errors.email,
            value: userFormik.values.email,
            touched: userFormik.touched.email,
            onChange: userFormik.handleChange,
            onFocus: () => userFormik.setFieldTouched('email', true),
            onBlur: () => userFormik.setFieldTouched('email', false)
        }, {
            fieldName: 'Tên đăng nhập:',
            type: 'text',
            name: 'userName',
            errorMessage: userFormik.errors.userName,
            value: userFormik.values.userName,
            touched: userFormik.touched.userName,
            onChange: userFormik.handleChange,
            onFocus: () => userFormik.setFieldTouched('userName', true),
            onBlur: () => userFormik.setFieldTouched('userName', false)
        }, {
            fieldName: 'Mật khẩu:',
            type: type,
            name: 'password',
            errorMessage: userFormik.errors.password,
            value: userFormik.values.password,
            touched: userFormik.touched.password,
            onChange: userFormik.handleChange,
            rightIcon: <FontAwesomeIcon
                icon={faEye}
                onClick={() => setType(type === 'password' ? 'text' : 'password')}
            />,
            onFocus: () => userFormik.setFieldTouched('password', true),
            onBlur: () => userFormik.setFieldTouched('password', false)
        }
    ];

    const handleItemClick = (item: Role) => {
        let currentRole = role.roleList.find(role => role.id === item.id);

        if (typeof currentRole !== 'undefined')
            userFormik.setValues({
                ...userFormik.values,
                role: { id: currentRole.id, name: currentRole.name },
                rolesId: currentRole.id
            });
    }

    return (
        <CommonPage
            title='Chỉnh sửa thông tin người dùng'
            pagingData={paging}
            actionData={actionData}
            className={cx('user-edit-container')}
        >
            <Form
                visible={true}
                onSubmit={userFormik.handleSubmit}
                className={cx('user-edit-container__form')}
            >
                <div className={cx('form__body')}>
                    <div className={cx('form__left')}>
                        {mobileMode
                            ? INPUTS.slice(0, INPUTS.length).map(input => <Input key={input.fieldName} {...input} isRequired />)
                            : <>{INPUTS.slice(0, 3).map(input => <Input key={input.fieldName} {...input} isRequired />)}
                                <div className={cx('form__left__role')}>
                                    <p>Vai trò: <span>*</span></p>
                                    <ComboBox
                                        data={role.roleList.map(role => ({
                                            id: role.id,
                                            title: role.name
                                        }))}
                                        active={userFormik.values.role.name || 'Chọn vai trò'}
                                        visible={visibleComboBox}
                                        onClick={() => setVisibleComboBox(!visibleComboBox)}
                                        onItemClick={handleItemClick}
                                        className={cx('form__left__role__form-group')}
                                    />
                                </div></>
                        }
                    </div>
                    <div className={cx('form__right')}>
                        {!mobileMode && INPUTS.slice(3, 6).slice(0, 3).map(input => <Input key={input.fieldName} {...input} isRequired />)}
                    </div>
                </div>
                <div className={cx('form__footer')}>
                    <Button outline type='button' onClick={() => navigate(routes.UserAuthorizationManagement)}>Hủy</Button>
                    <Button type='submit'>Lưu</Button>
                </div>
            </Form>
            <Loading visible={user.loading} />
        </CommonPage>
    );
}

export default AddUserPage;