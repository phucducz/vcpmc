import { routes } from "../config/routes";
import { InfoPage } from "../pages/InfoPage";
import { LoginPage } from "../pages/LoginPage";
import { ResetPassPage } from "../pages/ResetPassPage";
import { NoFoundPage } from "../pages/ResetPassPage/NoFound";

export const publicRoutes = [
    { path: routes.Info, Component: InfoPage },
    { path: routes.Login, Component: LoginPage },
    { path: routes.Reset, Component: ResetPassPage },
    { path: routes.ResetNoFound, Component: NoFoundPage }
];