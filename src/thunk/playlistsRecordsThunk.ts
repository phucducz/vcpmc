import { createAsyncThunk } from "@reduxjs/toolkit";
import { Playlist, editPlaylistAPI } from "~/api/playlistAPI";

import { RemoveRecordParam, editRecordsInPlaylist, getPlaylistsRecords, removeRecordAPI } from "~/api/playlistsRecords";
import { getPlaylistList } from "./playlistThunk";

export const getPlaylistsRecordsList = createAsyncThunk(
    'playlistsRecords/getPlaylistsRecordsList',
    async () => {
        return await getPlaylistsRecords();
    }
);

export const removeRecord = createAsyncThunk(
    'playlistsRecords/removeRecord',
    async ({ recordList, recordId, playlistRecordId }: RemoveRecordParam) => {
        return await removeRecordAPI({ recordList, recordId, playlistRecordId });
    }
);

export const editPlaylist = createAsyncThunk(
    'playlistsRecords/editRecord',
    async ({ recordList, playlistRecordId, playlist, navigate }: RemoveRecordParam & {
        playlist: Pick<Playlist, 'description' | 'categories' | 'title' | 'mode' | 'id'>;
        navigate: () => void;
    }, thunkAPI) => {
        await thunkAPI.dispatch(removeRecord({
            recordList: recordList,
            playlistRecordId: playlistRecordId
        }));
        await editPlaylistAPI({ ...playlist });
        await thunkAPI.dispatch(getPlaylistList());
        await thunkAPI.dispatch(getPlaylistsRecordsList());

        navigate();
    }
);

export const editRecordsPlaylist = createAsyncThunk(
    'playlistsRecords/editRecordsPlaylist',
    async (
        { playlistRecordId, recordList, navigate }: Omit<RemoveRecordParam, 'recordId'> & { navigate: () => void },
        thunkAPI
    ) => {
        await editRecordsInPlaylist({ playlistRecordId, recordList });
        await thunkAPI.dispatch(getPlaylistsRecordsList());
        
        navigate();
    }
);