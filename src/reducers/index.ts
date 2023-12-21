import { combineReducers } from "redux";

import { userReducer } from "./user";
import { roleReducer } from "./role";
import { recordReducer } from "./record";
import { categoryReducer } from "./category";
import { approvalReducer } from "./approval";
import { etmContractReducer } from "./etmContract";
import { playlistReducer } from "./playlist";
import { playlistsRecordsReducer } from "./playlistsRecords";
import { playlistScheduleReducer } from "./playlistSchedule";
import { deviceReducer } from "./device";
import { scheduleDeviceReducer } from "./scheduleDevice";
import { authorizedContractReducer } from "./authorizedContract";
import { recordPlaysReducer } from "./recordPlay";
import { functionalReducer } from "./functional";
import { feedBackReducer } from "./feedback";

export const rootReducer = combineReducers({
    user: userReducer,
    role: roleReducer,
    record: recordReducer,
    category: categoryReducer,
    approval: approvalReducer,
    etmContract: etmContractReducer,
    playlist: playlistReducer,
    playlistsRecords: playlistsRecordsReducer,
    playlistSchedule: playlistScheduleReducer,
    device: deviceReducer,
    scheduleDevice: scheduleDeviceReducer,
    authorized: authorizedContractReducer,
    recordPlay: recordPlaysReducer,
    functional: functionalReducer,
    feedback: feedBackReducer,
});