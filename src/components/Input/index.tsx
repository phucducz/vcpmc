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
    style?: Object;
    readOnly?: boolean;
    accept?: string;
    leftIcon?: IconProp,
    inputRef?: any;
    onRightIconClick?: any,
    onLeftIconClick?: any,
    onFocus?: any,
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
    inputRef,
    onChange,
    onFocus,
    onBlur,
    onRightIconClick,
    onLeftIconClick,
    ...passProps
}: InputProps) {
    const [isInvalid, setIsInvalid] = useState(false);

    useEffect(() => {
        if (typeof errorMessage === 'undefined')
            setIsInvalid(false);
        else if (value === '' && touched)
            setIsInvalid(true);
    }, [errorMessage]);
    
    const handleBlur = () => {
        if (typeof errorMessage !== 'undefined')
            setIsInvalid(true);
        else
            setIsInvalid(false);
        onBlur && onBlur();
    }

    return (
        <div className={cx('form-group', isInvalid && 'invalid')}>
            {fieldName && <p className={cx('form-group__field')}>{fieldName}</p>}
            {leftIcon && <FontAwesomeIcon
                className={cx('form-group__icon-left')}
                icon={leftIcon}
            />}
            <input
                ref={inputRef}
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
                onClick={onRightIconClick}
            />}
        </div>
    );
}

export default memo(Input);