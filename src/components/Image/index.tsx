import classNames from "classnames/bind";
import { memo, useEffect, useRef } from "react";

import style from './Image.module.scss';
import { Input } from "../Input";
import { Icon, cameraIcon } from "~/icons";
import noFoundAvatar from '~/images/no-found-avt.jpg';

const cx = classNames.bind(style);

export type ImageProps = {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
    edit?: boolean;
    type?: 'img' | 'upload';
    isBG?: boolean;
    style?: any;
    containerStyle?: any;
}

function Image({ isBG, src, alt, width, height, className, type = 'img', edit = false, style, containerStyle }: ImageProps) {
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        if (imgRef.current) {
            imgRef.current.style.width = width ? `${width}px` : '100%';
            imgRef.current.style.height = height ? `${height}px` : '100%';
        }
    }, [width, height]);

    return (
        <div className={cx('cn-image', className)} style={containerStyle}>
            <img ref={imgRef} src={(src === '' || typeof src === 'undefined') ? noFoundAvatar : src} alt={alt} style={style} />
            {type === 'upload' && <div className={cx('profile__avatar__upload', edit && 'active', isBG && 'bg-active')}>
                <label>
                    <Icon icon={cameraIcon} />
                    <Input
                        name='avatar'
                        value=''
                        type='file'
                        accept='image/*'
                        style={{ display: 'none' }}
                        onChange={() => { }}
                    />
                </label>
            </div>}
        </div>
    );
}

export default memo(Image);