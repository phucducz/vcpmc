import { routes } from "~/config/routes";
import { LoginLayout } from "~/layouts/LoginLayout";
import AuthorizedContract from "~/pages/AuthorizedContract/AuthorizedContract";
import EditAuthorizedContract from "~/pages/AuthorizedContract/Edit";
import ConfigCategoriesPage from "~/pages/Configuration/Categories/Categories";
import EditCategoriesPage from "~/pages/Configuration/Categories/EditCategories";
import ConfigPage from "~/pages/Configuration/Config";
import ConfigContractPage from "~/pages/Configuration/Contract/Contract";
import EditContractPage from "~/pages/Configuration/Contract/EditExpirationDate";
import EditTypeContractPage from "~/pages/Configuration/Contract/EditTypeContract";
import ForControlCirclePage from "~/pages/Configuration/ForControlCircle";
import AddDevicePage from "~/pages/Device/Add";
import DeviceDetailPage from "~/pages/Device/Detail";
import DeviceManagementPage from "~/pages/Device/Device";
import LoginPage from "~/pages/Login/Login";
import RecoverPage from "~/pages/Login/RecoverPage";
import AddAuthorizedContractPage from "~/pages/ManagementContract/AuthorizedContract/Add";
import AuthorizedContractDetailPage from "~/pages/ManagementContract/AuthorizedContract/Detail";
import AddETMContractPage from "~/pages/ManagementContract/EntrustmentContract/Add";
import ETMEntrustmentCopyPage from "~/pages/ManagementContract/EntrustmentContract/Copy";
import ETMContractDetailPage from "~/pages/ManagementContract/EntrustmentContract/Detail";
import EntrusmentPage from "~/pages/ManagementContract/ManagementList";
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
import HistoryForControlDetailPage from "~/pages/Revenue/ForControl/Detail";
import HistoryForControlPage from "~/pages/Revenue/ForControl/History";
import RevenueReportDetailPage from "~/pages/Revenue/Report/Detail";
import RevenueReportPage from "~/pages/Revenue/Report/Report";
import RevenueContractReportDetailPage from "~/pages/Revenue/Report/RevenueContractDetail";
import RevenueManagementPage from "~/pages/Revenue/Revenue";
import SupportDownloadPage from "~/pages/Support/Download";
import SupportFeedbackPage from "~/pages/Support/Feedback";
import SupportUserManualPage from "~/pages/Support/UserManual";
import UnitUsedDetailPage from "~/pages/UnitUsed/Detail";
import UnitManagementPage from "~/pages/UnitUsed/UnitManagement";
import AddUserOfUnitPage from "~/pages/UnitUsed/User/AddUser";
import UserOfUnitDetailPage from "~/pages/UnitUsed/User/Detail";
import EditUserOfUnitPage from "~/pages/UnitUsed/User/EditUser";
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
    { path: routes.ManagementList, Component: EntrusmentPage },
    { path: routes.ETMContractDetail, Component: ETMContractDetailPage },
    { path: routes.AddETMContract, Component: AddETMContractPage },
    { path: routes.ETMContractCopy, Component: ETMEntrustmentCopyPage },
    { path: routes.AuthorizedContractDetail, Component: AuthorizedContractDetailPage },
    { path: routes.AddAuthorizedContract, Component: AddAuthorizedContractPage },
    { path: routes.PlaylistManagement, Component: PlaylistPage },
    { path: routes.PlaylistDetail, Component: PlaylistDetailPage },
    { path: routes.EditPlaylistDetail, Component: EditPlaylistDetailPage },
    { path: routes.AddPlaylist, Component: AddPlaylistPage },
    { path: routes.AddRecordPlaylist, Component: AddRecordPlaylistPage },
    { path: routes.PlaylistSchedule, Component: PlaylistSchedulePage },
    { path: routes.PlaylistScheduleDetail, Component: PlaylistScheduleDetailPage },
    { path: routes.PlaylistScheduleEdit, Component: PlaylistScheduleEditPage },
    { path: routes.ApplySchedule, Component: AppySchedulePage },
    { path: routes.EditUserOfUnit, Component: EditUserOfUnitPage },
    { path: routes.AddPlaylistSchedule, Component: AddPlaylistSchedulePage },
    { path: routes.Unit, Component: UnitManagementPage },
    { path: routes.EditUnit, Component: UnitUsedDetailPage },
    { path: routes.AddUserOfUnit, Component: AddUserOfUnitPage },
    { path: routes.UserOfUnitDetail, Component: UserOfUnitDetailPage },
    { path: routes.AuthorizedContract, Component: AuthorizedContract },
    { path: routes.EidtAuthorizedContract, Component: EditAuthorizedContract },
    { path: routes.DeviceManagement, Component: DeviceManagementPage },
    { path: routes.DeviceDetail, Component: DeviceDetailPage },
    { path: routes.AddDevice, Component: AddDevicePage },
    { path: routes.RevenueManagement, Component: RevenueManagementPage },
    { path: routes.RevenueReport, Component: RevenueReportPage },
    { path: routes.RevenueReportDetail, Component: RevenueReportDetailPage },
    { path: routes.RevenueDetail, Component: RevenueDetailPage },
    { path: routes.RevenueContractReportDetail, Component: RevenueContractReportDetailPage },
    { path: routes.UserAuthorizationManagement, Component: UserAuthorizationPage },
    { path: routes.UserRoleManagemet, Component: UserRolePage },
    { path: routes.EditUser, Component: EditUserPage },
    { path: routes.AddUser, Component: AddUserPage },
    { path: routes.EditRole, Component: EditRolePage },
    { path: routes.AddRole, Component: AddRolePage },
    { path: routes.Config, Component: ConfigPage },
    { path: routes.ConfigCategories, Component: ConfigCategoriesPage },
    { path: routes.EditCategories, Component: EditCategoriesPage },
    { path: routes.ConfigEditContract, Component: EditContractPage },
    { path: routes.ConfigContract, Component: ConfigContractPage },
    { path: routes.ConfigEditTypeContract, Component: EditTypeContractPage },
    { path: routes.ConfigForControlCircle, Component: ForControlCirclePage },
    { path: routes.SupportDownload, Component: SupportDownloadPage },
    { path: routes.SupportFeedback, Component: SupportFeedbackPage },
    { path: routes.SupportUserManual, Component: SupportUserManualPage },
    { path: routes.HistoryForControl, Component: HistoryForControlPage },
    { path: routes.HistoryForControlDetail, Component: HistoryForControlDetailPage }
];