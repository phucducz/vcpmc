import { collection, getDocs } from "firebase/firestore";

import { firestoreDatabase } from "~/config/firebase";
import { updateService } from "~/service"

export type ScheduleDevice = {
    id: string;
    schedulesId: string;
    devicesIds: string[];
}

export const saveScheduleDevices = async (data: Omit<ScheduleDevice, 'schedulesId'>) => {
    await updateService('schedule_devices', data);
}

export const getScheduleDevices = async () => {
    const resultSnapshot = getDocs(collection(firestoreDatabase, 'schedule_devices'));

    return (await resultSnapshot).docs.map(doc => ({
        id: doc.id,
        schedulesId: doc.data().schedulesId,
        devicesIds: doc.data().devicesIds
    }));
}