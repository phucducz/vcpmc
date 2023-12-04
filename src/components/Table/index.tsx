import classNames from "classnames/bind";
import { ChangeEvent, ReactNode, memo, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import ReactPaginate from "react-paginate";

import style from './Table.module.scss';
import Input from "../Input";

const cx = classNames.bind(style);

type TableProps = {
    paginate: {
        dataForPaginate: Array<any>;
        setCurrentItems(item: Array<any>): void
    }
    children: ReactNode;
    headerChildren?: ReactNode;
    loading: boolean;
    itemsPerPage: string;
    thead: Array<string>
    setItemsPerPage(number: string): void;
}

export const Table = memo(({ paginate, headerChildren, children, thead, loading = false, itemsPerPage: per, setItemsPerPage }: TableProps) => {
    const [itemOffset, setItemOffset] = useState(0);
    const [pageCount, setPageCount] = useState<number>(0);

    const itemsPerPage = parseInt(per);
    const { dataForPaginate, setCurrentItems } = paginate;

    useEffect(() => {
        if (typeof dataForPaginate === 'undefined')
            return;

        const endOffset = itemOffset + itemsPerPage;
        setCurrentItems && setCurrentItems(paginate.dataForPaginate.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(dataForPaginate.length / itemsPerPage));
    }, [itemOffset, per, dataForPaginate]);

    const handlePageClick = (event: { selected: number }) => {
        const newOffset = (event.selected * itemsPerPage) % dataForPaginate.length;

        setItemOffset(newOffset);
    };

    return (
        <table className={cx('table-container')}>
            <thead>
                <tr>
                    {headerChildren && headerChildren}
                    {thead.map((th, index) => <th key={index}><p>{th}</p></th>)}
                </tr>
            </thead>
            <tbody>
                {children}
                <tr className={cx('table__option')}>
                    <td colSpan={11}>
                        <div className={cx('table__option__container')}>
                            <span>
                                <p>Hiển thị</p>
                                <Input
                                    tiny
                                    value={per}
                                    name='number'
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setItemsPerPage(e.target.value)}
                                />
                                <p>hàng trong mỗi trang</p>
                            </span>
                            <ReactPaginate
                                breakLabel="..."
                                nextLabel={<FontAwesomeIcon icon={faChevronRight} />}
                                onPageChange={handlePageClick}
                                pageRangeDisplayed={3}
                                pageCount={pageCount}
                                previousLabel={<FontAwesomeIcon icon={faChevronLeft} />}
                                renderOnZeroPageCount={null}
                                containerClassName={cx("pagination")}
                                pageLinkClassName={cx("page-num")}
                                previousClassName={cx("page-num")}
                                nextLinkClassName={cx("page-num")}
                                activeClassName="active"
                            />
                        </div>
                    </td>
                </tr>
                <tr className={cx('table__loading__tr', loading && 'active')}><td>
                    <div className={cx('tr__loading-container')}>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </td></tr>
            </tbody>
        </table>
    );
});