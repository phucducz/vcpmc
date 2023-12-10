import { createAsyncThunk } from "@reduxjs/toolkit";
import { getDevices } from "~/api/deviceAPI";

export const getDeviceList = createAsyncThunk(
    'device/getDeviceList',
    async () => {
        return await getDevices();
    }
);