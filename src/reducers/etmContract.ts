import { createSlice } from "@reduxjs/toolkit";

import { EtmContract } from "~/api/etmContractAPI";
import { cancelEntrustmentContract, getETMContractById, getEtmContractList, saveEntrustmentContract } from "~/thunk/etmContractThunk";

type InitialState = {
    etmContractList: Array<EtmContract>;
    loading: boolean;
    etmContract: EtmContract;
}

const initialState: InitialState = {
    etmContractList: [],
    loading: false,
    etmContract: {} as EtmContract
}

const etmContractSlice = createSlice({
    name: 'etmContract',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(getEtmContractList.pending, state => {
            state.loading = true;
        });
        builder.addCase(getEtmContractList.fulfilled, (state, action) => {
            state.loading = false;

            if (action.payload)
                state.etmContractList = action.payload;
        });
        builder.addCase(getEtmContractList.rejected, (state, action) => {
            state.loading = false;
            throw new Error(`${action.error.name}: ${action.error.message}`);
        });
        builder.addCase(getETMContractById.pending, state => {
            state.loading = true;
        });
        builder.addCase(getETMContractById.fulfilled, (state, action) => {
            state.loading = false;

            if (action.payload)
                state.etmContract = action.payload;
        });
        builder.addCase(getETMContractById.rejected, (state, action) => {
            state.loading = false;
            throw new Error(`${action.error.name}: ${action.error.message}`);
        });
        builder.addCase(saveEntrustmentContract.pending, state => {
            state.loading = true;
        });
        builder.addCase(saveEntrustmentContract.fulfilled, (state, action) => {
            state.loading = false;
        });
        builder.addCase(saveEntrustmentContract.rejected, (state, action) => {
            state.loading = false;
            throw new Error(`${action.error.name}: ${action.error.message}`);
        });
        builder.addCase(cancelEntrustmentContract.pending, state => {
            state.loading = true;
        });
        builder.addCase(cancelEntrustmentContract.fulfilled, (state, action) => {
            state.loading = false;
        });
        builder.addCase(cancelEntrustmentContract.rejected, (state, action) => {
            state.loading = false;
            throw new Error(`${action.error.name}: ${action.error.message}`);
        });
    }
});

export const { reducer: etmContractReducer } = etmContractSlice;