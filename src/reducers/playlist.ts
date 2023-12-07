import { createSlice } from "@reduxjs/toolkit";
import { AsyncThunkFulfilledActionCreator } from "@reduxjs/toolkit/dist/createAsyncThunk";

import { Playlist } from "~/api/playlistAPI";
import { deletePlaylist, getPlaylistList } from "~/thunk/playlistThunk";

export type PlaylistInitialState = {
    playlist: Array<Playlist>;
    loading: boolean
}

const initialState: PlaylistInitialState = {
    playlist: [],
    loading: false
}

const playlistSlice = createSlice({
    name: 'playlist',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(getPlaylistList.pending, state => {
            state.loading = true;
        });
        builder.addCase(getPlaylistList.fulfilled,  (state, action) => {
            state.loading = false;
            state.playlist = action.payload;
        });
        builder.addCase(getPlaylistList.rejected, (state, action) => {
            state.loading = false;
            throw new Error(`${action.error.name}: ${action.error.message}`);
        });
        builder.addCase(deletePlaylist.pending, state => {
            state.loading = true;
        });
        builder.addCase(deletePlaylist.fulfilled,  (state, action) => {
            state.loading = false;
        });
        builder.addCase(deletePlaylist.rejected, (state, action) => {
            state.loading = false;
            throw new Error(`${action.error.name}: ${action.error.message}`);
        });
    }
});

export const { reducer: playlistReducer } = playlistSlice;