import classNames from "classnames/bind";
import { memo, useState } from 'react';

import style from './Block.module.scss';
import { useWindowsResize } from "~/context/hooks";

const cx = classNames.bind(style);

export type BlockInfoItemProps = {
    title: string;
    content: string;
}

const BlockInfoItem = memo(({ data }: { data: Array<BlockInfoItemProps> }) => {
    const [mobileMode, setMobileMode] = useState(false);

    useWindowsResize(() => {
        if (window.matchMedia('(max-width: 650px').matches) {
            setMobileMode(true);
            return;
        }
        setMobileMode(false);
    });

    return (
        <div className={cx('block-info__item')}>
            <div className={cx('item__content__left')}>
                {data.map((item: BlockInfoItemProps) => (
                    mobileMode
                        ? <>
                            <p key={item.title}>{item.title}</p>
                            <p key={item.title}>{item.content}</p>
                        </>
                        : <p key={item.title}>{item.title}</p>
                ))}
            </div>
            {!mobileMode && <div className={cx('item__content__right')}>
                {data.map((item: BlockInfoItemProps) => (
                    <p key={item.title}>{item.content}</p>
                ))}
            </div>}
        </div >
    );
});

type BlockInfoProps = {
    data: Array<any>;
    className?: string;
}

export const BlockInfo = memo(({ data, className }: BlockInfoProps) => {
    return (
        <div className={cx('block-info-container', className)}>
            {data.map((item, index) =>
                <BlockInfoItem key={index} data={item.children} />
            )}
        </div>
    );
});

const BlockInputItem = memo(({ data, className }: BlockInputProps) => {
    const [mobileMode, setMobileMode] = useState(false);

    useWindowsResize(() => {
        if (window.matchMedia('(max-width: 650px').matches) {
            setMobileMode(true);
            return;
        }
        setMobileMode(false);
    });

    return (
        <div className={cx('block-input__item', className)}>
            <div className={cx('item__left')}>
                {data.map((input) =>
                    input.fieldName && <div key={input.fieldName}>
                        <span>
                            {input.fieldName}
                            {input.isRequired && <span>*</span>}
                        </span>
                        {mobileMode && <div key={input.fieldName}>{input.input}</div>}
                    </div>)}
            </div>
            {!mobileMode && <div className={cx('item__right')}>
                {data.map(input => <div key={input.fieldName}>{input.input}</div>)}
            </div>}
        </div>
    );
});

type BlockInputProps = {
    data: Array<any>;
    className?: string;
}

export const BlockInput = memo(({ data, className }: BlockInputProps) => {
    return <BlockInputItem data={data} className={className} />
});