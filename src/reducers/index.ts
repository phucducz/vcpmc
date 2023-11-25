import { combineReducers } from "redux";

import { userReducer } from "./user";
import { roleReducer } from "./role";
import { recordReducer } from "./record";
import { categoryReducer } from "./category";

export const rootReducer = combineReducers({
    user: userReducer,
    role: roleReducer,
    record: recordReducer,
    category: categoryReducer
});