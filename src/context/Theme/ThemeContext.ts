import { createContext } from "react";

export type ThemeType = {
    id: number;
    name: string;
    imageURL: string;
}

export type ContextType = {
    data: Array<ThemeType>;
    theme: ThemeType;
    setTheme: React.Dispatch<React.SetStateAction<ThemeType>>;
}

export const ThemeContext = createContext<ContextType>({} as ContextType);