import classNames from "classnames/bind";
import { useEffect, useRef, useState } from "react";

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

    // const [activeDropDow, setActiveDropDown] = useState<boolean>(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const [activeBox, setActiveBox] = useState<boolean>(false);

    let handleSetLang: (item: LanguageProps) => void = function (item: LanguageProps) {
        setLanguage(item);
        // setActiveBox(!activeBox);
    }

    useEffect(() => {
        const handleMouseDown = (e: any) => {
            if (contentRef.current?.contains(e.target))
                setActiveBox(true);
            else
                setActiveBox(false);
        }
        window.addEventListener('mousedown', handleMouseDown);

        return () => window.removeEventListener('mousedown', handleMouseDown);
    }, []);

    return (
        <div className={cx('language-container', placement, className)}>
            <div className={cx('language-item', `active-dropdown-${activeBox}`)}>
                <Item
                    elementRef={contentRef}
                    title={language.title}
                    icon={language.icon}
                />
                <DropDown
                    className={cx('language-item__drop-down')}
                    visible={activeBox}
                    data={languages.filter(lang => lang.title !== language.title)}
                    onItemClick={handleSetLang}
                />
            </div>
        </div>
    )
}