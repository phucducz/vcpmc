import { createSlice } from "@reduxjs/toolkit";
import { Role } from "~/api/roleAPI";
import { addRole, deleteRole, getRoles, updateRole } from "~/thunk/roleThunk";

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
                throw new Error(`${action.error.name}: ${action.error.message}`);
            })
            .addCase(updateRole.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateRole.fulfilled, (state: InitialStateType, action) => {
                state.loading = false;
            })
            .addCase(updateRole.rejected, (state, action) => {
                state.loading = false;
                throw new Error(`${action.error.name}: ${action.error.message}`);
            })
            .addCase(addRole.pending, (state) => {
                state.loading = true;
            })
            .addCase(addRole.fulfilled, (state: InitialStateType, action) => {
                state.loading = false;
            })
            .addCase(addRole.rejected, (state, action) => {
                state.loading = false;
                throw new Error(`${action.error.name}: ${action.error.message}`);
            })
            .addCase(deleteRole.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteRole.fulfilled, (state: InitialStateType, action) => {
                state.loading = false;
            })
            .addCase(deleteRole.rejected, (state, action) => {
                state.loading = false;
                throw new Error(`${action.error.name}: ${action.error.message}`);
            })
    }
});

export const { reducer: roleReducer } = roleSlice;