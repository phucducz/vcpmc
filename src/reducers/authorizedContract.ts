import { createSlice } from "@reduxjs/toolkit";

import { AuthorizedContractDetailt } from "~/api/authorizedContract";
import { getAuthorizedContracts } from "~/thunk/authorizedContractThunk";

type InitialStateType = {
    contracts: Array<AuthorizedContractDetailt>;
    loading: boolean;
}

const initialState: InitialStateType = {
    contracts: [],
    loading: false
}

const authorizedContractSlice = createSlice({
    name: 'authorizedContractSlice',
    initialState,
    reducers: {},
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
    }
});

export const { reducer: authorizedContractReducer } = authorizedContractSlice;