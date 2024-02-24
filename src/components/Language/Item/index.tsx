import classNames from "classnames/bind";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import style from './Item.module.scss';
import { LanguageProps } from "..";
import Image from "~/components/Image";

const cx = classNames.bind(style);

type ItemProps = LanguageProps & {
    onClick?: () => void;
    elementRef?: any;
}

export const Item = ({ elementRef, title, icon, onClick }: ItemProps) => {
    return (
        <div className={cx('language-item')} onClick={onClick} ref={elementRef}>
            <p className={cx('language-item__title')}>{title}</p>
            <Image className={cx('language-item__icon')} src={icon} alt={'title'} />
            <FontAwesomeIcon icon={faChevronDown} />
        </div>
    );
}