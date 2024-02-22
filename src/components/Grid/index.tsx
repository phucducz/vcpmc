import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames/bind";
import { ChangeEvent, ReactNode, memo, useEffect, useState } from "react";
import ReactPaginate from "react-paginate";

import { Input } from "../Input";
import Loading from "../Loading";
import style from './Grid.module.scss';

const cx = classNames.bind(style);

type GridProps = {
    paginate: {
        dataForPaginate: Array<any>;
        setCurrentItems(item: Array<any>): void
    }
    children: ReactNode;
    headerChildren?: ReactNode;
    loading: boolean;
    itemsPerPage: string;
    setItemsPerPage(number: string): void;
    className?: string;
}

export const Grid = memo(({ paginate, loading, className, children, itemsPerPage: per, setItemsPerPage }: GridProps) => {
    const [itemOffset, setItemOffset] = useState(0);
    const [pageCount, setPageCount] = useState<number>(0);

    const itemsPerPage = parseInt(per);
    const { dataForPaginate, setCurrentItems } = paginate;

    useEffect(() => {
        const endOffset = itemOffset + itemsPerPage;
        setCurrentItems && setCurrentItems(paginate.dataForPaginate.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(dataForPaginate.length / itemsPerPage));
    }, [itemOffset, itemsPerPage, dataForPaginate]);

    const handlePageClick = (event: { selected: number }) => {
        const newOffset = (event.selected * itemsPerPage) % dataForPaginate.length;

        setItemOffset(newOffset);
    };

    useEffect(() => {
        const handleWindowResize = () => {
            if (window.matchMedia('(max-width: 1550px) and (min-width: 1105px)').matches)
                setItemsPerPage('6');
            else if (window.matchMedia('(max-width: 1105px) and (min-width: 765px)').matches)
                setItemsPerPage('4');
            else if (window.matchMedia('(max-width: 765px)').matches)
                setItemsPerPage('2');
            else setItemsPerPage('8');
        }
        handleWindowResize();
        window.addEventListener('resize', handleWindowResize);

        return () => window.removeEventListener('resize', handleWindowResize);
    }, []);
    
    return (
        <div className={cx('grid-container', className)}>
            <div className={cx('grid-container__content')}>{children}</div>
            <div className={cx('grid-container__option')}>
                <span>
                    <p>Hiển thị</p>
                    <Input
                        tiny
                        value={itemsPerPage}
                        name='number'
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setItemsPerPage(e.target.value)}
                    />
                    <p>hàng trong mỗi trang</p>
                </span>
                <ReactPaginate
                    breakLabel="..."
                    nextLabel={<FontAwesomeIcon icon={faChevronRight} />}
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={1}
                    pageCount={pageCount}
                    previousLabel={<FontAwesomeIcon icon={faChevronLeft} />}
                    renderOnZeroPageCount={null}
                    containerClassName="pagination"
                    pageLinkClassName="page-num"
                    previousClassName="page-num"
                    nextLinkClassName="page-num"
                    activeClassName="active"
                />
            </div>
            <Loading visible={loading || false} className={cx('grid-container__loading')} />
        </div>
    );
});