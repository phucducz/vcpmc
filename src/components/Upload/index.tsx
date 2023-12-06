import classNames from "classnames/bind";
import { memo } from "react";

import style from './Upload.module.scss';
import { Input } from "../Input";
import { Icon, uploadIcon } from "~/icons";

const cx = classNames.bind(style);

export const Upload = memo(() => {
    return (
        <div className={cx('upload-container')}>
            <div className={cx('upload__form-group')}>
                <span>
                    <span>
                        <Icon icon={uploadIcon} />
                        <span>Tải lên</span>
                    </span>
                    <Input
                        name='file'
                        value=''
                        type='file'
                        accept='image/*'
                        style={{ display: 'block' }}
                        onChange={() => { }}
                    // onChange={e => handleUploadClick(e.target.files[0])}
                    />
                </span>
            </div>
        </div>
    );
});