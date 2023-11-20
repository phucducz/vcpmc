import { combineReducers } from "redux";

import { userReducer } from "./user";
import { roleReducer } from "./role";

export const rootReducer = combineReducers({
    user: userReducer,
    role: roleReducer
});