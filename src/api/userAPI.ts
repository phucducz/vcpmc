import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";

import { firestoreDatabase } from "../config/firebase";
import { updateService } from "../service";

type Role = {
    id: string;
    role: string;
}

export type User = {
    avatar: string;
    id: string;
    dateOfBirth: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    phoneNumber: string;
    role: Role;
    userName: string;
}

// export const checkLogin = async (userName: string, password: string) => {
//     const q = query(
//         collection(firestoreDatabase, 'users'),
//         where("userName", "==", `${userName}`),
//         where("password", "==", `${password}`)
//     );

//     const querySnapshot = await getDocs(q);

//     if (querySnapshot.docs.map(doc => doc.id).length !== 0)
//         return querySnapshot.docs.map(doc => doc.id)[0];

//     return null;
// }

export const getUserById = async (id: string, roleList?: Role[]) => {
    let result = (await getDoc(doc(firestoreDatabase, 'users', id))).data();

    if (result)
        return {
            avatar: result.avatar,
            dateOfBirth: result.dateOfBirth,
            email: result.email,
            firstName: result.firstName,
            id: result.id,
            lastName: result.lastName,
            password: result.password,
            phoneNumber: result.phoneNumber,
            userName: result.userName,
            role: roleList?.find(role => result && role.id === result.rolesId)
        }
}

export const getUserIdByEmail = async (email: string) => {
    const q = query(
        collection(firestoreDatabase, 'users'),
        where("email", "==", `${email}`)
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => doc.id)[0];
}

export const changePasswordUserById = async (data: Pick<User, 'email' | 'password'>) => {
    const { email, password } = data;
    let id = await getUserIdByEmail(email);

    await updateService('users', { id: id, password: password });
}

export const updateUserById = async (data: Pick<
    User,
    'lastName' | 'firstName' | 'dateOfBirth' | 'phoneNumber' | 'id'>
) => {
    try {
        await updateService('users', data);
        return data;
    }
    catch (error) {
        return null;
    }
}