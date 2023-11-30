import classNames from "classnames/bind";
import { memo } from 'react';

import style from './RadioButton.module.scss';

const cx = classNames.bind(style);

type RadioButtonProps = {
    title?: string,
    checked: boolean,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const RadioButton = memo(({
    title,
    checked,
    onChange,
    ...passProps
}: RadioButtonProps) => {
    return (
        <div className={cx('form-group')}>
            <input
                type="radio"
                id={title}
                value={title}
                onChange={onChange}
                checked={checked}
                {...passProps}
            />
            {title && <label htmlFor={title}>{title}</label>}
        </div>
    );
})