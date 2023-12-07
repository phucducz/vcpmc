import { createAsyncThunk } from "@reduxjs/toolkit";

import { getSchedules } from "~/api/playlistScheduleAPI";

export const getScheduleList = createAsyncThunk(
    'playlistSchedule/getScheduleList',
    async () => {
        return await getSchedules();
    }
);