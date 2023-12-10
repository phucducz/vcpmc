import { createSlice } from "@reduxjs/toolkit";

import { Device } from "~/api/deviceAPI";
import { getDeviceList } from "~/thunk/deviceThunk";

type InitialStateType = {
    devices: Array<Device>;
    loading: boolean;
}

const initialState: InitialStateType = {
    devices: [],
    loading: false
}

export const deviceSlice = createSlice({
    name: 'device',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(getDeviceList.pending, state => {
            state.loading = true;
        });
        builder.addCase(getDeviceList.fulfilled, (state, action) => {
            state.loading = false;

            if (action.payload)
                state.devices = action.payload;
        });
        builder.addCase(getDeviceList.rejected, (state, action) => {
            state.loading = false;
            throw new Error(`${action.error.name}: ${action.error.message}`);
        });
    }
});

export const { reducer: deviceReducer } = deviceSlice;