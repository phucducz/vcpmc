import { saveService } from "~/service";
import { Category } from "./categoryAPI";
import { collection, getDocs, query } from "firebase/firestore";
import { firestoreDatabase } from "~/config/firebase";

export type Record = {
    approvalsId: string;
    id: string;
    imageURL: string;
    ISRCCode: string;
    approvalDate: string;
    approvalBy: string;
    audioLink: string;
    author: string;
    category: Category;
    contractId: string;
    createdBy: string;
    createdDate: string;
    format: string;
    nameRecord: string;
    producer: string;
    singer: string;
    time: string;
    expirationDate: string;
    status: string;
}

export const getRecordList = async () => {
    const resultSnapshot = getDocs(collection(firestoreDatabase, 'records'));

    return (await resultSnapshot).docs.map(doc => ({
        id: doc.id,
        imageURL: doc.data().imageURL,
        ISRCCode: doc.data().ISRCCode,
        approvalDate: doc.data().approvalDate,
        approvalBy: doc.data().approvalBy,
        audioLink: doc.data().audioLink,
        author: doc.data().author,
        categoriesId: doc.data().categoriesId,
        contractId: doc.data().contractId,
        createdBy: doc.data().createdBy,
        createdDate: doc.data().createdDate,
        expirationDate: doc.data().expirationDate,
        format: doc.data().format,
        nameRecord: doc.data().nameRecord,
        producer: doc.data().producer,
        singer: doc.data().singer,
        time: doc.data().time
    }));
}

export const getContractList = async () => {
    const q = query(collection(firestoreDatabase, 'contract'));

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
    }));
}

export const addRecord = async (record: Omit<Record, 'category' | 'approvalsId'> & { categoriesId: string }) => {
    await saveService('records', record);
}