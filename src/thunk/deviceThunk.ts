import { createAsyncThunk } from "@reduxjs/toolkit";
import { Device, addDeviceAPI, changePasswordDeviceById, changeStatusDeviceById, deleteDevicesAPI, getDevices, restoreMemoryById, updateDeviceById } from "~/api/deviceAPI";

export const getDeviceList = createAsyncThunk(
    'device/getDeviceList',
    async () => {
        return await getDevices();
    }
);

export const changeStatusDevice = createAsyncThunk(
    'device/changeStatusDevice',
    async ({ data }: { data: Array<Pick<Device, 'status' | 'id'>> }, thunkAPI) => {
        await changeStatusDeviceById({ data });
        thunkAPI.dispatch(getDeviceList());
    }
);

export const updateDevice = createAsyncThunk(
    'device/updateDevice',
    async ({ data, navigate }: { data: Pick<Device, 'id' | 'status' | 'SKUID' | 'macAddress' | 'name' | 'operatingLocation' | 'userName'>, navigate: () => void }) => {
        await updateDeviceById({ data });
        navigate();
    }
);

export const restoreMemory = createAsyncThunk(
    'device/restoreMemory',
    async (data: Pick<Device, 'id' | 'memory'>, thunkAPI) => {
        if (data.id === '')
            return;
        await restoreMemoryById(data);
        thunkAPI.dispatch(getDeviceList());
    }
);

export const changePasswordDevice = createAsyncThunk(
    'device/changePasswordDevice',
    async (data: Pick<Device, 'id' | 'password'>, thunkAPI) => {
        console.log(data);
        
        if (data.id === '')
            return;
        await changePasswordDeviceById(data);
        thunkAPI.dispatch(getDeviceList());
    }
);

export const addDevice = createAsyncThunk(
    'device/addDevice',
    async ({ data, navigate }: { data: Omit<Device, 'lastestVersion' | 'id'>, navigate: () => void }) => {
        await addDeviceAPI(data);
        navigate();
    }
);

export const deleteDevices = createAsyncThunk(
    'device/deleteDevice',
    async (data: Array<Pick<Device, 'id'>>, thunkAPI) => {
        await deleteDevicesAPI(data);
        thunkAPI.dispatch(getDeviceList());
    }
);