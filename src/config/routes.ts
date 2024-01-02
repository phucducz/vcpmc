export const routes = {
    ProfilePage: '/profile/id/:id',
    LoginPage: '/login',
    RecoverPage: '/recover-password',
    ResetPage: '/reset-password',
    ResetNoFoundPage: '/reset-password/*',
    RecordPage: '/record-management',
    EditRecord: '/record/edit/:id',
    ApproveRecord: '/approve-record',
    ManagementList: '/management-contract',
    ETMContractDetail: '/entrustment-contract/detail/:id',
    AddETMContract: '/entrustment-contract/detail/add',
    ETMContractCopy: '/entrustment-contract/copy/:id',
    AuthorizedManagement: '/authorized-contract',
    AuthorizedContractDetail: '/authorized-contract/detail/:id',
    PlaylistManagement: '/playlist-management',
    PlaylistDetail: '/playlist-detail/:id',
    EditPlaylistDetail: '/playlist-detail/edit/:id',
    AddPlaylist: '/playlist/add',
    AddRecordPlaylist: '/playlist-detail/:id/add-record',
    PlaylistSchedule: '/playlist-schedule',
    PlaylistScheduleDetail: '/playlist-schedule/detail/:id',
    PlaylistScheduleEdit: '/playlist-schedule/detail/edit/:id',
    ApplySchedule: '/playlist-schedule/detail/edit/:id/apply-schedule',
    AddPlaylistSchedule: '/playlist-schedule/add',
    Unit: '/unit/management',
    EditUnit: '/unit/management/detail/:id',
    AddUserOfUnit: '/unit/management/detail/:id/add-user',
    UserOfUnitDetail: '/unit/management/detail/:contractId/user-detail/:userId',
    EditUserOfUnit: '/unit/management/detail/:contractId/user-detail/:userId/edit',
    AuthorizedContract: '/authorized-contract-management',
    AddAuthorizedContract: '/authorized-contract-management/add',
    EidtAuthorizedContract: '/authorized-contract-management/edit/:id',
    DeviceManagement: '/device-management',
    DeviceDetail: '/device-management/detail/:id',
    AddDevice: '/device-management/add',
    RevenueManagement: '/revenue-management',
    RevenueReport: '/revenue-report',
    RevenueReportDetail: '/revenue-report/detail',
    RevenueContractReportDetail: '/revenue-report/detail/contract/:id',
    RevenueDetail: '/revenue-management/detail/:id',
    UserAuthorizationManagement: '/user-authorization-management',
    UserRoleManagemet: '/user-role-management',
    EditUser: '/user-management/edit/:id',
    AddUser: '/user-management/add',
    EditRole: '/user-role-edit/:id',
    AddRole: '/user-role-add',
    Config: '/config-setting',
    ConfigCategories: '/config/categories',
    EditCategories: '/config/categories/edit',
    ConfigContract: '/config/contract',
    ConfigEditContract: '/config/contract/edit-expired-warning-date',
    ConfigEditTypeContract: '/config/contract/edit-type-contract',
    ConfigForControlCircle: '/config/for-control-circle',
    SupportDownload: '/support/download',
    SupportFeedback: '/support/feedback',
    SupportUserManual: '/support/user-manual',
    HistoryForControl: '/revenue/history-for-control',
    HistoryForControlDetail: '/revenue/history-for-control/detail/:id',
}