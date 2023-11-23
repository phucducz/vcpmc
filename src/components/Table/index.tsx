import classNames from "classnames/bind";
import { ReactNode, memo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

import style from './Table.module.scss';
import Input from "../Input";

const cx = classNames.bind(style);

type TableProps = {
    children: ReactNode;
    loading: boolean
}

export const Table = memo(({ children, loading = false }: TableProps) => {
    return (
        <table className={cx('table-container')}>
            <thead>
                <tr>
                    <th><p>STT</p></th>
                    <th><p>Tên bản ghi</p></th>
                    <th><p>Mã ISRC</p></th>
                    <th><p>Thời lượng</p></th>
                    <th><p>Ca sĩ</p></th>
                    <th><p>Tác giả</p></th>
                    <th><p>Thể loại</p></th>
                    <th><p>Định dạng</p></th>
                    <th><p>Thời hạn sử dụng</p></th>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {children}
                <tr className={cx('table__option')}>
                    <td colSpan={11}>
                        <div className={cx('table__option__container')}>
                            <span>
                                <p>Hiển thị</p>
                                <Input tiny value={2} name='number' onChange={() => { }} />
                                <p>hàng trong mỗi trang</p>
                            </span>
                            <span className={cx('table__page-number')}>
                                <FontAwesomeIcon icon={faChevronLeft} />
                                <p>1</p>
                                <p>2</p>
                                <p>3</p>
                                <p>...</p>
                                <p>100</p>
                                <FontAwesomeIcon icon={faChevronRight} />
                            </span>
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