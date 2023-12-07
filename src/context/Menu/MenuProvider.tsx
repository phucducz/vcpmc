import { ReactNode, useState } from "react";
import { useNavigate } from "react-router";

import { MenuContext, MenuType } from "./MenuContext";
import { MENU_ICONS } from "~/images";
import { routes } from "~/config/routes";

type MenuProviderProps = {
    children: ReactNode;
}

export const MenuProvider = ({ children }: MenuProviderProps) => {
    const navigate = useNavigate();

    const [menuActive, setMenuActive] = useState<number>(0);
    const [active, setActive] = useState<boolean>(true);
    const [type, setType] = useState<'normal' | 'dynamic'>('normal');

    const MENU_ITEMS: Array<MenuType> = [
        {
            id: 1,
            icon: MENU_ICONS.storeRecordIcon,
            title: 'Kho bản ghi',
            onClick: () => {
                setMenuActive(1);
                navigate(routes.RecordPage);
            }
        }, {
            id: 2,
            icon: MENU_ICONS.playlistIcon,
            title: 'Playlist',
            onClick: () => {
                setMenuActive(2);
                navigate(routes.PlaylistManagement);
            }
        }, {
            id: 3,
            icon: MENU_ICONS.calendarIcon,
            title: 'Lập lịch phát',
            onClick: () => navigate(routes.PlaylistSchedule)
        }, {
            id: 4,
            icon: MENU_ICONS.managementIcon,
            title: 'Quản lý',
            onClick: () => { },
            children: [
                {
                    title: 'Quản lý hợp đồng',
                    onClick: () => {
                        setMenuActive(4);
                        navigate(routes.Entrustment);
                    }
                }, {
                    title: 'Quản lý thiết bị',
                    onClick: () => { }
                }, {
                    title: 'Đơn vị ủy quyền',
                    onClick: () => { }
                }, {
                    title: 'Đơn vị sử dụng',
                    onClick: () => { }
                }
            ]
        }, {
            id: 5,
            icon: MENU_ICONS.revenueIcon,
            title: 'Doanh thu',
            onClick: () => { },
            children: [
                {
                    title: 'Báo cáo doanh thu',
                    onClick: () => { }
                }, {
                    title: 'Lịch sử đối soát',
                    onClick: () => { }
                }, {
                    title: 'Phân phối doanh thu',
                    onClick: () => { }
                }
            ]
        }, {
            id: 6,
            icon: MENU_ICONS.settingIcon,
            title: 'Cài đặt',
            onClick: () => { },
            children: [
                {
                    title: 'Phân quyền người dùng',
                    onClick: () => { }
                }, {
                    title: 'Cấu hình',
                    onClick: () => { }
                }, {
                    title: 'Quản lý hợp đồng',
                    onClick: () => { }
                }, {
                    title: 'Thông tin tác phẩm',
                    onClick: () => { }
                }, {
                    title: 'Chu kỳ đối soát',
                    onClick: () => { }
                }
            ]
        }, {
            id: 7,
            icon: MENU_ICONS.supportIcon,
            title: 'Hỗ trợ',
            onClick: () => { },
            children: [
                {
                    title: 'Hướng dẫn sử dụng',
                    onClick: () => { }
                }, {
                    title: 'Tải app',
                    onClick: () => { }
                }, {
                    title: 'Feedback',
                    onClick: () => { }
                }
            ]
        }
    ];

    return (
        <MenuContext.Provider value={{
            data: MENU_ITEMS,
            menuActive,
            setMenuActive,
            active,
            setActive,
            type,
            setType
        }}>
            {children}
        </MenuContext.Provider>
    );
}