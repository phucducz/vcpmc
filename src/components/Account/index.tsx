import classNames from "classnames/bind";

import style from './Account.module.scss';
import Image, { ImageProps } from "../Image";

const cx = classNames.bind(style);

type AccountProps = {
    displayName: string;
    role: string;
    image: Pick<ImageProps, 'src' | 'alt'>;
    onClick: () => void
}

export const Account = ({ displayName, role, image, onClick }: AccountProps) => {
    const { src, alt } = image;

    let nameList = displayName.split(' ');
    let sureName = nameList[0].charAt(0);
    let name = nameList[nameList.length - 1];

    return (
        <div className={cx('account')} onClick={onClick}>
            <Image src={src} alt={alt} width={40} height={40.5} />
            <div className={cx('account__info')}>
                <div className={cx('account__info__display-name')}>
                    <p>{`${sureName}. ${name}`}</p>
                </div>
                <div className={cx('account__info__role-name')}>
                    <p>{role}</p>
                </div>
            </div>
        </div>
    );
}