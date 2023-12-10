import { addDoc, collection, getDocs } from "firebase/firestore";
import { firestoreDatabase } from "~/config/firebase";
import { Playlist } from "./playlistAPI";
import { updateService } from "~/service";
import { PlaylistScheduleDetail } from "~/pages/PlaylistSchedule/Edit";
import { UpdateTimeScheduleParams } from "~/thunk/playlistSchedule";

export type SchedulePlaylistDetail = {
    id: string;
    name: string;
    playbackTime: string;
    playlist: SchedulePlaylist[];
}

export type SchedulePlaylist = {
    playbackCycle: PlaybackCycle[];
    playlistDetail: Playlist
}

export type PlaybackCycle = {
    day: string;
    time: string[];
}

type OwnPlaylist = {
    playbackCycle: PlaybackCycle[];
    // playbackCycle: string[];
    playlistsId: string;
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

export const saveSchedulePlaylist = async (data: Omit<UpdateTimeScheduleParams, 'navigate'>) => {
    console.log(data);
    if (data.id !== '')
        return await updateService('playlistSchedules', data);

    return await addDoc(collection(firestoreDatabase, 'playlistSchedules'), { ...data });
}