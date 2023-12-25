import { faPlus, faRemove } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames/bind";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";

import { EtmContractDetail } from "~/api/etmContractAPI";
import { User } from "~/api/userAPI";
import { CheckBox } from "~/components/CheckBox";
import { PagingItemType } from "~/components/Paging";
import { Table } from "~/components/Table";
import { routes } from "~/config/routes";
import { useMenu } from "~/context/hooks";
import { Icon } from "~/icons";
import usersIcon from "~/icons/users-icon";
import { CommonPage } from "~/pages/CommonPage";
import { RootState, useAppDispatch } from "~/store";
import { getUsers } from "~/thunk/userThunk";
import style from './Detail.module.scss';
import { deleteEmployees } from "~/thunk/etmContractThunk";
import { Toast } from "~/components/Toast";
import { setStatus } from "~/reducers/etmContract";

const cx = classNames.bind(style);

function UnitUsedDetailPage() {
    const { id } = useParams();

    const { setActive } = useMenu();

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const user = useSelector((state: RootState) => state.user);
    const etmContract = useSelector((state: RootState) => state.etmContract);

    const [searchValue, setSearchValue] = useState<string>('');
    const [actionData, setActionData] = useState<any[]>([] as any[]);
    const [searchResult, setSearchResult] = useState<Array<User>>([] as Array<User>);
    const [itemsPerPage, setItemsPerPage] = useState<string>('8');
    const [currentItems, setCurrentItems] = useState<Array<User>>([] as Array<User>);
    const [paging, setPaging] = useState<Array<PagingItemType>>([] as Array<PagingItemType>);
    const [contractDetail, setContractDetail] = useState<EtmContractDetail>({} as EtmContractDetail);
    const [itemsChosen, setItemsChosen] = useState<Array<User>>([] as Array<User>);
    const [toastVisible, setToastVisible] = useState<boolean>(false);

    useEffect(() => {
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
                to: '#',
                active: true
            }
        ]);

        user.users.length <= 0 && dispatch(getUsers());
    }, []);

    const handleDeleteEmployees = useCallback(() => {
        if (typeof contractDetail === 'undefined') return;
        if (typeof contractDetail.employeeIds === 'undefined') return;

        const employeeChosen = itemsChosen.map(itemChosen => itemChosen.id);
        const currentEmployees = contractDetail.employeeIds.filter((employeeId: string) => !employeeChosen.some(id => id === employeeId));

        dispatch(deleteEmployees({
            currentEmployees: currentEmployees,
            employeeIds: employeeChosen,
            id: contractDetail.id
        }));
    }, [itemsChosen, contractDetail]);

    useEffect(() => {
        setActionData([
            {
                icon: <FontAwesomeIcon icon={faPlus} />,
                title: 'Thêm người dùng',
                onClick: () => navigate(`/unit/management/detail/${id}/add-user`)
            }, {
                icon: <FontAwesomeIcon icon={faRemove} className={cx('remove-icon')} />,
                title: 'Xóa',
                onClick: () => handleDeleteEmployees(),
                disable: itemsChosen.length <= 0
            }, {
                icon: <Icon icon={usersIcon} />,
                title: 'Vai trò',
                onClick: () => { }
            }
        ]);
    }, [itemsChosen, contractDetail]);

    useEffect(() => {
        const currentContract = etmContract.etmContractsDetail.find(contract => contract.id === id);
        if (typeof currentContract === 'undefined') return;

        setContractDetail(currentContract);
    }, [etmContract.etmContractsDetail]);


    useEffect(() => {
        if (!user.users.length || Object.keys(contractDetail).length <= 0) return;

        setSearchResult(user.users.filter(user =>
            contractDetail.employeeIds && contractDetail.employeeIds.some((empolyeeId: string) => empolyeeId === user.id))
        );
    }, [user.users, contractDetail]);

    const handleSetCurrentItems = useCallback((items: Array<any>) => {
        setCurrentItems(items);
    }, []);

    const handleChange = useCallback((value: string) => {
        setItemsPerPage(value);
    }, []);

    const handleChosenItem = useCallback((checked: boolean, user: User) => {
        checked
            ? setItemsChosen(prev => prev.filter(item => item.id !== user.id))
            : setItemsChosen([...itemsChosen, user]);
    }, [itemsChosen]);

    const handleSuccessToast = () => {
        setToastVisible(false);
        dispatch(setStatus(''));
    }

    return (
        <>{Object.keys(contractDetail).length &&
            <CommonPage
                pagingData={paging}
                title={`Đơn vị sử dụng - ${contractDetail.name}`}
                search={{
                    placeHolder: 'Tên khoản giá trị, số hợp đồng,...',
                    searchValue: searchValue,
                    setSearchValue: (e: React.ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value)
                }}
                actionData={actionData}
                className={cx('unit-detail-container')}
            >
                <Table
                    thead={['STT', 'Tên người dùng', 'Vai trò', 'Email',
                        'Tên đăng nhập', 'Cập nhật lần cuối', 'Trạng thái', '']}
                    paginate={{
                        dataForPaginate: searchResult,
                        setCurrentItems: handleSetCurrentItems
                    }}
                    paginateClass={cx('table__row__paginate')}
                    loading={etmContract.loading}
                    itemsPerPage={itemsPerPage}
                    setItemsPerPage={handleChange}
                    headerChildren={<th className={cx('table__row__checkbox')}>
                        <CheckBox
                            checked={itemsChosen.length === contractDetail.employeeIds?.length}
                            onChange={() => {
                                let checkedAll = itemsChosen.length === contractDetail.employeeIds?.length;

                                checkedAll ? setItemsChosen([]) : setItemsChosen(user.users.filter(user =>
                                    contractDetail.employeeIds?.some(employee =>
                                        employee === user.id)
                                ));
                            }}
                        />
                    </th>}
                    className={cx('container-table-data')}
                >
                    {currentItems.map((item, index) => {
                        let checked = typeof itemsChosen.find(itemChosen => itemChosen.id === item.id) !== 'undefined';
                        let isActive = item.status?.toLowerCase() === 'active';

                        return (
                            <tr key={index} className={cx('table__row-item')} style={{ height: '47px', cursor: 'pointer' }} onClick={() => handleChosenItem(checked, item)}>
                                <td><CheckBox checked={checked} onChange={() => handleChosenItem(checked, item)} /></td>
                                <td><p>{index + 1}</p></td>
                                <td><p>{item.firstName} {item.lastName}</p></td>
                                <td><p>{item.role.name}</p></td>
                                <td><p>{item.email}</p></td>
                                <td><p>{item.userName}</p></td>
                                <td><p>{item.userName}</p></td>
                                <td><p className={cx(isActive ? 'active' : 'deactive')}>{isActive ? 'Đang hoạt động' : 'Ngưng hoạt động'}</p></td>
                                <td><p className={cx('action')} onClick={() => {
                                    navigate(`/unit/management/detail/${contractDetail.id}/user-detail/${item.id}`);
                                    setActive(false);
                                }}>Xem chi tiết</p></td>
                            </tr>
                        )
                    })}
                </Table>
                <Toast
                    message='Thêm người dùng thành công!'
                    visible={etmContract.status === 'add successfully'}
                    onSuccess={handleSuccessToast}
                    duration={800}
                />
            </CommonPage>
        }</>
    );
}

export default UnitUsedDetailPage;