import { collection, getDocs } from "firebase/firestore";
import { firestoreDatabase } from "~/config/firebase";

export type Device = {
    id: string;
    SKUID: string;
    expirationDate: string;
    macAddress: string;
    memory: string;
    name: string;
    operatingLocation: string;
    status: string;
    unitsUsed: string;
    userName: string;
}

export const getDevices = async () => {
    const resultSnapshot = getDocs(collection(firestoreDatabase, 'devices'));

    return (await resultSnapshot).docs.map(doc => ({
        id: doc.id,
        SKUID: doc.data().SKUID,
        expirationDate: doc.data().expirationDate,
        macAddress: doc.data().macAddress,
        memory: doc.data().memory,
        name: doc.data().name,
        operatingLocation: doc.data().operatingLocation,
        status: doc.data().status,
        unitsUsed: doc.data().unitsUsed,
        userName: doc.data().userName,
    }));
}