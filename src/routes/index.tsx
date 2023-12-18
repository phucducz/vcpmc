import { routes } from "~/config/routes";
import { LoginLayout } from "~/layouts/LoginLayout";
import AuthorizedContract from "~/pages/AuthorizedContract/AuthorizedContract";
import EditAuthorizedContract from "~/pages/AuthorizedContract/Edit";
import AddDevicePage from "~/pages/Device/Add";
import DeviceDetailPage from "~/pages/Device/Detail";
import DeviceManagementPage from "~/pages/Device/Device";
import AddETMContractPage from "~/pages/EntrustmentContract/Add";
import ETMEntrustmentCopyPage from "~/pages/EntrustmentContract/Copy";
import ETMContractDetailPage from "~/pages/EntrustmentContract/Detail";
import EntrusmentPage from "~/pages/EntrustmentContract/Entrustment";
import LoginPage from "~/pages/Login/Login";
import RecoverPage from "~/pages/Login/RecoverPage";
import AddPlaylistPage from "~/pages/Playlist/AddPlaylist";
import AddRecordPlaylistPage from "~/pages/Playlist/AddRecord";
import PlaylistDetailPage from "~/pages/Playlist/Detail";
import EditPlaylistDetailPage from "~/pages/Playlist/Edit";
import PlaylistPage from "~/pages/Playlist/Playlist";
import AddPlaylistSchedulePage from "~/pages/PlaylistSchedule/AddPlaylistSchedule";
import AppySchedulePage from "~/pages/PlaylistSchedule/ApplySchedule";
import PlaylistScheduleDetailPage from "~/pages/PlaylistSchedule/Detail";
import PlaylistScheduleEditPage from "~/pages/PlaylistSchedule/Edit";
import PlaylistSchedulePage from "~/pages/PlaylistSchedule/Schedule";
import ApprovePage from "~/pages/Record/Approve";
import EditRecord from "~/pages/Record/Edit";
import RecordPage from "~/pages/Record/Record";
import ResetPassPage from "~/pages/ResetPassPage";
import NoFoundPage from "~/pages/ResetPassPage/NoFound";
import RevenueDetailPage from "~/pages/Revenue/Detail";
import RevenueManagementPage from "~/pages/Revenue/Revenue";
import UnitManagementPage from "~/pages/UnitUsed/UnitManagement";
import AddRolePage from "~/pages/User/AddRole";
import AddUserPage from "~/pages/User/AddUser";
import UserAuthorizationPage from "~/pages/User/Authorization";
import EditRolePage from "~/pages/User/EditRole";
import EditUserPage from "~/pages/User/EditUser";
import ProfilePage from "~/pages/User/ProfilePage";
import UserRolePage from "~/pages/User/Role";

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
    { path: routes.PlaylistDetail, Component: PlaylistDetailPage },
    { path: routes.EditPlaylistDetail, Component: EditPlaylistDetailPage },
    { path: routes.AddPlaylist, Component: AddPlaylistPage },
    { path: routes.AddRecordPlaylist, Component: AddRecordPlaylistPage },
    { path: routes.PlaylistSchedule, Component: PlaylistSchedulePage },
    { path: routes.PlaylistScheduleDetail, Component: PlaylistScheduleDetailPage },
    { path: routes.PlaylistScheduleEdit, Component: PlaylistScheduleEditPage },
    { path: routes.ApplySchedule, Component: AppySchedulePage },
    { path: routes.AddPlaylistSchedule, Component: AddPlaylistSchedulePage },
    { path: routes.Unit, Component: UnitManagementPage },
    { path: routes.AuthorizedContract, Component: AuthorizedContract },
    { path: routes.EidtAuthorizedContract, Component: EditAuthorizedContract },
    { path: routes.DeviceManagement, Component: DeviceManagementPage },
    { path: routes.DeviceDetail, Component: DeviceDetailPage },
    { path: routes.AddDevice, Component: AddDevicePage },
    { path: routes.RevenueManagement, Component: RevenueManagementPage },
    { path: routes.RevenueDetail, Component: RevenueDetailPage },
    { path: routes.UserAuthorizationManagement, Component: UserAuthorizationPage },
    { path: routes.UserRoleManagemet, Component: UserRolePage },
    { path: routes.EditUser, Component: EditUserPage },
    { path: routes.AddUser, Component: AddUserPage },
    { path: routes.EditRole, Component: EditRolePage },
    { path: routes.AddRole, Component: AddRolePage },
];