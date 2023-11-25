import { routes } from "~/config/routes";
import { LoginLayout } from "~/layouts/LoginLayout";
import { ApprovePage } from "~/pages/ApprovePage";
import { EditRecord } from "~/pages/EditRecord";
import { LoginPage } from "~/pages/LoginPage";
import { ProfilePage } from "~/pages/ProfilePage";
import { RecordPage } from "~/pages/RecordPage";
import { RecoverPage } from "~/pages/RecoverPage";
import { ResetPassPage } from "~/pages/ResetPassPage";
import { NoFoundPage } from "~/pages/ResetPassPage/NoFound";

export const publicRoutes = [
    { path: routes.ProfilePage, Component: ProfilePage },
    { path: routes.LoginPage, Component: LoginPage, layout: LoginLayout },
    { path: routes.ResetPage, Component: ResetPassPage, layout: LoginLayout },
    { path: routes.ResetNoFoundPage, Component: NoFoundPage, layout: LoginLayout },
    { path: routes.RecoverPage, Component: RecoverPage, layout: LoginLayout },
    { path: routes.RecordPage, Component: RecordPage },
    { path: routes.EditRecord, Component: EditRecord },
    { path: routes.ApproveRecord, Component: ApprovePage }
];