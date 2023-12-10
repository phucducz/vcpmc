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
    scheduleDevice: scheduleDeviceReducer
});