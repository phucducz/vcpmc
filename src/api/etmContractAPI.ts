import { addDoc, collection, doc, getDoc, getDocs } from "firebase/firestore";

import { firestoreDatabase } from "~/config/firebase";
import { saveService } from "~/service";
import { User } from "./userAPI";

export type EtmContract = {
    id: string;
    code: string;
    createdBy: string;
    createdDate: string;
    companyName: string;
    distributionValue: string;
    effectiveDate: string;
    expirationDate: string;
    name: string;
    status: string;
    type: string;
    value: string;
    position: string;
    usersId: string;
    playValue: string;
}

export type EtmContractDetail = {
    id: string;
    code: string;
    createdBy: User;
    createdDate: string;
    companyName: string;
    distributionValue: string;
    effectiveDate: string;
    expirationDate: string;
    name: string;
    status: string;
    type: string;
    value: string;
    position: string;
    user: User & { status: string };
    playValue: string;
}

export const getEtmContracts = async () => {
    const resultSnapshot = await getDocs(collection(firestoreDatabase, 'entrustmentContract'));

    return resultSnapshot.docs.map(doc => ({
        id: doc.id,
        code: doc.data().code,
        createdBy: doc.data().createdBy,
        createdDate: doc.data().createdDate,
        distributionValue: doc.data().distributionValue,
        effectiveDate: doc.data().effectiveDate,
        expirationDate: doc.data().expirationDate,
        name: doc.data().name,
        status: doc.data().status,
        type: doc.data().type,
        value: doc.data().value,
        companyName: doc.data().companyName,
        position: doc.data().position,
        usersId: doc.data().usersId,
        playValue: doc.data().playValue
    }));
}

export const getEtmContractsDetail = async () => {
    const resultSnapshot = await getDocs(collection(firestoreDatabase, 'entrustmentContract'));
    const userList = await getDocs(collection(firestoreDatabase, 'users'));
    const roleList = await getDocs(collection(firestoreDatabase, 'roles'));

    return resultSnapshot.docs.map(doc => {
        let createdBy = userList.docs.find(user => user.id === doc.data().createdBy);
        let authorizedUser = userList.docs.find(user => user.id === doc.data().usersId);
        const roleCreatedBy = roleList.docs.find(role => role.id === createdBy?.id);
        const roleAuthorizedUser = roleList.docs.find(role => role.id === authorizedUser?.id);

        return {
            id: doc.id,
            code: doc.data().code,
            createdBy: {
                avatar: createdBy?.data().avatar || '',
                bank: createdBy?.data().bank || '',
                bankNumber: createdBy?.data().bankNumber || '',
                dateOfBirth: createdBy?.data().dateOfBirth || '',
                dateRange: createdBy?.data().dateRange || '',
                email: createdBy?.data().email || '',
                firstName: createdBy?.data().firstName || '',
                gender: createdBy?.data().gender || '',
                idNumber: createdBy?.data().idNumber || '',
                issuedBy: createdBy?.data().issuedBy || '',
                lastName: createdBy?.data().lastName || '',
                nationality: createdBy?.data().nationality || '',
                password: createdBy?.data().password || '',
                phoneNumber: createdBy?.data().phoneNumber || '',
                residence: createdBy?.data().residence || '',
                rolesId: createdBy?.data().rolesId || '',
                taxCode: createdBy?.data().taxCode || '',
                userName: createdBy?.data().userName || '',
                role: roleCreatedBy ? { id: roleCreatedBy.id, name: roleCreatedBy.data().role } : { id: '', name: '' },
                id: createdBy?.id || ''
            },
            createdDate: doc.data().createdDate,
            distributionValue: doc.data().distributionValue,
            effectiveDate: doc.data().effectiveDate,
            expirationDate: doc.data().expirationDate,
            name: doc.data().name,
            status: doc.data().status,
            type: doc.data().type,
            value: doc.data().value,
            companyName: doc.data().companyName,
            position: doc.data().position,
            user: {
                avatar: authorizedUser?.data().avatar || '',
                bank: authorizedUser?.data().bank || '',
                bankNumber: authorizedUser?.data().bankNumber || '',
                dateOfBirth: authorizedUser?.data().dateOfBirth || '',
                dateRange: authorizedUser?.data().dateRange || '',
                email: authorizedUser?.data().email || '',
                firstName: authorizedUser?.data().firstName || '',
                gender: authorizedUser?.data().gender || '',
                idNumber: authorizedUser?.data().idNumber || '',
                issuedBy: authorizedUser?.data().issuedBy || '',
                lastName: authorizedUser?.data().lastName || '',
                nationality: authorizedUser?.data().nationality || '',
                password: authorizedUser?.data().password || '',
                phoneNumber: authorizedUser?.data().phoneNumber || '',
                residence: authorizedUser?.data().residence || '',
                rolesId: authorizedUser?.data().rolesId || '',
                taxCode: authorizedUser?.data().taxCode || '',
                userName: authorizedUser?.data().userName || '',
                role: roleAuthorizedUser ? { id: roleAuthorizedUser.id, name: roleAuthorizedUser.data().role } : { id: '', name: '' },
                id: authorizedUser?.id || '',
                status: authorizedUser?.data().status
            },
            playValue: doc.data().playValue
        }
    });
}

export const getEtmContractById = async (id: string) => {
    const result = (await getDoc(doc(firestoreDatabase, 'entrustmentContract', id))).data();

    if (!result) return {} as EtmContract;

    return {
        id: id,
        code: result.code,
        createdBy: result.createdBy,
        createdDate: result.createdDate,
        distributionValue: result.distributionValue,
        effectiveDate: result.effectiveDate,
        expirationDate: result.expirationDate,
        name: result.name,
        status: result.status,
        type: result.type,
        value: result.value,
        companyName: result.companyName,
        position: result.position,
        usersId: result.usersId,
        playValue: result.playValue
    }
}

export const saveETMContract = async ({ contract }: { contract: EtmContract }) => {
    if (contract.id !== '')
        return await saveService('entrustmentContract', contract);

    return await addDoc(collection(firestoreDatabase, 'entrustmentContract'), { ...contract });
}