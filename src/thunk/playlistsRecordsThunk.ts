import { createAsyncThunk } from "@reduxjs/toolkit";

import { getPlaylistsRecords } from "~/api/playlistsRecords";

export const getPlaylistsRecordsList = createAsyncThunk(
    'playlistsRecords/getPlaylistsRecordsList',
    async () => {
        return await getPlaylistsRecords();
    }
);

// export const getPlaylistsRecordsDetails = createAsyncThunk(
//     'playlistsRecords/getPlaylistsRecordsDetails',
//     async ({ playlistsRecords, playlist, record }: {
//         playlistsRecords: PlaylistRecordInitialState,
//         playlist: PlaylistInitialState,
//         record: RecordInitialState
//     }) => {
//         let playlistRecordList: Array<PlaylistRecordDetail> = [] as Array<PlaylistRecordDetail>;

//         playlistsRecords.playlistsRecords.forEach((playlistRecord: PlaylistsRecords) => {
//             let playlistItem: Playlist = playlist.playlist.find((playlistItem: Playlist) =>
//                 playlistRecord.playlistsId === playlistItem.id
//             ) || {} as Playlist;

//             let recordList: Array<Record> = playlistRecord.recordsId.map(recordId => {
//                 return record.recordList.find((record: Record) => recordId === record.id) || {} as Record;
//             });

//             let momentTime = moment
//                 ("00000000", "hh:mm:ss")
//                 .utcOffset(0)
//                 .set({ hour: 0, minute: 0, second: 0, millisecond: 0 });

//             let quantity = recordList.reduce((total: number, record: Record) => {
//                 let timeSplit = record.time.split(':');

//                 momentTime.add("minutes", timeSplit[0]).add("seconds", timeSplit[1]);
//                 return total + 1;
//             }, 0);

//             playlistRecordList.push({
//                 playlist: { ...playlistItem, imageURL: recordList[0].imageURL },
//                 records: recordList,
//                 playlistId: playlistItem.id,
//                 playlistRecordId: playlistRecord.id,
//                 quantity: quantity,
//                 totalTime: momentTime.toISOString().split('T')[1].slice(0, 8)
//             });
//         });
//     }
// );