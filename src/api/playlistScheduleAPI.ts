import { collection, getDocs } from "firebase/firestore";
import { firestoreDatabase } from "~/config/firebase";
import { Playlist } from "./playlistAPI";

export type SchedulePlaylistDetail = {
    id: string;
    name: string;
    playbackTime: string;
    playlist: SchedulePlaylist[];
}

export type SchedulePlaylist = {
    playbackCycle: string[];
    time: string[];
    playlistDetail: Playlist
}

type OwnPlaylist = {
    playbackCycle: string[];
    playlistsId: string;
    time: string[];
}

export type PlaylistSchedule = {
    id: string;
    name: string;
    playbackTime: string;
    playlistsIds: OwnPlaylist[];
}

export const getSchedules = async () => {
    const resultSnapshot = getDocs(collection(firestoreDatabase, 'playlistSchedules'));

    return (await resultSnapshot).docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        playbackTime: doc.data().playbackTime,
        playlistsIds: doc.data().playlistsIds
    }));
}