import { createAsyncThunk } from "@reduxjs/toolkit";

import { User, changePasswordUserById } from "../api/user";
import { setPassword } from "../reducers/user";

type Params = Pick<User, 'id' | 'password'> & {
    navigate: () => void
}

export const changePassword = createAsyncThunk(
    'user/changePassword',
    async ({ id, password, navigate }: Params, thunkAPI) => {
        await changePasswordUserById({ id: id, password: password });
        await thunkAPI.dispatch(setPassword(password));

        navigate();
    }
);