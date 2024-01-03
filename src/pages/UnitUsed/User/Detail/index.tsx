import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";

import { User } from "~/api/userAPI";
import { BlockInfo } from "~/components/Block";
import { PagingItemType } from "~/components/Paging";
import { routes } from "~/config/routes";
import { CommonPage } from "~/pages/CommonPage";
import { RootState, useAppDispatch } from "~/store";
import { getUsers } from "~/thunk/userThunk";
import style from './Detail.module.scss';

const cx = classNames.bind(style);

type CurentUser = Pick<User, 'userName' | 'email' | 'password' | 'status'> & { fullName: string; role: string };

function UserOfUnitDetailPage() {
    const { userId, contractId } = useParams();

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const user = useSelector((state: RootState) => state.user);

    const [paging, setPaging] = useState<Array<PagingItemType>>([] as Array<PagingItemType>);
    const [currentUser, setCurrentUser] = useState<CurentUser>({
        userName: '',
        email: '',
        fullName: '',
        password: '',
        status: '',
        role: ''
    } as CurentUser);
    const [actionData, setActionData] = useState<any[]>([] as any[]);

    useEffect(() => {
        document.title = 'Chi tiết đơn vị sử dụng | Chi tiết người dùng';

        setPaging([
            {
                title: 'Quản lý',
                to: routes.Unit,
                active: true
            }, {
                title: 'Đơn vị sử dụng',
                to: routes.Unit,
                active: true
            }, {
                title: 'Chi tiết',
                to: `/unit/management/detail/${contractId}`,
                active: false
            }, {
                title: 'Thông tin người dùng',
                to: '#',
                active: true
            }
        ]);

        setActionData([
            {
                icon: <FontAwesomeIcon icon={faEdit} />,
                title: 'Chỉnh sửa',
                onClick: () => navigate(`/unit/management/detail/${contractId}/user-detail/${userId}/edit`)
            }
        ]);

        !user.users.length && dispatch(getUsers());
    }, []);

    useEffect(() => {
        const currentUser = user.users.find(user => user.id === userId);

        typeof currentUser !== 'undefined' && setCurrentUser({
            userName: currentUser.userName,
            email: currentUser.email,
            fullName: `${currentUser.firstName} ${currentUser.lastName}`,
            password: currentUser.password,
            status: currentUser.status,
            role: currentUser.role.name,
        });
    }, [user.users]);

    const USER_INFO_ITEMS = [
        {
            children: [
                {
                    title: 'Tên người dùng:',
                    content: currentUser.fullName
                }, {
                    title: 'Vai trò:',
                    content: currentUser.role
                }, {
                    title: 'Email:',
                    content: currentUser.email
                }
            ]
        },
        {
            children: [
                {
                    title: 'Tên đăng nhập:',
                    content: currentUser.userName
                }, {
                    title: 'Mật khẩu:',
                    content: currentUser.password
                }, {
                    title: 'Trạng thái thiết bị:',
                    content: currentUser.status === 'active' ? 'Đã kích hoạt' : 'Ngưng kích hoạt'
                }
            ]
        }
    ];

    return (
        <CommonPage
            pagingData={paging}
            title='Thông tin người dùng'
            actionData={actionData}
        >
            <div className={cx('form__body')}>
                <BlockInfo data={USER_INFO_ITEMS} />
            </div>
        </CommonPage>
    );
}

export default UserOfUnitDetailPage;