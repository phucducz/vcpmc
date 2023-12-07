import { createAsyncThunk } from "@reduxjs/toolkit";

import { Playlist, deletePlaylistAPI, getPlaylists, savePlaylist } from "~/api/playlistAPI";
import { deletePlaylistRecords } from "./playlistsRecordsThunk";

export const getPlaylistList = createAsyncThunk(
    'playlist/getPlaylistList',
    async () => {
        return await getPlaylists();
    }
);

export const savePlaylistList = createAsyncThunk(
    'playlist/savePlaylistList',
    async ({ playlist }: { playlist: Omit<Playlist, 'id' | 'createdBy'> & { createdBy: string } }) => {
        return await savePlaylist({ playlist });
    }
);

type DeletePlaylistParams = {
    playlistId: string;
    playlistRecordsId: string;
    navigate: () => void;
}

export const deletePlaylist = createAsyncThunk(
    'playlist/deletePlaylist',
    async ({ playlistId, playlistRecordsId, navigate }: DeletePlaylistParams, thunkAPI) => {
        await deletePlaylistAPI(playlistId);
        thunkAPI.dispatch(deletePlaylistRecords({ playlistRecordsId, navigate }));
    }
);