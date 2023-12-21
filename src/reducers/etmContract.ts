import { createSlice } from "@reduxjs/toolkit";

import { ETMContractType, EtmContract, EtmContractDetail } from "~/api/etmContractAPI";
import { QUARTERLY } from "~/constants";
import { addEtmContractType, cancelEntrustmentContract, deleteEtmContractType, getETMContractById, getEtmContractList, getEtmContractListDetail, getEtmContractTypes, saveEntrustmentContract, updateEtmContractTypes } from "~/thunk/etmContractThunk";

export type Quarterly = {
    quarter: string;
    time: string;
}

export type Monthly = {
    start: string;
    end: string;
}

type InitialState = {
    etmContractList: Array<EtmContract>;
    loading: boolean;
    etmContract: EtmContract;
    etmContractsDetail: Array<EtmContractDetail>;
    expiredWarningDate: number;
    types: Array<ETMContractType>;
    forControlCircle:
    { type: string, controlCircle: Array<Quarterly> } |
    { type: string, controlCircle: Monthly };
}

const initialState: InitialState = {
    etmContractList: [],
    loading: false,
    etmContract: {} as EtmContract,
    etmContractsDetail: [] as EtmContractDetail[],
    expiredWarningDate: 365,
    types: [] as Array<ETMContractType>,
    forControlCircle: {
        type: 'quarterly',
        controlCircle: QUARTERLY
    }
}

const etmContractSlice = createSlice({
    name: 'etmContract',
    initialState,
    reducers: {
        setExpiredWarningDate: (state, action) => {
            state.expiredWarningDate = action.payload.expirationDate;
            action.payload.navigate();
        },
        setForControlCircle: (state, action) => {
            state.forControlCircle = action.payload;
        }
    },
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
        builder.addCase(getEtmContractTypes.pending, state => {
            state.loading = true;
        });
        builder.addCase(getEtmContractTypes.fulfilled, (state, action) => {
            state.loading = false;
            state.types = action.payload;
        });
        builder.addCase(getEtmContractTypes.rejected, (state, action) => {
            state.loading = false;
            throw new Error(`${action.error.name}: ${action.error.message}`);
        });
        builder.addCase(updateEtmContractTypes.pending, state => {
            state.loading = true;
        });
        builder.addCase(updateEtmContractTypes.fulfilled, (state) => {
            state.loading = false;
        });
        builder.addCase(updateEtmContractTypes.rejected, (state, action) => {
            state.loading = false;
            throw new Error(`${action.error.name}: ${action.error.message}`);
        });
        builder.addCase(addEtmContractType.pending, state => {
            state.loading = true;
        });
        builder.addCase(addEtmContractType.fulfilled, (state) => {
            state.loading = false;
        });
        builder.addCase(addEtmContractType.rejected, (state, action) => {
            state.loading = false;
            throw new Error(`${action.error.name}: ${action.error.message}`);
        });
        builder.addCase(deleteEtmContractType.pending, state => {
            state.loading = true;
        });
        builder.addCase(deleteEtmContractType.fulfilled, (state) => {
            state.loading = false;
        });
        builder.addCase(deleteEtmContractType.rejected, (state, action) => {
            state.loading = false;
            throw new Error(`${action.error.name}: ${action.error.message}`);
        });
    }
});

export const { reducer: etmContractReducer } = etmContractSlice;
export const { setExpiredWarningDate, setForControlCircle } = etmContractSlice.actions;