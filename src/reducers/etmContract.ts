import { createSlice } from "@reduxjs/toolkit";

import { EtmContract, EtmContractDetail } from "~/api/etmContractAPI";
import { cancelEntrustmentContract, getETMContractById, getEtmContractList, getEtmContractListDetail, saveEntrustmentContract } from "~/thunk/etmContractThunk";

type InitialState = {
    etmContractList: Array<EtmContract>;
    loading: boolean;
    etmContract: EtmContract;
    etmContractsDetail: Array<EtmContractDetail>;
}

const initialState: InitialState = {
    etmContractList: [],
    loading: false,
    etmContract: {} as EtmContract,
    etmContractsDetail: [] as EtmContractDetail[]
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
        builder.addCase(getEtmContractListDetail.pending, state => {
            state.loading = true;
        });
        builder.addCase(getEtmContractListDetail.fulfilled, (state, action) => {
            state.loading = false;
            state.etmContractsDetail = action.payload;
        });
        builder.addCase(getEtmContractListDetail.rejected, (state, action) => {
            state.loading = false;
            throw new Error(`${action.error.name}: ${action.error.message}`);
        });
    }
});

export const { reducer: etmContractReducer } = etmContractSlice;