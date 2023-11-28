import { combineReducers } from "redux";

import { userReducer } from "./user";
import { roleReducer } from "./role";
import { recordReducer } from "./record";
import { categoryReducer } from "./category";
import { approvalReducer } from "./approval";

export const rootReducer = combineReducers({
    user: userReducer,
    role: roleReducer,
    record: recordReducer,
    category: categoryReducer,
    approval: approvalReducer
});