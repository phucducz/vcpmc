import { collection, getDocs } from "firebase/firestore";

import { firestoreDatabase } from "~/config/firebase";
import { Playlist } from "./playlistAPI";
import { Record } from "./recordAPI";

export type PlaylistsRecords = {
    id: string;
    playlistsId: string;
    recordsId: Array<string>;
}

export type PlaylistRecordDetail = {
    playlist: Omit<Playlist, 'id'> & { imageURL: string };
    records: Array<Record>;
} & { quantity: number, totalTime: string, playlistId: string, playlistRecordId: string };

export const getPlaylistsRecords = async () => {
    const resultSnapshot = getDocs(collection(firestoreDatabase, 'playlists_records'));

    return (await resultSnapshot).docs.map(doc => ({
        id: doc.id,
        recordsId: doc.data().recordsId,
        playlistsId: doc.data().playlistsId
    }));
}