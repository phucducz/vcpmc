import { createContext } from "react";

export type LanguageType = {
    id?: number;
    icon?: any;
    title: string;
}

export type ContextType = {
    data: Array<LanguageType>;
    language: LanguageType;
    setLanguage: React.Dispatch<React.SetStateAction<LanguageType>>;
}

export const LanguageContext = createContext<ContextType>({} as ContextType);