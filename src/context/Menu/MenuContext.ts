import { createContext } from "react";
import { ItemProps } from "~/components/Menu";

export type MenuType = {
    id?: number;
    icon?: any;
    title: string;
    onClick: () => void;
    children?: Array<Omit<ItemProps, 'className'>>
}

export type ContextType = {
    data: Array<MenuType>;
    menuActive: number;
    setMenuActive: (active: number) => void;
}

export const MenuContext = createContext<ContextType>({} as ContextType);