import { createSlice } from "@reduxjs/toolkit";

import { PlaylistRecordDetail, PlaylistsRecords } from "~/api/playlistsRecords";
import { getPlaylistsRecordsList } from "~/thunk/playlistsRecordsThunk";

export type PlaylistRecordInitialState = {
    playlistsRecords: Array<PlaylistsRecords>;
    loading: boolean;
    playlistsRecordsDetail: Array<PlaylistRecordDetail>;
}

const initialState: PlaylistRecordInitialState = {
    playlistsRecords: [],
    loading: false,
    playlistsRecordsDetail: []
}

const playlistRecordsSlice = createSlice({
    name: 'playlistsRecords',
    initialState,
    reducers: {
        setPlaylistsRecordsDetail: (state, action) => {
            state.playlistsRecordsDetail = action.payload;
        }
    },
    extraReducers: builder => {
        builder.addCase(getPlaylistsRecordsList.pending, state => {
            state.loading = true;
        });
        builder.addCase(getPlaylistsRecordsList.fulfilled, (state, action) => {
            state.loading = false;
            state.playlistsRecords = action.payload;
        });
        builder.addCase(getPlaylistsRecordsList.rejected, (state, action) => {
            state.loading = false;
            throw new Error(`${action.error.name}: ${action.error.message}`);
        });
    }
});

export const { reducer: playlistsRecordsReducer } = playlistRecordsSlice;

export const { setPlaylistsRecordsDetail } = playlistRecordsSlice.actions;