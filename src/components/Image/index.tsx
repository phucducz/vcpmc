import classNames from "classnames/bind";
import { memo, useEffect, useRef } from "react";

import style from './Image.module.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Input from "../Input";
import { faCamera } from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(style);

export type ImageProps = {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
    edit?: boolean;
    type?: 'img' | 'upload'
}

function Image({ src, alt, width, height, className, type = 'img', edit = false }: ImageProps) {
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        if (imgRef.current) {
            imgRef.current.style.width = width ? `${width}px` : '100%';
            imgRef.current.style.height = height ? `${height}px` : '100%';
        }
    }, [width, height]);

    return (
        <div className={cx('cn-image', className)}>
            <img ref={imgRef} src={src} alt={alt} />
            {type === 'upload' && <div className={cx('profile__avatar__upload', edit && 'active')}>
                <label>
                    <FontAwesomeIcon className={cx('')} icon={faCamera} />
                    <Input
                        name='avatar'
                        value=''
                        type='file'
                        accept='image/*'
                        style={{ display: 'none' }}
                        onChange={() => { }}
                    // onChange={e => handleUploadClick(e.target.files[0])}
                    />
                </label>
            </div>}
        </div>
    );
}

export default memo(Image);