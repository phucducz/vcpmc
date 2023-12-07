import { collection, deleteDoc, doc, getDocs, setDoc, updateDoc } from "firebase/firestore";

import { firestoreDatabase } from "~/config/firebase";

export const getService = async (table: string, id?: string) => {
    let resultSnapshot;

    if (id)
        resultSnapshot = await getDocs(collection(firestoreDatabase, `${table}`, id));
    else
        resultSnapshot = await getDocs(collection(firestoreDatabase, `${table}`));

    return resultSnapshot.docs.map(doc => doc.data());
}

export const saveService = async (table: string, data: any) => {
    const { id } = data;
    delete data.id;

    await setDoc(doc(firestoreDatabase, `${table}`, `${id}`), data);
}

export const updateService = async (table: string, data: any) => {
    const { id } = data;
    delete data.id;
    
    await updateDoc(doc(firestoreDatabase, `${table}`, `${id}`), { ...data });
}

export const deleteService = async (table: string, id: any) => {
    await deleteDoc(doc(firestoreDatabase, `${table}`, `${id}`));
}