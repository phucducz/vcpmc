import classNames from "classnames/bind";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { memo, useEffect, useState } from "react";

import style from './InputStyle.module.scss';

const cx = classNames.bind(style);

export type InputProps = {
    name: string,
    value: string,
    fieldName?: string,
    type?: string,
    rightIcon?: IconProp,
    touched?: boolean,
    errorMessage?: string,
    small?: boolean,
    large?: boolean,
    medium?: boolean,
    rightIconClick?: () => void,
    leftIcon?: IconProp,
    leftIconClick?: () => void,
    onFocus?: () => void,
    onBlur?: any,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
}

function Input({
    value,
    fieldName,
    name,
    rightIcon,
    leftIcon,
    type,
    small,
    large,
    medium,
    touched,
    errorMessage,
    onChange,
    onFocus,
    onBlur,
    rightIconClick,
    leftIconClick,
    ...passProps
}: InputProps) {
    const [isInValid, setIsInValid] = useState(false);

    useEffect(() => {
        if (typeof errorMessage === 'undefined')
            setIsInValid(false);
        else if (value === '' && touched)
            setIsInValid(true);
    }, [errorMessage]);

    const handleBlur = () => {
        if (typeof errorMessage !== 'undefined')
            setIsInValid(true);
        else
            setIsInValid(false);
        onBlur && onBlur();
    }

    return (
        <div className={cx('form-group', isInValid && 'invalid')}>
            {fieldName && <p className={cx('form-group__field')}>{fieldName}</p>}
            {leftIcon && <FontAwesomeIcon
                className={cx('form-group__icon-left')}
                icon={leftIcon}
            />}
            <input
                value={value}
                name={name}
                className={cx('form-group__input', { small, large, medium })}
                onChange={onChange}
                onFocus={onFocus}
                onBlur={() => handleBlur()}
                type={type}
                {...passProps}
            />
            {rightIcon && <FontAwesomeIcon
                className={cx('form-group__icon-right')}
                icon={rightIcon}
                onClick={rightIconClick}
            />}
        </div>
    );
}

export default memo(Input);