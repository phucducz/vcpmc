import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames/bind";
import { ChangeEvent, ReactNode, memo, useEffect, useState } from "react";
import ReactPaginate from "react-paginate";

import { Input } from "../Input";
import style from './Table.module.scss';

const cx = classNames.bind(style);

type TableProps = {
    paginate?: {
        dataForPaginate: Array<any>;
        setCurrentItems(item: Array<any>): void
    }
    children: ReactNode;
    headerChildren?: ReactNode;
    loading?: boolean;
    itemsPerPage?: string;
    thead: Array<string>
    tableRef?: React.RefObject<HTMLTableElement>;
    setItemsPerPage?(number: string): void;
    paginateClass?: string;
    className?: string;
    border?: number;
    cellPadding?: string;
    cellSpacing?: string;
}

export const Table = memo(({ tableRef, paginate, paginateClass, headerChildren, children,
    thead, loading = false, itemsPerPage: per = '1', setItemsPerPage, className, border,
    cellPadding, cellSpacing }: TableProps
) => {
    const [itemOffset, setItemOffset] = useState(0);
    const [pageCount, setPageCount] = useState<number>(0);

    const itemsPerPage = parseInt(per);

    useEffect(() => {
        if (typeof paginate === 'undefined')
            return;

        const { dataForPaginate, setCurrentItems } = paginate;

        const endOffset = itemOffset + itemsPerPage;
        setCurrentItems && setCurrentItems(paginate.dataForPaginate.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(dataForPaginate.length / itemsPerPage));
    }, [itemOffset, per, paginate?.dataForPaginate]);

    useEffect(() => {
        if (typeof paginate === 'undefined')
            return;

        const { setCurrentItems } = paginate;

        setCurrentItems && setCurrentItems(paginate.dataForPaginate.slice(0, itemsPerPage));
    }, [itemsPerPage]);

    const handlePageClick = (event: { selected: number }) => {
        if (typeof paginate === 'undefined')
            return;

        const { dataForPaginate } = paginate;
        const newOffset = (event.selected * itemsPerPage) % dataForPaginate.length;

        setItemOffset(newOffset);
    };

    return (
        <div className={cx('table-responsive')}>
            <table
                className={cx('table-container', className)}
                ref={tableRef}
                border={border || 0}
                cellSpacing={cellSpacing}
                cellPadding={cellPadding}
            >
                <thead>
                    <tr>
                        {headerChildren && headerChildren}
                        {thead.map((th, index) => <th key={index}><p>{th}</p></th>)}
                    </tr>
                </thead>
                <tbody>
                    {children}
                    {typeof paginate !== 'undefined' ? <tr className={cx('table__option', paginateClass)}>
                        <td colSpan={11}>
                            <div className={cx('table__option__container')}>
                                <span>
                                    <p>Hiển thị</p>
                                    <Input
                                        tiny
                                        value={per}
                                        name='number'
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setItemsPerPage && setItemsPerPage(e.target.value)}
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
                        : <></>
                    }
                    <tr className={cx('table__loading__tr', loading && 'active')}><td>
                        <div className={cx('tr__loading-container')}>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </td></tr>
                </tbody>
            </table>
        </div>
    );
});