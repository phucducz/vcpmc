import { createAsyncThunk } from "@reduxjs/toolkit";

import { ScheduleDevice, getScheduleDevices, saveScheduleDevices } from "~/api/scheduleDevice";

export const saveScheduleDevice = createAsyncThunk(
    'scheduleDevices/saveScheduleDevice',
    async ({ data, navigate }: { data: Omit<ScheduleDevice, 'schedulesId'>; navigate: () => void }) => {
        await saveScheduleDevices(data);
        
        navigate();
    }
);

export const getScheduleDeviceList = createAsyncThunk(
    'scheduleDevices/getScheduleDeviceList',
    async () => {
        return await getScheduleDevices();
    }
)