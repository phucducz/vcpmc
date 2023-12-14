import { addDoc, collection, doc, getDocs, writeBatch } from "firebase/firestore";
import { firestoreDatabase } from "~/config/firebase";
import { updateService } from "~/service";

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
    imageURL: string;
    note: string;
    format: string;
    lastestVersion: Array<string>;
    password: string;
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
        imageURL: doc.data().imageURL,
        note: doc.data().note,
        format: doc.data().format,
        lastestVersion: doc.data().lastestVersion,
        password: doc.data().password
    }));
}

export const changeStatusDeviceById = async ({ data }: { data: Array<Pick<Device, 'status' | 'id'>> }) => {
    const batch = writeBatch(firestoreDatabase);

    data.forEach(device => {
        batch.update(doc(firestoreDatabase, "devices", device.id), { status: device.status });
    });

    await batch.commit();
}

export const updateDeviceById = async ({ data }: { data: Pick<Device, 'id' | 'status' | 'SKUID' | 'macAddress' | 'name' | 'operatingLocation' | 'userName'> }) => {
    await updateService('devices', data);
}

export const restoreMemoryById = async (data: Pick<Device, 'id' | 'memory'>) => {
    await updateService('devices', data);
}

export const changePasswordDeviceById = async (data: Pick<Device, 'id' | 'password'>) => {
    await updateService('devices', data);
}

export const addDeviceAPI = async (data: Omit<Device, 'lastestVersion' | 'id'>) => {
    await addDoc(collection(firestoreDatabase, 'devices'), data);
}

export const deleteDevicesAPI = async (data: Array<Pick<Device, 'id'>>) => {
    const batch = writeBatch(firestoreDatabase);

    data.forEach(device => {
        batch.delete(doc(firestoreDatabase, "devices", device.id));
    });

    await batch.commit();
}