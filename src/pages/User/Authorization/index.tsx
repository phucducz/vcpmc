import classNames from "classnames/bind";
import { useCallback, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

import { Role } from "~/api/roleAPI";
import { User } from "~/api/userAPI";
import { ActionDataType } from "~/components/Action";
import { PagingItemType } from "~/components/Paging";
import { Switch } from "~/components/Switch";
import { TabItemProps } from "~/components/Tab";
import { Table } from "~/components/Table";
import { routes } from "~/config/routes";
import { MenuContext } from "~/context/Menu/MenuContext";
import { Icon } from "~/icons";
import userPlusIcon from "~/icons/user-plus-icon";
import usersIcon from "~/icons/users-icon";
import { CommonPage } from "~/pages/CommonPage";
import { RootState, useAppDispatch } from "~/store";
import { getFunctionalTypes, getFunctionals } from "~/thunk/functionalThunk";
import { deleteRole, getRoles } from "~/thunk/roleThunk";
import { getUsers } from "~/thunk/userThunk";
import style from './Authorization.module.scss';

const cx = classNames.bind(style);

function UserAuthorizationPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { setActive } = useContext(MenuContext);

    const user = useSelector((state: RootState) => state.user);
    const role = useSelector((state: RootState) => state.role);
    const functional = useSelector((state: RootState) => state.functional);

    const [paging, setPaging] = useState<Array<PagingItemType>>([] as Array<PagingItemType>);
    const [tab, setTab] = useState<TabItemProps[]>([] as Array<TabItemProps>);
    const [searchValue, setSearchValue] = useState<string>('');
    const [actionData, setActionData] = useState<ActionDataType[]>([] as ActionDataType[]);
    const [searchResult, setSearchResult] = useState<Array<User>>([] as Array<User>);
    const [currentItems, setCurrentItems] = useState<Array<User>>([] as Array<User>);
    const [searchRoleResult, setSearchRoleResult] = useState<Array<Role>>([] as Array<Role>);
    const [currentRoleItems, setCurrentRoleItems] = useState<Array<Role>>([] as Array<Role>);
    const [itemsPerPage, setItemsPerPage] = useState<string>('8');
    const [displayUserTable, setDisplayUserTable] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setPaging([
            {
                title: 'Cài đặt',
                to: '#',
                active: true
            }, {
                title: 'Phân quyền người dùng',
                to: '#',
                active: true
            }
        ]);

        setTab([
            {
                title: 'Danh sách người dùng',
                onClick: () => { setDisplayUserTable(true); setSearchValue(''); }
            }, {
                title: 'Vai trò người dùng',
                onClick: () => { setDisplayUserTable(false); setSearchValue(''); }
            }
        ]);

        dispatch(getUsers());
        dispatch(getRoles());
        dispatch(getFunctionalTypes())
        dispatch(getFunctionals());
    }, []);

    useEffect(() => {
        if (user.loading) setLoading(true);
        else if (role.loading) setLoading(true);
        else if (functional.loading) setLoading(true);
        else setLoading(false);
    }, [user.loading, role.loading, functional.loading]);

    useEffect(() => {
        displayUserTable
            ? setActionData([
                {
                    icon: <Icon icon={userPlusIcon} />,
                    title: 'Thêm người dùng',
                    onClick: () => navigate(routes.AddUser)
                }
            ])
            : setActionData([
                {
                    icon: <Icon icon={usersIcon} />,
                    title: 'Thêm vai trò',
                    onClick: () => navigate(routes.AddRole)
                }
            ]);
    }, [displayUserTable]);

    useEffect(() => {
        setSearchResult(user.users);
    }, [user.users]);

    useEffect(() => {
        setSearchRoleResult(role.roleList);
    }, [role.roleList]);

    useEffect(() => {
        let value = searchValue.trim().toLowerCase();

        if (displayUserTable) {
            if (value === '') {
                setSearchResult(user.users);
                return;
            }

            setSearchResult(user.users.filter(user =>
                user.userName.toLowerCase().includes(value) ||
                user.firstName.toLowerCase().includes(value) ||
                user.lastName.toLowerCase().includes(value)
            ));
        }
        else {
            if (value === '') {
                setSearchRoleResult(role.roleList);
                return;
            }

            setSearchRoleResult(role.roleList.filter(role => role.name.toLowerCase().includes(value)));
        }
    }, [searchValue]);

    const handleSetCurrentItems = useCallback((items: Array<any>) => {
        setCurrentItems(items);
    }, []);

    const handleSetCurrentRoleItems = useCallback((items: Array<any>) => {
        setCurrentRoleItems(items);
    }, []);

    const handleChange = useCallback((value: string) => {
        setItemsPerPage(value);
    }, []);

    return (
        <CommonPage
            title='Danh sách người dùng'
            pagingData={paging}
            tab={tab}
            actionData={actionData}
            search={{
                placeHolder: 'Nhập tên người dùng',
                searchValue: searchValue,
                setSearchValue: (e: any) => setSearchValue(e.target.value)
            }}
            className={cx('authorization-user-container')}
        >
            <Table
                paginate={{
                    dataForPaginate: searchResult,
                    setCurrentItems: handleSetCurrentItems
                }}
                paginateClass={cx('table__row__paginate')}
                className={cx('container-table-data', displayUserTable ? 'active' : 'disable')}
                loading={loading}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={handleChange}
                thead={['STT', 'Tên nhóm người dùng', 'Số lượng người dùng', 'Vai trò', 'Trạng thái', 'Email', 'Số điện thoại', 'Ngày hết hạn', '']}
            >
                {currentItems.map((item, index) => (
                    <tr key={index}>
                        <td><p>{index + 1}</p></td>
                        <td><p>{item.firstName} {item.lastName}</p></td>
                        <td><p>{item.userName}</p></td>
                        <td><p>{item.role.name}</p></td>
                        <td><Switch status={item.status === 'active'} title='Đang kích hoạt' /></td>
                        <td><p>{item.email}</p></td>
                        <td><p>{item.phoneNumber}</p></td>
                        <td><p>{item.expirationDate}</p></td>
                        <td><p
                            className={cx('action')}
                            onClick={() => { navigate(`/user-management/edit/${item.id}`); setActive(false); }}
                        >
                            Chỉnh sửa
                        </p></td>
                    </tr>
                ))}
            </Table>
            <Table
                paginate={{
                    dataForPaginate: searchRoleResult,
                    setCurrentItems: handleSetCurrentRoleItems
                }}
                paginateClass={cx('table__row__paginate')}
                className={cx('container-table-data', !displayUserTable ? 'active' : 'disable')}
                loading={loading}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={handleChange}
                thead={['STT', 'Tên nhóm người dùng', 'Số lượng người dùng', 'Vai trò', 'Mô tả', '', '']}
            >
                {currentRoleItems.map((item, index) => (
                    <tr key={index}>
                        <td><p>{index + 1}</p></td>
                        <td><p>{item.name}</p></td>
                        <td><p>{user.users.filter(user => user.rolesId === item.id).length}</p></td>
                        <td><p>{item.role}</p></td>
                        <td><p className={cx('table__col__description')}>{item.description}</p></td>
                        <td><p className={cx('action')} onClick={() => { navigate(`/user-role-edit/${item.id}`); setActive(false); }}>Cập nhật</p></td>
                        <td>{item.allowDelete
                            && <p className={cx('action')} onClick={() => dispatch(deleteRole(item.id))}>Xóa</p>
                        }</td>
                    </tr>
                ))}
            </Table>
        </CommonPage>
    );
}

export default UserAuthorizationPage;