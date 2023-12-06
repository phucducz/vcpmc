import { createAsyncThunk } from "@reduxjs/toolkit";

import { getPlaylists } from "~/api/playlistAPI";

export const getPlaylistList = createAsyncThunk(
    'playlist/getPlaylistList',
    async () => {
        return await getPlaylists();
    }
);