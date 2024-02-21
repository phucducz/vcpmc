import classNames from "classnames/bind";
import { useState } from "react";

import style from './Language.module.scss';
import { Item } from "./Item";
import { DropDown } from "../DropDown";
import { useLanguage } from "~/context/hooks";

const cx = classNames.bind(style);

type HorizontalPosition = 'left' | 'right' | 'center';
type VerticalPosition = 'top' | 'bottom' | 'center';

export type LanguageProps = {
    title: string;
    icon: string;
}

type LanguagesProps = {
    languages: Array<LanguageProps>;
    placement: Exclude<`${VerticalPosition}-${HorizontalPosition}`, 'center-center'> | 'center';
    className?: string;
};

export const Language = ({ languages, placement, className }: LanguagesProps) => {
    const { language, setLanguage } = useLanguage();

    const [activeDropDow, setActiveDropDown] = useState<boolean>(false);

    let handleSetLang: (item: LanguageProps) => void = function (item: LanguageProps) {
        setLanguage(item);
        setActiveDropDown(!activeDropDow);
    }

    return (
        <div className={cx('language-container', placement, className)}>
            <div className={cx('language-item', `active-dropdown-${activeDropDow}`)}>
                <Item
                    title={language.title}
                    icon={language.icon}
                    onClick={() => setActiveDropDown(!activeDropDow)}
                />
                <DropDown
                    className={cx('language-item__drop-down')}
                    visible={activeDropDow}
                    data={languages.filter(lang => lang.title !== language.title)}
                    onItemClick={handleSetLang}
                />
            </div>
        </div>
    )
}