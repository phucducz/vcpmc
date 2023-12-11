import classNames from "classnames/bind";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { PagingItemType } from "~/components/Paging";
import { Table } from "~/components/Table";
import { CommonPage } from "~/pages/CommonPage";
import style from './AuthorizedContract.module.scss';
import { RootState, useAppDispatch } from "~/store";
import { getAuthorizedContracts } from "~/thunk/authorizedContractThunk";
import { AuthorizedContractDetailt } from "~/api/authorizedContract";
import { Switch } from "~/components/Switch";

const cx = classNames.bind(style);

function AuthorizedContract() {
    const dispatch = useAppDispatch();

    const authorizedContract = useSelector((state: RootState) => state.authorized);

    console.log(authorizedContract);

    const [paging, setPaging] = useState<Array<PagingItemType>>([] as Array<PagingItemType>);
    const [searchValue, setSearchValue] = useState<string>('');
    const [searchResult, setSearchResult] = useState<Array<AuthorizedContractDetailt>>([] as Array<AuthorizedContractDetailt>);
    const [currentItems, setCurrentItems] = useState<Array<AuthorizedContractDetailt>>([] as Array<AuthorizedContractDetailt>);
    const [itemsPerPage, setItemsPerPage] = useState<string>('8');

    useEffect(() => {
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
                loading={false}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={handleChange}
                thead={['STT', 'Họ tên', 'Tên đăng nhập', 'Email', 'Ngày hết hạn', 'Số điện thoại', 'Trạng thái', '']}
            >
                {currentItems.map((item, index) => {

                    return (
                        <tr>
                            <td><p>{index + 1}</p></td>
                            <td><p>{item.authorizedPerson.firstName} {item.authorizedPerson.lastName}</p></td>
                            <td><p>{item.authorizedPerson.userName}</p></td>
                            <td><p>{item.authorizedPerson.email}</p></td>
                            <td><p>{item.expirationDate}</p></td>
                            <td><p>{item.authorizedPerson.phoneNumber}</p></td>
                            <td><p>{<Switch
                                title={item.authorizedPerson.status === 'active' ? 'Đang kích hoạt' : 'Ngừng kích hoạt'}
                                status={item.authorizedPerson.status === 'active'}
                                onClick={() => { }} />
                            }</p></td>
                            <td><p className={cx('action')}>Cập nhật</p></td>
                        </tr>
                    )
                })}
            </Table>
        </CommonPage>
    </div>
}

export default AuthorizedContract;