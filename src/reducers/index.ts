import { combineReducers } from "redux";

import { userReducer } from "./user";
import { roleReducer } from "./role";
import { recordReducer } from "./record";
import { categoryReducer } from "./category";
import { approvalReducer } from "./approval";
import { etmContractReducer } from "./etmContract";

export const rootReducer = combineReducers({
    user: userReducer,
    role: roleReducer,
    record: recordReducer,
    category: categoryReducer,
    approval: approvalReducer,
    etmContract: etmContractReducer
});