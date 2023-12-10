import { createSlice } from "@reduxjs/toolkit";
import { ScheduleDevice } from "~/api/scheduleDevice";
import { getScheduleDeviceList, saveScheduleDevice } from "~/thunk/scheduleDeviceThunk";

export type ScheduleDeviceInitialStateType = {
    scheduleDevices: Array<ScheduleDevice>;
    loading: boolean;
}

const initialState: ScheduleDeviceInitialStateType = {
    scheduleDevices: [],
    loading: false,
}

export const scheduleDeviceSlice = createSlice({
    name: 'scheduleDevice',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(saveScheduleDevice.pending, (state) => {
            state.loading = true;
        })
        builder.addCase(saveScheduleDevice.fulfilled, (state) => {
            state.loading = false;
        })
        builder.addCase(saveScheduleDevice.rejected, (state, action) => {
            state.loading = false;
            console.log(new Error(`${action.error.name}: ${action.error.message}`));
        })
        builder.addCase(getScheduleDeviceList.pending, (state) => {
            state.loading = true;
        })
        builder.addCase(getScheduleDeviceList.fulfilled, (state, action) => {
            state.loading = false;
            state.scheduleDevices = action.payload;
        })
        builder.addCase(getScheduleDeviceList.rejected, (state, action) => {
            state.loading = false;
            console.log(new Error(`${action.error.name}: ${action.error.message}`));
        })
        // builder.addCase(updateTimeSchedule.pending, (state) => {
        //     state.loading = true;
        // })
        // builder.addCase(updateTimeSchedule.fulfilled, (state) => {
        //     state.loading = false;
        // })
        // builder.addCase(updateTimeSchedule.rejected, (state, action) => {
        //     state.loading = false;
        //     console.log(new Error(`${action.error.name}: ${action.error.message}`));
        // })
    }
});

export const { reducer: scheduleDeviceReducer } = scheduleDeviceSlice;