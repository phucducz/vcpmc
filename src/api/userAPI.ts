import { addDoc, collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";

import { firestoreDatabase } from "../config/firebase";
import { saveService, updateService } from "../service";
import { getListRole } from "./roleAPI";

type Role = {
    id: string;
    role: string;
}

export type User = {
    avatar: string;
    bank: string;
    bankNumber: string;
    dateOfBirth: string;
    dateRange: string;
    email: string;
    firstName: string;
    gender: string;
    idNumber: string;
    issuedBy: string;
    lastName: string;
    nationality: string;
    password: string;
    phoneNumber: string;
    residence: string;
    rolesId: string;
    taxCode: string;
    userName: string;
    role: Role;
    id: string;
    //     avatar: string;
    //     id: string;
    //     dateOfBirth: string;
    //     email: string;
    //     firstName: string;
    //     lastName: string;
    //     password: string;
    //     role: Role;
    //     phoneNumber: string;
    //     userName: string;
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

    if (typeof roleList === 'undefined' || roleList.length < 0)
        roleList = await getListRole();

    if (!result) return {} as User;

    return {
        avatar: result.avatar,
        bank: result.bank,
        bankNumber: result.bankNumber,
        dateOfBirth: result.dateOfBirth,
        dateRange: result.dateRange,
        email: result.email,
        firstName: result.firstName,
        gender: result.gender,
        idNumber: result.idNumber,
        issuedBy: result.issuedBy,
        lastName: result.lastName,
        nationality: result.nationality,
        password: result.password,
        phoneNumber: result.phoneNumber,
        residence: result.residence,
        rolesId: result.rolesId,
        taxCode: result.taxCode,
        userName: result.userName,
        id: result.id,
        role: roleList.find(role => result && role.id === result.rolesId) || { id: '', role: '' }
        // role: typeof roleList !== 'undefined' ? roleList.find(role => result && role.id === result.rolesId) : { id: '', role: '' }
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

export const saveUserAPI = async (user: Omit<User, 'role'>) => {
    await saveService('users', user);
}

export const addUser = async (user: Omit<User, 'role' | 'id'> & { id?: string }) => {
    if (user.id === '')
        delete user?.id;

    return await addDoc(collection(firestoreDatabase, 'users'), { ...user });
} 