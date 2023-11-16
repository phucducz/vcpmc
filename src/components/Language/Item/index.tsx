import classNames from "classnames/bind";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import style from './Item.module.scss';
import { LanguageProps } from "..";

const cx = classNames.bind(style);

type ItemProps = LanguageProps & {
    onClick?: () => void
}

export const Item = ({ title, icon, onClick }: ItemProps) => {
    return (
        <div className={cx('language-item')} onClick={onClick}>
            <p className={cx('language-item__title')}>{title}</p>
            <img className={cx('language-item__icon')} src={icon} alt={'title'} />
            <FontAwesomeIcon icon={faChevronDown} />
        </div>
    );
}