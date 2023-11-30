import classNames from "classnames/bind";
import { ChangeEvent, ReactNode, memo, useState, useEffect } from "react";
import ReactPaginate from "react-paginate";

import style from './Grid.module.scss';
import Input from "../Input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import Loading from "../Loading";

const cx = classNames.bind(style);

// type ItemProps = {
//     data: any;
// }

// const Item = memo(({ data }: ItemProps) => {
//     return (
//         <div className={cx('grid-container__item')}>
//             <div className={cx('item__image')}>
//                 <img src={logo} alt='record' />
//             </div>
//             <div className={cx('item__content')}>
//                 <div className={cx('item__content__right')}>
//                     <div>
//                         <p className={cx('content__right__title')}>{data.nameRecord}</p>
//                         <div className={cx('singer')}>
//                             <span className={cx('title')}>Ca sĩ:</span>
//                             <span className={cx('content')}>{data.singer}</span>
//                         </div>
//                         <div className={cx('author')}>
//                             <span className={cx('title')}>Sáng tác:</span>
//                             <span className={cx('content')}>{data.autho}</span>
//                         </div>
//                         <div className={cx('contract')}>
//                             <span className={cx('title')}>Số hợp đồng:</span>
//                             <span className={cx('content')}>{data.ISRCCode}</span>
//                         </div>
//                     </div>
//                     <div className={cx('content__right__box')}>
//                         <div className={cx('box__item')}>
//                             <p className={cx('box__item__title')}>Thể loại</p>
//                             <p className={cx('box__item__content')}>Pop</p>
//                         </div>
//                     </div>
//                 </div>
//                 <div className={cx('item__content__left')}>
//                     <FontAwesomeIcon icon={faEdit} className={cx('content__left__icon')} />
//                 </div>
//             </div>
//         </div>
//     );
// })

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
                    pageRangeDisplayed={3}
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