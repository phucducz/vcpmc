import { doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { collection } from "firebase/firestore";

import { firestoreDatabase } from "../config/firebase";
import { updateService } from "../service";

export type User = {
    id: string;
    dateOfBirth: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    phoneNumber: string;
    rolesId: string;
    userName: string;
}

export const checkLogin = async (userName: string, password: string) => {
    const q = query(
        collection(firestoreDatabase, 'users'),
        where("userName", "==", `${userName}`),
        where("password", "==", `${password}`)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.docs.map(doc => doc.data()).length === 1)
        return true;
    return false;
}

export const getUserById = async (id: string) => {
    return (await getDoc(doc(firestoreDatabase, 'users', id))).data();
}

export const changePasswordUserById = async (data: Pick<User, 'id' | 'password'>) => {
    await updateService('users', { ...data });
}