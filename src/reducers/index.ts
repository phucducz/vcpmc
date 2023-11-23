import { combineReducers } from "redux";

import { userReducer } from "./user";
import { roleReducer } from "./role";
import { recordReducer } from "./record";
import { typeReducer } from "./type";

export const rootReducer = combineReducers({
    user: userReducer,
    role: roleReducer,
    record: recordReducer,
    type: typeReducer
});