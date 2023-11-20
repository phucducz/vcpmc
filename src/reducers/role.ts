import { createSlice } from "@reduxjs/toolkit";
import { getRoles } from "~/thunk/roleThunk";

export type Role = {
    id: string;
    role: string;
}

type InitialStateType = {
    roleList: Array<Role>;
    loading: boolean
}

const initialState: InitialStateType = {
    roleList: [],
    loading: false
}

const roleSlice = createSlice({
    name: 'role',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getRoles.pending, (state) => {
                state.loading = true;
            })
            .addCase(getRoles.fulfilled, (state: InitialStateType, action) => {
                if (action.payload) {
                    state.loading = false;
                    state.roleList = action.payload;
                }
            })
            .addCase(getRoles.rejected, (state, action) => {
                state.loading = false;
                console.log(new Error(`${action.error.name}: ${action.error.message}`));
            })
    }
});

export const { reducer: roleReducer } = roleSlice;