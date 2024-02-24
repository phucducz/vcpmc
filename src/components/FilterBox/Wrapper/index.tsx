import classNames from "classnames/bind";

import { ComboBox, ComboData } from "~/components/ComboBox";
import { FilterBox } from "../Filter";
import style from './Wrapper.module.scss';

const cx = classNames.bind(style);

type WrapperProps = {
    data: Array<ComboData>;
    onItemClick: (category: any, ...passParams: any) => void;
    onClick: (item: any) => void;
}

const Wrapper = ({ data, onItemClick, onClick }: WrapperProps) => {
    return (
        <div className={cx('wrapper-filter')}>
            <FilterBox
                data={data}
                onItemClick={onItemClick}
                className={cx('filter-box')}
            />
            <div className={cx('filter-combobox')}>
                {data.map((item, index) => (
                    <ComboBox
                        key={index}
                        size={item.size}
                        title={item.title}
                        active={item.activeData}
                        visible={item.visible}
                        data={item.data}
                        className={cx('combo-data')}
                        onClick={() => onClick(item)}
                        onItemClick={onItemClick}
                    />
                ))}
            </div>
        </div>
    );
}

export default Wrapper;