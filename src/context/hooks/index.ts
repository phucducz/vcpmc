import { useContext } from "react"
import { ThemeContext } from "../Theme/ThemeContext"
import { MenuContext } from "../Menu/MenuContext";
import { LanguageContext } from "../Language/LanguageContext";

export const useTheme = () => {
    return useContext(ThemeContext);
}

export const useMenu = () => {
    return useContext(MenuContext);
}

export const useLanguage = () => {
    return useContext(LanguageContext);
}