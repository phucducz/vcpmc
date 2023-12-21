import { ReactNode, useEffect, useState } from "react";

import { ThemeContext, ThemeType } from "./ThemeContext";
import { THEME_IMAGES } from "~/images";

type ThemeProviderProps = {
    children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
    const [themeActive, setThemeActive] = useState<ThemeType>({} as ThemeType);

    const THEME_ITEMS: Array<ThemeType> = THEME_IMAGES.map((image, index) => ({
        id: index,
        name: `theme ${index + 1}`,
        imageURL: image
    }));

    useEffect(() => {
        setThemeActive(THEME_ITEMS[0]);
    }, []);

    return (
        <ThemeContext.Provider value={{
            data: THEME_ITEMS,
            theme: themeActive,
            setTheme: setThemeActive
        }}>
            {children}
        </ThemeContext.Provider>
    );
}