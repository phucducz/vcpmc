import { createSlice } from "@reduxjs/toolkit";

import { Record } from "~/api/recordAPI";
import { getRecords, saveRecord } from "~/thunk/recordThunks";

type InitialStateType = {
    recordList: Array<Record>;
    loading: boolean;
    status: 'fetch success' | 'fetch fail' | ''
}

const initialState: InitialStateType = {
    recordList: [],
    loading: false,
    status: ''
}

const recordSlice = createSlice({
    name: 'record',
    initialState,
    reducers: {

    },
    extraReducers: builder => {
        builder.addCase(getRecords.pending, state => {
            state.loading = true;
        });
        builder.addCase(getRecords.fulfilled, (state, action) => {
            state.loading = false;

            if (action.payload) {
                state.recordList = action.payload;
                state.status = 'fetch success';
            }
        });
        builder.addCase(getRecords.rejected, (state, action) => {
            state.loading = false;
            state.status = 'fetch fail';
            throw new Error(`${action.error.name}: ${action.error.message}`);
        });
        builder.addCase(saveRecord.pending, state => {
            state.loading = true;
        });
        builder.addCase(saveRecord.fulfilled, state => {
            state.loading = false;
        });
        builder.addCase(saveRecord.rejected, (state, action) => {
            state.loading = false;
            throw new Error(`${action.error.name}: ${action.error.message}`);
        });
    }
});

export const { reducer: recordReducer } = recordSlice;