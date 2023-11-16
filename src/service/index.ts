import { collection, deleteDoc, doc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { firestoreDatabase } from "../config/firebase";

export const getService = async (table: string, id?: string) => {
    let resultSnapshot;

    if (id)
        resultSnapshot = await getDocs(collection(firestoreDatabase, `${table}`, id));
    else
        resultSnapshot = await getDocs(collection(firestoreDatabase, `${table}`));

    return resultSnapshot;
}

export const saveService = async (table: string, data: any) => {
    await setDoc(doc(firestoreDatabase, `${table}`, `${data.id}`), data);
}

export const updateService = async (table: string, data: any) => {
    await updateDoc(doc(firestoreDatabase, `${table}`, `${data.id}`), {
        ...data
    });
}

export const deleteService = async (table: string, id: number) => {
    await deleteDoc(doc(firestoreDatabase, `${table}`, `${id}`));
}