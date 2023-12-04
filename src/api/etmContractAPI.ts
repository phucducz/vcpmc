import { addDoc, collection, doc, getDoc, getDocs } from "firebase/firestore";

import { firestoreDatabase } from "~/config/firebase";
import { saveService } from "~/service";

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