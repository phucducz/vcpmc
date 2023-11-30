import { routes } from "~/config/routes";
import { LoginLayout } from "~/layouts/LoginLayout";
import { AddETMContract } from "~/pages/AddEntrusmentContract";
import { ApprovePage } from "~/pages/ApprovePage";
import { ETMContractDetail } from "~/pages/ETMContractDetail";
import { EditRecord } from "~/pages/EditRecord";
import { EntrusmentPage } from "~/pages/EntrustmentPage";
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
    { path: routes.ApproveRecord, Component: ApprovePage },
    { path: routes.Entrustment, Component: EntrusmentPage },
    { path: routes.ETMContractDetail, Component: ETMContractDetail },
    { path: routes.AddETMContract, Component: AddETMContract }
];