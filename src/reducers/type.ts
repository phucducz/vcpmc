import { createSlice } from "@reduxjs/toolkit";

import { Type } from "~/api/typeAPI";
import { getTypes } from "~/thunk/typeThunk";

type InitialStateType = {
    typeList: Array<Type>;
    loading: boolean
}

const initialState: InitialStateType = {
    typeList: [],
    loading: false
}

const typeSlice = createSlice({
    name: 'type',
    initialState,
    reducers: {

    },
    extraReducers: builder => {
        builder.addCase(getTypes.pending, state => {
            state.loading = true;
        });
        builder.addCase(getTypes.fulfilled, (state, action) => {
            state.loading = false;

            if (action.payload)
                state.typeList = action.payload;
        });
        builder.addCase(getTypes.rejected, (state, action) => {
            state.loading = false;
            throw new Error(`${action.error.name}: ${action.error.message}`);
        });
    }
});

export const { reducer: typeReducer } = typeSlice;