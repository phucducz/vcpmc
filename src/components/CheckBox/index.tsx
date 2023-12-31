import classNames from "classnames/bind";

import style from './CheckBox.module.scss';

const cx = classNames.bind(style);

type CheckBoxProps = {
    title?: string,
    checked: boolean,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
}

export const CheckBox = ({
    title,
    checked,
    onChange,
    className,
    ...passProps
}: CheckBoxProps) => {
    return (
        <div className={cx('form-group', className)}>
            <input
                type="checkbox"
                id={title}
                value={title}
                onChange={onChange}
                checked={checked}
                {...passProps}
            />
            {title && <label htmlFor={title}>{title}</label>}
        </div>
    );
}