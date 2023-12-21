import { ReactNode, useEffect, useState } from "react";

import { LANGUAGE_ITEMS } from "~/constants";
import { LanguageContext, LanguageType } from "./LanguageContext";

type LanguageProviderProps = {
    children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
    const [language, setLanguage] = useState<LanguageType>({} as LanguageType);

    useEffect(() => {
        setLanguage(LANGUAGE_ITEMS[0]);
    }, []);

    return (
        <LanguageContext.Provider value={{
            data: LANGUAGE_ITEMS,
            language: language,
            setLanguage: setLanguage
        }}>
            {children}
        </LanguageContext.Provider>
    );
}