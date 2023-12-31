import { addDoc, collection, getDocs } from "firebase/firestore";

import { firestoreDatabase } from "~/config/firebase";
import { Record } from "./recordAPI";
import { RecordPlays } from "./recordPlay";
import { User } from "./userAPI";
import { updateService } from "~/service";

export type OwnerShip = {
    name: string;
    value: number;
}

export type AuthorizedContract = {
    id: string;
    authorized: string;
    authorizedPerson: string;
    authorizingLegalEntity: string;
    censored: boolean;
    contractCode: string;
    contractTypesId: string;
    createdBy: string;
    customer: string;
    dateCreated: string;
    effectiveDate: string;
    expirationDate: string;
    ownerShips: Array<OwnerShip>;
    reason: string;
    status: string;
    royalties: string;
    CPM: string;
    administrativeFee: string;
    forControlDate: string;
};

export type RecordDetail = {
    records: Record;
    recordPlays: Array<RecordPlays>;
    totalPlay: number;
}

export type ContractDetail = {
    contract: AuthorizedContractDetail;
    records: RecordDetail[];
    totalPlay: number;
    revenue: number;
    royalties: number;
    date: string;
    administrativeFee: number;
}

export type AuthorizedContractDetail = Omit<AuthorizedContract, 'authorizedPerson' | 'createdBy'> & {
    authorizedPerson: User & { status: string };
    createdBy: User;
}

export const getAuthorizedContract = async () => {
    const resultSnapshot = getDocs(collection(firestoreDatabase, 'contract'));
    const userList = await getDocs(collection(firestoreDatabase, 'users'));
    const roleList = await getDocs(collection(firestoreDatabase, 'roles'));

    return (await resultSnapshot).docs.map(doc => {
        let createdBy = userList.docs.find(user => user.id === doc.data().createdBy);
        let authorizedUser = userList.docs.find(user => user.id === doc.data().authorizedPerson);
        const roleCreatedBy = roleList.docs.find(role => role.id === createdBy?.id);
        const roleAuthorizedUser = roleList.docs.find(role => role.id === authorizedUser?.id);

        return {
            id: doc.id,
            authorized: doc.data().authorized,
            authorizedPerson: {
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
                role: roleAuthorizedUser ? { id: roleAuthorizedUser.id, name: roleAuthorizedUser.data().name } : { id: '', name: '' },
                id: authorizedUser?.id || '',
                status: authorizedUser?.data().status,
                companyName: authorizedUser?.data().companyName
            },
            authorizingLegalEntity: doc.data().authorizingLegalEntity,
            censored: doc.data().censored,
            contractCode: doc.data().contractCode,
            contractTypesId: doc.data().contractTypesId,
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
                role: roleCreatedBy ? { id: roleCreatedBy.id, name: roleCreatedBy.data().name } : { id: '', name: '' },
                id: createdBy?.id || '',
                companyName: createdBy?.data().companyName
            },
            customer: doc.data().customer,
            dateCreated: doc.data().dateCreated,
            effectiveDate: doc.data().effectiveDate,
            expirationDate: doc.data().expirationDate,
            ownerShips: doc.data().ownerShips,
            reason: doc.data().reason,
            status: doc.data().status,
            royalties: doc.data().royalties,
            CPM: doc.data().CPM,
            administrativeFee: doc.data().administrativeFee,
            forControlDate: doc.data().forControlDate
        }
    });
}

export const updateAuthorizedContractById = async (contract: AuthorizedContract) => {
    updateService('contract', contract);
}

export const addAuthorizedContractById = async (contract: Omit<AuthorizedContract, 'id'> & { id?: string }) => {
    if (contract.id === '')
        delete contract.id;

    return await addDoc(collection(firestoreDatabase, 'contract'), { ...contract });
}

export const cancelAuthorizedContractById = async ({ id, reason }: { id: string, reason: string }) => {
    updateService('contract', { id: id, status: 'Đã hủy', reason: reason });
}

export const renewAuthorizedContractById = async ({ id, expirationDate, ownerShips }: { id: string, expirationDate: string, ownerShips: OwnerShip[] }) => {
    updateService('contract', { id: id, expirationDate: expirationDate, ownerShips: ownerShips });
}