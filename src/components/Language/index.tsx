import classNames from "classnames/bind";

import style from './Language.module.scss';
import { Item } from "./Item";
import { useState } from "react";
import { DropDown } from "./DropDown";

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
};

export const Language = ({ languages, placement }: LanguagesProps) => {
    const [language, setLanguage] = useState<LanguageProps>(languages[0]);
    const [activeDropDow, setActiveDropDown] = useState<boolean>(false);

    let langs: Array<Omit<LanguageProps, 'icon'>> = [];
    languages.map(lang => lang.title !== language.title && langs.push({ title: lang.title }));

    let handleSetLang: (item: LanguageProps) => void = function (item: LanguageProps) {
        setLanguage(item);
        setActiveDropDown(!activeDropDow);
    }

    return (
        <div className={cx('language-container', placement)}>
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