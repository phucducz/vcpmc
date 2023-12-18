import { addDoc, collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";

import { firestoreDatabase } from "../config/firebase";
import { deleteService, saveService, updateService } from "../service";
import { Role, getListRole } from "./roleAPI";

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
    role: Pick<Role, 'id' | 'name'>;
    id: string;
    companyName?: string;
    status?: string;
    expirationDate?: string;
}

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
        role: roleList.find(role => result && role.id === result.rolesId) || { id: '', name: '' },
        companyName: result.companyName,
        status: result.status,
        expirationDate: result.expirationDate
    }
}

export const getUserList = async () => {
    const resultSnapshot = getDocs(collection(firestoreDatabase, 'users'));
    const roles = await getListRole();

    return (await resultSnapshot).docs.map(doc => {
        return {
            avatar: doc.data().avatar,
            bank: doc.data().bank,
            bankNumber: doc.data().bankNumber,
            dateOfBirth: doc.data().dateOfBirth,
            dateRange: doc.data().dateRange,
            email: doc.data().email,
            firstName: doc.data().firstName,
            gender: doc.data().gender,
            idNumber: doc.data().idNumber,
            issuedBy: doc.data().issuedBy,
            lastName: doc.data().lastName,
            nationality: doc.data().nationality,
            password: doc.data().password,
            phoneNumber: doc.data().phoneNumber,
            residence: doc.data().residence,
            rolesId: doc.data().rolesId,
            taxCode: doc.data().taxCode,
            userName: doc.data().userName,
            id: doc.id,
            role: roles.find(role => role.id === doc.data().rolesId) || { id: '', name: '' },
            companyName: doc.data().companyName,
            status: doc.data().status,
            expirationDate: doc.data().expirationDate
        }
    });
}

export const getUserIdByEmail = async (email: string) => {
    const q = query(
        collection(firestoreDatabase, 'users'),
        where("email", "==", `${email}`)
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => doc.id)[0];
}

export const changePasswordUserById = async (data: Pick<User, 'password' | 'email' | 'id'>) => {
    const { email, password, id: userId } = data;
    let id = '';

    if (userId === '')
        id = await getUserIdByEmail(email);
    else id = userId;

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

export const addUserAPI = async (user: Omit<User, 'role' | 'id'> & { id?: string }) => {
    if (user.id === '')
        delete user?.id;

    return await addDoc(collection(firestoreDatabase, 'users'), { ...user });
}

export const changePasswordStatusUserById = async ({ id, password, status }: Pick<User, 'password' | 'id'> & { status: string }) => {
    return await updateService('users', {
        id: id,
        password: password,
        status: status
    });
}

export const deleteUserById =async (id: string) => {
    await deleteService('users', id);    
}