import { addDoc, collection, doc, getDoc, getDocs, writeBatch } from "firebase/firestore";

import { firestoreDatabase } from "~/config/firebase";
import { deleteService, saveService, updateService } from "~/service";
import { Record, getRecordList } from "./recordAPI";
import { User } from "./userAPI";
import { RecordPlays, getRecordPlayList } from "./recordPlay";

export type ETMContractType = {
    id: string;
    name: string;
    revenuePercent: number;
    applyDate: string;
}

export type Quarterly = {
    quarter: string;
    time: string;
}

export type OwnRecord = Omit<Record, 'approvalsId' | 'category' | 'status'> & { totalPlay: number };

export type EtmContractForControl = EtmContract & {
    records: Array<OwnRecord>;
    totalPlay: number;
    productionRight: number;
    performanceRight: number;
    vcpmcRight: number;
    CPM: number;
    checkpointDate: string;
    unDistributedRevenue: number;
    statusForControl: string;
    administrativeFee: number;
    recordPlay: Array<RecordPlays>
}

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
    employeeIds?: Array<string>;
}

export type EtmContractDetail = Omit<EtmContract, 'createdBy' | 'usersId'> & { createdBy: User; user: User & { status: string } };

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
        playValue: doc.data().playValue,
        employeeIds: doc.data().employeeIds
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
                id: createdBy?.id || '',
                checkpointDate: doc.data().checkpointDate,
                statusForControl: doc.data().statusForControl
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
            playValue: doc.data().playValue,
            employeeIds: doc.data().employeeIds
        }
    });
}

export const getEtmContractForControlList = async () => {
    const resultSnapshot = await getDocs(collection(firestoreDatabase, 'entrustmentContract'));
    const recordPlays = await getRecordPlayList();
    const records = await getRecordList();

    return resultSnapshot.docs.map(doc => {
        let recordList: Array<OwnRecord> = records.map(record => {
            if (record.etmContractsId === doc.id)
                return {
                    ...record,
                    totalPlay: recordPlays.filter(recordPlay => recordPlay.recordsId === record.id).reduce((sum, item) => sum + parseInt(item.playsCount), 0)
                }
            return {
                ...record,
                totalPlay: 0
            };
        });

        let recordsOfContract = recordList.filter(record => record.etmContractsId === doc.id);
        let recordPlay = recordPlays.
            filter(recordPlay => recordsOfContract.
                some(record => record.id === recordPlay.recordsId)
            );

        console.log(recordPlays);
        console.log(recordsOfContract);
        console.log(recordPlay);

        let totalPlay = recordPlay.reduce((sum, item) => sum + parseInt(item.playsCount), 0);

        return {
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
            playValue: doc.data().playValue,
            productionRight: doc.data().productionRight,
            performanceRight: doc.data().performanceRight,
            vcpmcRight: doc.data().vcpmcRight,
            records: recordsOfContract,
            totalPlay: totalPlay,
            CPM: doc.data().CPM,
            checkpointDate: doc.data().checkpointDate,
            unDistributedRevenue: doc.data().unDistributedRevenue,
            statusForControl: doc.data().statusForControl,
            employeeIds: doc.data().employeeIds,
            administrativeFee: doc.data().royalties,
            recordPlay: recordPlay
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
        playValue: result.playValue,
        employeeIds: result.employeeIds
    }
}

export const saveETMContract = async ({ contract }: {
    contract: EtmContract & {
        checkpointDate: string;
        CPM: number;
        performanceRight: number;
        productionRight: number;
        royalties: number;
        unDistributedRevenue: number;
        vcpmcRight: number;
    }
}) => {
    if (contract.id !== '')
        return await saveService('entrustmentContract', contract);

    return await addDoc(collection(firestoreDatabase, 'entrustmentContract'), { ...contract });
}

export const getETMContractTypes = async () => {
    const resultSnapshot = await getDocs(collection(firestoreDatabase, 'entrustmentContractTypes'));

    return resultSnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        revenuePercent: doc.data().revenuePercent,
        applyDate: doc.data().applyDate
    }));
}

export const updateContractTypesById = async (types: Array<ETMContractType>) => {
    const batch = writeBatch(firestoreDatabase);

    types.forEach(type => {
        batch.set(doc(firestoreDatabase, "entrustmentContractTypes", type.id), type);
    });

    await batch.commit();
}

export const addContractTypesAPI = async (type: ETMContractType) => {
    await addDoc(collection(firestoreDatabase, 'entrustmentContractTypes'), type);
}

export const deleteContractTypesAPI = async (id: string) => {
    await deleteService('entrustmentContractTypes', id);
}

export const addEmployeeToContract = async ({ user, employeeIds, entrustmentContractId }: { user: Omit<User, 'role' | 'id'>; employeeIds: Array<string>; entrustmentContractId: string; }) => {
    const userId = (await addDoc(collection(firestoreDatabase, 'users'), user)).id;

    await updateService('entrustmentContract', { id: entrustmentContractId, employeeIds: [...employeeIds, userId] });
}

export const deleteEmployeesById = async ({ currentEmployees, id, employeeIds }: { employeeIds: Array<string>, currentEmployees: Array<string>, id: string }) => {
    await updateService('entrustmentContract', { id: id, employeeIds: currentEmployees });

    const batch = writeBatch(firestoreDatabase);
    employeeIds.forEach(employee => {
        batch.delete(doc(firestoreDatabase, "users", employee));
    });
    await batch.commit();
}

export const deleteContractById = async (contracts: Array<EtmContractDetail>) => {
    const batch = writeBatch(firestoreDatabase);
    contracts.forEach(contract => {
        batch.delete(doc(firestoreDatabase, 'entrustmentContract', contract.id));
        batch.delete(doc(firestoreDatabase, 'users', contract.user.id));
    });
    await batch.commit();
}

export const checkpointContracts = async ({ contracts, checkpointDate }: { contracts: Array<EtmContractForControl>; checkpointDate: string }) => {
    const batch = writeBatch(firestoreDatabase);
    contracts.forEach(contract => {
        batch.update(doc(firestoreDatabase, 'entrustmentContract', contract.id), { checkpointDate: checkpointDate });
    });
    await batch.commit();
}