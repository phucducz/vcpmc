import classNames from "classnames/bind";
import { ChangeEvent, ReactNode, memo, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

import style from './Table.module.scss';
import Input from "../Input";

const cx = classNames.bind(style);

type TableProps = {
    children: ReactNode;
    headerChildren?: ReactNode;
    loading: boolean;
    showNumber: number;
    thead: Array<string>
    setShowNumber(number: number): void;
}

export const Table = memo(({ headerChildren, children, thead, loading = false, showNumber, setShowNumber }: TableProps) => {
    useEffect(() => {
        setShowNumber(showNumber);
    }, [showNumber]);

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
                                    value={showNumber}
                                    name='number'
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setShowNumber(parseInt(e.target.value))}
                                />
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