import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";

import { Playlist } from "~/api/playlistAPI";
import { PlaylistRecordDetail, PlaylistsRecords } from "~/api/playlistsRecords";
import { Record } from "~/api/recordAPI";
import { editPlaylist, editRecordsPlaylist, getPlaylistsRecordsList, removeRecord } from "~/thunk/playlistsRecordsThunk";

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
        },
        getPlaylistsRecordsDetail: (state, action) => {
            const { playlist, playlistsRecords, record } = action.payload;
            
            let playlistRecordList: Array<PlaylistRecordDetail> = [] as Array<PlaylistRecordDetail>;

            playlistsRecords.playlistsRecords.forEach((playlistRecord: PlaylistsRecords) => {
                let playlistItem: Playlist = playlist.playlist.find((playlistItem: Playlist) =>
                    playlistRecord.playlistsId === playlistItem.id
                ) || {} as Playlist;

                let recordList: Array<Record> = playlistRecord.recordsId.map(recordId => {
                    return record.recordList.find((record: Record) => recordId === record.id) || {} as Record;
                });

                let momentTime = moment
                    ("00000000", "hh:mm:ss")
                    .utcOffset(0)
                    .set({ hour: 0, minute: 0, second: 0, millisecond: 0 });

                let quantity = recordList.reduce((total: number, record: Record) => {
                    let timeSplit = record.time.split(':');

                    momentTime.add("minutes", timeSplit[0]).add("seconds", timeSplit[1]);
                    return total + 1;
                }, 0);

                playlistRecordList.push({
                    playlist: { ...playlistItem },
                    records: recordList,
                    playlistId: playlistItem.id,
                    playlistRecordId: playlistRecord.id,
                    quantity: quantity,
                    totalTime: momentTime.toISOString().split('T')[1].slice(0, 8)
                });

                state.playlistsRecordsDetail = playlistRecordList;
            });
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
        builder.addCase(removeRecord.pending, state => {
            state.loading = true;
        });
        builder.addCase(removeRecord.fulfilled, (state, action) => {
            state.loading = false;
        });
        builder.addCase(removeRecord.rejected, (state, action) => {
            state.loading = false;
            throw new Error(`${action.error.name}: ${action.error.message}`);
        });
        builder.addCase(editPlaylist.pending, state => {
            state.loading = true;
        });
        builder.addCase(editPlaylist.fulfilled, (state) => {
            state.loading = false;
        });
        builder.addCase(editPlaylist.rejected, (state, action) => {
            state.loading = false;
            throw new Error(`${action.error.name}: ${action.error.message}`);
        });
        builder.addCase(editRecordsPlaylist.pending, state => {
            state.loading = true;
        });
        builder.addCase(editRecordsPlaylist.fulfilled, (state) => {
            state.loading = false;
        });
        builder.addCase(editRecordsPlaylist.rejected, (state, action) => {
            state.loading = false;
            throw new Error(`${action.error.name}: ${action.error.message}`);
        });
    }
});

export const { reducer: playlistsRecordsReducer } = playlistRecordsSlice;

export const { setPlaylistsRecordsDetail, getPlaylistsRecordsDetail } = playlistRecordsSlice.actions;