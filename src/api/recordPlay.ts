import { collection, getDocs } from "firebase/firestore";
import { firestoreDatabase } from "~/config/firebase";

export type RecordPlays = {
    id: string;
    recordsId: string;
    playsCount: string;
    date: string;
}

export const getRecordPlayList = async () => {
    const resultSnapshot = getDocs(collection(firestoreDatabase, 'recordPlays'));

    return (await resultSnapshot).docs.map(doc => ({
        id: doc.id,
        recordsId: doc.data().recordsId,
        playsCount: doc.data().playsCount,
        date: doc.data().date
    }));
}