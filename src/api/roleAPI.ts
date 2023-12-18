import { addDoc, collection, getDocs, query } from "firebase/firestore";
import { firestoreDatabase } from "~/config/firebase";
import { deleteService, saveService } from "~/service";

export type Role = {
    id: string;
    role: string;
    name: string;
    description: string;
    functionalsId: Array<string>;
    allowDelete: boolean;
}

export const getListRole = async () => {
    const q = query(collection(firestoreDatabase, 'roles'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        role: doc.data().role,
        name: doc.data().name,
        description: doc.data().description,
        functionalsId: doc.data().functionalsId,
        allowDelete: doc.data().allowDelete
    }));
}

export const updateRoleById = async (role: Role) => {
    await saveService('roles', role);
}

export const addRoleAPI = async (role: Omit<Role, 'id'>) => {
    await addDoc(collection(firestoreDatabase, 'roles'), role);
}

export const deleteRoleAPI = async (id: string) => {
    await deleteService('roles', id);
}