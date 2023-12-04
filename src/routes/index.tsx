import { routes } from "~/config/routes";
import { LoginLayout } from "~/layouts/LoginLayout";
import { AddETMContractPage } from "~/pages/AddEntrusmentContract";
import { ApprovePage } from "~/pages/ApprovePage";
import { ETMContractDetailPage } from "~/pages/ETMContractDetail";
import { EditRecord } from "~/pages/EditRecord";
import { ETMEntrustmentCopyPage } from "~/pages/EntrustmentCopyPage";
import { EntrusmentPage } from "~/pages/EntrustmentPage";
import { LoginPage } from "~/pages/LoginPage";
import { PlaylistDetail } from "~/pages/PlaylistDetail";
import { PlaylistPage } from "~/pages/PlaylistPage";
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
    { path: routes.ETMContractDetail, Component: ETMContractDetailPage },
    { path: routes.AddETMContract, Component: AddETMContractPage },
    { path: routes.ETMContractCopy, Component: ETMEntrustmentCopyPage },
    { path: routes.PlaylistManagement, Component: PlaylistPage },
    { path: routes.PlaylistDetail, Component: PlaylistDetail }
];