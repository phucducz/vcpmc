import { useContext, useEffect } from "react";

import { LanguageContext } from "../Language/LanguageContext";
import { MenuContext } from "../Menu/MenuContext";
import { ThemeContext } from "../Theme/ThemeContext";

export const useTheme = () => {
    return useContext(ThemeContext);
}

export const useMenu = () => {
    return useContext(MenuContext);
}

export const useLanguage = () => {
    return useContext(LanguageContext);
}

export const useWindowsResize = (handleWindowResize: () => void) => {
    useEffect(() => {
        handleWindowResize();
        window.addEventListener('resize', handleWindowResize);

        return () => window.removeEventListener('resize', handleWindowResize);
    }, []);
}