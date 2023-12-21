import { ReactNode, useState } from "react";
import { useNavigate } from "react-router";

import { routes } from "~/config/routes";
import { MENU_ICONS } from "~/images";
import { MenuContext, MenuType } from "./MenuContext";

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
            },
            functionalCode: ['nguoidung_xoa', 'nguoidung_pheduyet', 'nguoidung_capnhat'],
        }, {
            id: 2,
            icon: MENU_ICONS.playlistIcon,
            title: 'Playlist',
            onClick: () => {
                setMenuActive(2);
                navigate(routes.PlaylistManagement);
            },
            functionalCode: ['nguoidung_xemdanhsach', 'nguoidung_xemchitiet', 'nguoidung_tao', 'nguoidung_xoa', 'nguoidung_chinhsua'],
        }, {
            id: 3,
            icon: MENU_ICONS.calendarIcon,
            title: 'Lập lịch phát',
            onClick: () => navigate(routes.PlaylistSchedule),
            functionalCode: ['nguoidung_xemdanhsach', 'nguoidung_xemchitiet', 'nguoidung_tao', 'nguoidung_xoa', 'nguoidung_chinhsua'],
        }, {
            id: 4,
            icon: MENU_ICONS.managementIcon,
            title: 'Quản lý',
            onClick: () => { },
            functionalCode: [],
            children: [
                {
                    title: 'Quản lý hợp đồng',
                    onClick: () => {
                        setMenuActive(4);
                        navigate(routes.Entrustment);
                    },
                    functionalCode: [],
                }, {
                    title: 'Quản lý thiết bị',
                    onClick: () => {
                        setMenuActive(4);
                        navigate(routes.DeviceManagement);
                    },
                    functionalCode: [],
                }, {
                    title: 'Đơn vị ủy quyền',
                    onClick: () => {
                        setMenuActive(4);
                        navigate(routes.AuthorizedContract);
                    },
                    functionalCode: [],
                }, {
                    title: 'Đơn vị sử dụng',
                    onClick: () => {
                        setMenuActive(4);
                        navigate(routes.Unit);
                    },
                    functionalCode: [],
                }
            ]
        }, {
            id: 5,
            icon: MENU_ICONS.revenueIcon,
            title: 'Doanh thu',
            onClick: () => { },
            functionalCode: [],
            children: [
                {
                    title: 'Báo cáo doanh thu',
                    onClick: () => { },
                    functionalCode: [],
                }, {
                    title: 'Lịch sử đối soát',
                    onClick: () => { },
                    functionalCode: [],
                }, {
                    title: 'Phân phối doanh thu',
                    onClick: () => {
                        setMenuActive(5);
                        navigate(routes.RevenueManagement)
                    },
                    functionalCode: [],
                }
            ]
        }, {
            id: 6,
            icon: MENU_ICONS.settingIcon,
            title: 'Cài đặt',
            onClick: () => { },
            functionalCode: [],
            children: [
                {
                    title: 'Phân quyền người dùng',
                    onClick: () => {
                        navigate(routes.UserAuthorizationManagement);
                        setMenuActive(6);
                    },
                    functionalCode: [],
                }, {
                    title: 'Cấu hình',
                    onClick: () => {
                        navigate(routes.Config);
                        setMenuActive(6);
                    },
                    functionalCode: [],
                }, {
                    title: 'Quản lý hợp đồng',
                    onClick: () => {
                        navigate(routes.ConfigContract);
                        setMenuActive(6);
                    },
                    functionalCode: [],
                }, {
                    title: 'Thông tin tác phẩm',
                    onClick: () => {
                        navigate(routes.ConfigCategories);
                        setMenuActive(6);
                    },
                    functionalCode: [],
                }, {
                    title: 'Chu kỳ đối soát',
                    onClick: () => {
                        navigate(routes.ConfigForControlCircle);
                        setMenuActive(6);
                    },
                    functionalCode: [],
                }
            ]
        }, {
            id: 7,
            icon: MENU_ICONS.supportIcon,
            title: 'Hỗ trợ',
            onClick: () => { },
            functionalCode: [],
            children: [
                {
                    title: 'Hướng dẫn sử dụng',
                    onClick: () => { },
                    functionalCode: [],
                }, {
                    title: 'Tải app',
                    onClick: () => {
                        navigate(routes.SupportDownload);
                        setMenuActive(7);
                    },
                    functionalCode: [],
                }, {
                    title: 'Feedback',
                    onClick: () => {
                        navigate(routes.SupportFeedback);
                        setMenuActive(7);
                    },
                    functionalCode: [],
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