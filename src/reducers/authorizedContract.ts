import { createSlice } from "@reduxjs/toolkit";

import { AuthorizedContractDetail, ContractDetail } from "~/api/authorizedContract";
import { addAuthoziedContract, cancelAuthoziedContract, getAuthorizedContracts, updateAuthorizedContract } from "~/thunk/authorizedContractThunk";

type InitialStateType = {
    contracts: Array<AuthorizedContractDetail>;
    loading: boolean;
    contractDetails: Array<ContractDetail>;
}

const initialState: InitialStateType = {
    contracts: [],
    loading: false,
    contractDetails: []
}

const authorizedContractSlice = createSlice({
    name: 'authorizedContractSlice',
    initialState,
    reducers: {
        setContractsDetail: (state, action) => {
            state.contractDetails = action.payload;
        }
    },
    extraReducers: builder => {
        builder.addCase(getAuthorizedContracts.pending, state => {
            state.loading = true;
        });
        builder.addCase(getAuthorizedContracts.fulfilled, (state, action) => {
            state.loading = false;
            state.contracts = action.payload;
        });
        builder.addCase(getAuthorizedContracts.rejected, (state, action) => {
            state.loading = false;
            throw new Error(`${action.error.name}: ${action.error.message}`);
        });
        builder.addCase(updateAuthorizedContract.pending, state => {
            state.loading = true;
        });
        builder.addCase(updateAuthorizedContract.fulfilled, (state) => {
            state.loading = false;
        });
        builder.addCase(updateAuthorizedContract.rejected, (state, action) => {
            state.loading = false;
            throw new Error(`${action.error.name}: ${action.error.message}`);
        });
        builder.addCase(addAuthoziedContract.pending, state => {
            state.loading = true;
        });
        builder.addCase(addAuthoziedContract.fulfilled, (state) => {
            state.loading = false;
        });
        builder.addCase(addAuthoziedContract.rejected, (state, action) => {
            state.loading = false;
            throw new Error(`${action.error.name}: ${action.error.message}`);
        });
        builder.addCase(cancelAuthoziedContract.pending, state => {
            state.loading = true;
        });
        builder.addCase(cancelAuthoziedContract.fulfilled, (state) => {
            state.loading = false;
        });
        builder.addCase(cancelAuthoziedContract.rejected, (state, action) => {
            state.loading = false;
            throw new Error(`${action.error.name}: ${action.error.message}`);
        });
    }
});

export const { reducer: authorizedContractReducer } = authorizedContractSlice;
export const { setContractsDetail } = authorizedContractSlice.actions;