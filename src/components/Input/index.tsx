import classNames from "classnames/bind";
import { ReactNode, memo, useEffect, useRef, useState } from "react";

import style from './InputStyle.module.scss';

const cx = classNames.bind(style);

export type InputProps = {
    name: string,
    value: string | number,
    fieldName?: string,
    type?: string,
    rightIcon?: ReactNode,
    touched?: boolean,
    errorMessage?: string,
    tiny?: boolean;
    small?: boolean,
    large?: boolean,
    medium?: boolean,
    style?: Object;
    readOnly?: boolean;
    accept?: string;
    max?: number;
    min?: number;
    cols?: number;
    rows?: number;
    isRequired?: boolean,
    spellCheck?: boolean,
    placeholder?: string;
    className?: string;
    leftIcon?: ReactNode,
    inputRef?: any;
    onRightIconClick?: any;
    onLeftIconClick?: any;
    onFocus?: any;
    onBlur?: any;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

type PropsOwnInput<E extends React.ElementType> = InputProps & { as?: E } & React.ComponentProps<'input'>;

type InputComponentProps<E extends React.ElementType> =
    PropsOwnInput<E> & Omit<React.ComponentProps<E>, keyof PropsOwnInput<E>>;

export const Input = memo(<E extends React.ElementType>({
    value,
    fieldName,
    name,
    rightIcon,
    leftIcon,
    type,
    tiny,
    small,
    large,
    medium,
    touched,
    errorMessage,
    isRequired = false,
    className,
    inputRef,
    onChange,
    onFocus,
    onBlur,
    onRightIconClick,
    onLeftIconClick,
    as,
    ...passProps
}: InputComponentProps<E>) => {
    const Component = as || 'input';

    const [isInvalid, setIsInvalid] = useState(false);

    const fieldRef = useRef<HTMLParagraphElement>(null);
    const formGroupRef = useRef<HTMLDivElement>(null);
    const divSvgRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (formGroupRef.current && fieldRef.current && divSvgRef.current) {
            let containerHeight = formGroupRef.current.offsetHeight || 92;
            let fieldHeight = fieldRef.current.offsetHeight || 44;
            let inputHeight = 48;
            let top = (fieldHeight / containerHeight) * 100;

            divSvgRef.current.style.top = `calc(${top}% + ${inputHeight / 2}px)`;
        }
    }, [formGroupRef, fieldRef, divSvgRef]);

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
        <div ref={formGroupRef} className={cx('form-group', isInvalid && 'invalid')}>
            {fieldName && <p ref={fieldRef} className={cx('form-group__field')}>
                {fieldName}
                {isRequired && <span className={cx(isRequired && 'require')}>*</span>}
            </p>}
            {leftIcon && <div ref={divSvgRef} className={cx('form-group__icon-left')}>{leftIcon}</div>}
            <Component
                ref={inputRef}
                value={value}
                name={name}
                className={cx('form-group__input', { small, large, medium, tiny }, className)}
                onChange={onChange}
                onFocus={onFocus}
                onBlur={() => handleBlur()}
                type={type}
                {...passProps}
            />
            {rightIcon && <div ref={divSvgRef} className={cx('form-group__icon-right')}>{rightIcon}</div>}
        </div>
    );
})