import { createSlice } from "@reduxjs/toolkit";
import { Approval } from "~/api/approvalAPI";
import { approveRecordList, getApprovalList } from "~/thunk/approvalThunk";

type InitialStateType = {
    approvalList: Array<Approval>;
    loading: boolean;
}

const initialState: InitialStateType = {
    approvalList: [],
    loading: false
}

const approvalSlice = createSlice({
    name: 'approval',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getApprovalList.pending, state => {
            state.loading = true;
        });
        builder.addCase(getApprovalList.fulfilled, (state, action) => {
            state.loading = false;

            if (action.payload)
                state.approvalList = action.payload;
        });
        builder.addCase(getApprovalList.rejected, (state, action) => {
            state.loading = false;
            throw new Error(`${action.error.name}: ${action.error.message}`);
        });
        builder.addCase(approveRecordList.pending, state => {
            state.loading = true;
        });
        builder.addCase(approveRecordList.fulfilled, state => {
            state.loading = false;
        });
        builder.addCase(approveRecordList.rejected, (state, action) => {
            state.loading = false;
            throw new Error(`${action.error.name}: ${action.error.message}`);
        });
    },
});

export const { reducer: approvalReducer } = approvalSlice;