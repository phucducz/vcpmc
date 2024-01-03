import { faCheck, faCheckCircle, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames/bind";
import { useEffect, useReducer, useState } from "react";

import { ComboBox } from "~/components/ComboBox";
import Image from "~/components/Image";
import { PagingItemType } from "~/components/Paging";
import { routes } from "~/config/routes";
import { LANGUAGE_ITEMS } from "~/constants";
import { ThemeType } from "~/context/Theme/ThemeContext";
import { useLanguage, useTheme } from "~/context/hooks";
import { CommonPage } from "~/pages/CommonPage";
import style from './Config.module.scss';
import { LanguageType } from "~/context/Language/LanguageContext";
import { Toast } from "~/components/Toast";

type ScrollType = {
    count: number;
}

type ActionType = {
    type: 'UP' | 'DOWN';
    payload: { totalItem: number; }
}

const initialState: ScrollType = {
    count: 0
}

const scrollReducer = (state: ScrollType, action: ActionType) => {
    switch (action.type) {
        case 'UP':
            let countUp = state.count + 1;

            console.log(state.count);
            console.log(action.payload.totalItem);
            console.log(action.payload.totalItem - 3 === state.count);

            if (action.payload.totalItem - 3 === state.count) countUp = state.count;

            return { count: countUp };
        case 'DOWN':
            let countDown = state.count - 1;
            if (state.count === 0) countDown = state.count;

            return { count: countDown };
        default:
            throw new Error('Invalid action type!');
    }
}

const cx = classNames.bind(style);

function ConfigPage() {
    const { data: themeData, theme, setTheme } = useTheme();
    const { data: languageData, language, setLanguage } = useLanguage();
    const [scroll, dispatch] = useReducer(scrollReducer, initialState);

    const [paging, setPaging] = useState<Array<PagingItemType>>([] as Array<PagingItemType>);
    const [themes, setThemes] = useState<Array<ThemeType>>([] as Array<ThemeType>);
    const [languages, setLanguages] = useState<Array<LanguageType>>([] as Array<LanguageType>);
    const [activeComboBox, setActiveComboBox] = useState<boolean>(false);
    const [activeToast, setActiveToast] = useState<boolean>(false);

    useEffect(() => {
        document.title = 'Cài đặt cấu hình';

        setPaging([
            {
                title: 'Cài đặt',
                to: routes.Config,
                active: true
            }, {
                title: 'Cài đặt hệ thống',
                to: '#',
                active: true
            }
        ]);
    }, []);

    useEffect(() => {
        setThemes(themeData.filter(item => item.id !== theme.id));
    }, [theme]);

    useEffect(() => {
        setLanguages(languageData.filter(item => item.title !== language.title));
    }, [language]);

    const handleSetLanguage = (theme: ThemeType) => {
        setTheme(theme);

        setActiveToast(true);
        setTimeout(() => {
            setActiveToast(false);
        }, 1000);
    }

    const handeSetLanguage = (language: LanguageType) => {
        setLanguage(language);
    }

    return (
        <CommonPage
            title='Cài đặt cấu hình'
            pagingData={paging}
            className={cx('config-container')}
        >
            <div className={cx('config-container__theme')}>
                <div className={cx('theme__active')}>
                    <Image src={theme.imageURL} alt='theme' width={571} height={320} style={{ borderRadius: '0' }} />
                    <FontAwesomeIcon icon={faCheck} />
                    <p>{theme.name}</p>
                </div>
                <div className={cx('theme__items')}>
                    <FontAwesomeIcon icon={faChevronLeft} onClick={() => dispatch({ type: 'DOWN', payload: { totalItem: themes.length } })} />
                    <div className={cx('items__container')}>
                        {themes.map((theme, index) =>
                            <div
                                key={index}
                                className={cx('item')}
                                style={{ marginLeft: `${index === 0 && `calc((-246px - 23px) * ${scroll.count})`}` }}
                                onClick={() => handleSetLanguage(theme)}
                            >
                                <Image
                                    src={theme.imageURL}
                                    alt='them-item'
                                    width={246}
                                    height={160}
                                    style={{ borderRadius: '0' }}
                                />
                                <p>{theme.name}</p>
                            </div>
                        )}
                    </div>
                    <FontAwesomeIcon icon={faChevronRight} onClick={() => dispatch({ type: 'UP', payload: { totalItem: themes.length } })} />
                </div>
            </div>
            <div className={cx('config-container__language')}>
                <ComboBox
                    title='Ngôn ngữ hiển thị'
                    visible={activeComboBox}
                    data={languages}
                    active={language.title}
                    onClick={() => setActiveComboBox(!activeComboBox)}
                    onItemClick={handeSetLanguage}
                    className={cx('language__combo-box')}
                />
            </div>
            <Toast
                message='Đổi theme thành công'
                visible={activeToast}
                duration={800}
                setVisible={setActiveToast}
            />
        </CommonPage>
    );
}

export default ConfigPage;