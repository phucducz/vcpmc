import classNames from "classnames/bind";
import { ChangeEvent, ReactNode, memo, useEffect } from "react";

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
    className?: string;
    children: ReactNode;
    showNumber: number;
    setShowNumber(number: number): void;
    loading?: boolean;
}

export const Grid = memo(({ loading, className, children, showNumber, setShowNumber }: GridProps) => {
    useEffect(() => {
        setShowNumber(showNumber);
    }, [showNumber]);

    return (
        <div className={cx('grid-container', className)}>
            <div className={cx('grid-container__content')}>{children}</div>
            <div className={cx('grid-container__option')}>
                <span>
                    <p>Hiển thị</p>
                    <Input
                        tiny
                        value={showNumber}
                        name='number'
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setShowNumber(parseInt(e.target.value))}
                    />
                    <p>hàng trong mỗi trang</p>
                </span>
                <span className={cx('gird__page-number')}>
                    <FontAwesomeIcon icon={faChevronLeft} />
                    <p>1</p>
                    <p>2</p>
                    <p>3</p>
                    <p>...</p>
                    <p>100</p>
                    <FontAwesomeIcon icon={faChevronRight} />
                </span>
            </div>
            {/* <Loading visible={true} className={cx('grid-container__loading')}/> */}
            <Loading visible={loading || false} className={cx('grid-container__loading')} />
        </div>
    );
});