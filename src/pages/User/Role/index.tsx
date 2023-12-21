import classNames from "classnames/bind";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

import { Role } from "~/api/roleAPI";
import { ActionDataType } from "~/components/Action";
import { PagingItemType } from "~/components/Paging";
import { TabItemProps } from "~/components/Tab";
import { Table } from "~/components/Table";
import { routes } from "~/config/routes";
import { Icon } from "~/icons";
import usersIcon from "~/icons/users-icon";
import { CommonPage } from "~/pages/CommonPage";
import { RootState, useAppDispatch } from "~/store";
import { getRoles } from "~/thunk/roleThunk";
import style from './Role.module.scss';

const cx = classNames.bind(style);

function UserRolePage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const role = useSelector((state: RootState) => state.role);

    const [paging, setPaging] = useState<Array<PagingItemType>>([] as Array<PagingItemType>);
    const [tab, setTab] = useState<TabItemProps[]>([] as Array<TabItemProps>);
    const [searchValue, setSearchValue] = useState<string>('');
    const [actionData, setActionData] = useState<any[]>([] as any[]);
    const [searchResult, setSearchResult] = useState<Array<Role>>([] as Array<Role>);
    const [currentItems, setCurrentItems] = useState<Array<Role>>([] as Array<Role>);
    const [itemsPerPage, setItemsPerPage] = useState<string>('8');

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
                onClick: () => navigate(routes.UserAuthorizationManagement)
            }, {
                title: 'Vai trò người dùng',
                onClick: () => navigate(routes.UserRoleManagemet)
            }
        ]);

        setActionData([
            {
                icon: <Icon icon={usersIcon} />,
                title: 'Thêm vai trò',
                onClick: () => navigate('')
            }
        ]);

        dispatch(getRoles());
    }, []);

    useEffect(() => {
        setSearchResult(role.roleList);
    }, [role.roleList]);

    const handleSetCurrentItems = useCallback((items: Array<any>) => {
        setCurrentItems(items);
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
            className={cx('user-role-container')}
        >
            <Table
                paginate={{
                    dataForPaginate: searchResult,
                    setCurrentItems: handleSetCurrentItems
                }}
                paginateClass={cx('table__row__paginate')}
                className={cx('container-table-data')}
                loading={role.loading}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={handleChange}
                thead={['STT', 'Tên nhóm người dùng', 'Số lượng người dùng', 'Vai trò', 'Mô tả', '', '']}
            >
                {currentItems.map((item, index) => (
                    <tr key={index}>
                        <td><p>{index + 1}</p></td>
                        <td><p>{item.name}</p></td>
                        <td><p>{1}</p></td>
                        <td><p>{item.role}</p></td>
                        <td><p className={cx('table__col__description')}>{item.description}</p></td>
                        <td><p className={cx('action')}>Cập nhật</p></td>
                        <td><p className={cx('action')}>Xóa</p></td>
                    </tr>
                ))}
            </Table>
        </CommonPage>
    );
}

export default UserRolePage;