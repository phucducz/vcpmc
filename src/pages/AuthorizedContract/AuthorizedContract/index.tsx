import classNames from "classnames/bind";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

import { AuthorizedContractDetail } from "~/api/authorizedContract";
import { PagingItemType } from "~/components/Paging";
import { Switch } from "~/components/Switch";
import { Table } from "~/components/Table";
import { getCurrentDate } from "~/context";
import { CommonPage } from "~/pages/CommonPage";
import { RootState, useAppDispatch } from "~/store";
import { getAuthorizedContracts } from "~/thunk/authorizedContractThunk";
import style from './AuthorizedContract.module.scss';

const cx = classNames.bind(style);

function AuthorizedContract() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const authorizedContract = useSelector((state: RootState) => state.authorized);

    const [paging, setPaging] = useState<Array<PagingItemType>>([] as Array<PagingItemType>);
    const [searchValue, setSearchValue] = useState<string>('');
    const [searchResult, setSearchResult] = useState<Array<AuthorizedContractDetail>>([] as Array<AuthorizedContractDetail>);
    const [currentItems, setCurrentItems] = useState<Array<AuthorizedContractDetail>>([] as Array<AuthorizedContractDetail>);
    const [itemsPerPage, setItemsPerPage] = useState<string>('8');

    useEffect(() => {
        document.title = 'Danh sách đối tác ủy quyền';

        setPaging([
            {
                title: 'Quản lý',
                to: '#',
                active: true
            }, {
                title: 'Đối tác uỷ quyền',
                to: '#',
                active: true
            }
        ]);

        dispatch(getAuthorizedContracts());
    }, []);

    useEffect(() => {
        setSearchResult(authorizedContract.contracts);
    }, [authorizedContract.contracts]);

    const handleSetCurrentItems = useCallback((items: Array<any>) => {
        setCurrentItems(items);
    }, []);

    const handleChange = useCallback((value: string) => {
        setItemsPerPage(value);
    }, []);

    return <div className={cx('authorized-contract-container')}>
        <CommonPage
            pagingData={paging}
            title='Danh sách đối tác ủy quyền'
            search={{
                placeHolder: 'Họ tên, tên đăng nhập, email...',
                searchValue: searchValue,
                setSearchValue: (e: React.ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value)
            }}
        >
            <Table
                paginate={{
                    dataForPaginate: searchResult,
                    setCurrentItems: handleSetCurrentItems
                }}
                paginateClass={cx('table__row__paginate')}
                loading={authorizedContract.loading}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={handleChange}
                thead={['STT', 'Họ tên', 'Tên đăng nhập', 'Email', 'Ngày hết hạn', 'Số điện thoại', 'Trạng thái', '']}
                className={cx('authorized__table')}
            >
                {currentItems.map((item, index) => {
                    let isExpirationDate = item.expirationDate > getCurrentDate();

                    return (
                        <tr style={{ height: '47px' }}>
                            <td><p>{index + 1}</p></td>
                            <td><p>{item.authorizedPerson.firstName} {item.authorizedPerson.lastName}</p></td>
                            <td><p>{item.authorizedPerson.userName}</p></td>
                            <td><p>{item.authorizedPerson.email}</p></td>
                            <td><p>{item.expirationDate}</p></td>
                            <td><p>{item.authorizedPerson.phoneNumber}</p></td>
                            <td><p>{<Switch
                                title={isExpirationDate ? 'Đang kích hoạt' : 'Ngừng kích hoạt'}
                                status={isExpirationDate}
                                onClick={() => { }} />
                            }</p></td>
                            <td><p className={cx('action')} onClick={() => navigate(`/authorized-contract-management/edit/${item.id}`)}>Cập nhật</p></td>
                        </tr>
                    )
                })}
            </Table>
        </CommonPage>
    </div>
}

export default AuthorizedContract;