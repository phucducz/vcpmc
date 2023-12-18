import { createSlice } from "@reduxjs/toolkit";
import { RecordPlays } from "~/api/recordPlay";
import { getRecordPlays } from "~/thunk/recordPlayThunk";

type InitialStateType = {
    recordPlays: Array<RecordPlays>;
    loading: boolean;
}

const initialState: InitialStateType = {
    recordPlays: [],
    loading: false
}

const recordPlaySlice = createSlice({
    name: 'recordPlay',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(getRecordPlays.pending, state => {
            state.loading = true;
        });
        builder.addCase(getRecordPlays.fulfilled, (state, action) => {
            state.loading = false;

            if (action.payload)
                state.recordPlays = action.payload;
        });
        builder.addCase(getRecordPlays.rejected, (state, action) => {
            state.loading = false;
            throw new Error(`${action.error.name}: ${action.error.message}`);
        });
    }
});

export const { reducer: recordPlaysReducer } = recordPlaySlice;