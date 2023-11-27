import { getService, saveService } from "~/service";
import { Category } from "./categoryAPI";
import { Timestamp, collection, doc, getDoc, getDocs, query, writeBatch } from "firebase/firestore";
import { firestoreDatabase } from "~/config/firebase";
import { Contract, getContractById } from "./contractAPI";
import { RecordDataType } from "~/pages/ApprovePage";

export type Record = {
    id: string;
    ISRCCode: string;
    approvalDate: string;
    approvalBy: string;
    author: string;
    category: Category;
    contractId: string;
    createdBy: string;
    createdDate: string;
    expiryDate: string;
    format: string;
    nameRecord: string;
    producer: string;
    singer: string;
    time: string;
    expirationDate?: Timestamp | string;
    // contract: Contract
}

export const getRecordList = async () => {
    const resultSnapshot = getDocs(collection(firestoreDatabase, 'records'));

    return (await resultSnapshot).docs.map(doc => ({
        id: doc.id,
        ISRCCode: doc.data().ISRCCode,
        approvalDate: doc.data().approvalDate,
        approvalBy: doc.data().approvalBy,
        author: doc.data().author,
        categoriesId: doc.data().categoriesId,
        contractId: doc.data().contractId,
        createdBy: doc.data().createdBy,
        createdDate: doc.data().createdDate,
        expiryDate: doc.data().expiryDate,
        expirationDate: doc.data().expirationDate,
        format: doc.data().format,
        nameRecord: doc.data().nameRecord,
        producer: doc.data().producer,
        singer: doc.data().singer,
        time: doc.data().time
    }));
}

export const getContractList = async () => {
    const q = query(
        collection(firestoreDatabase, 'contract')
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
    }));
}

export const addRecord = async (record: Omit<Record, 'category'> & { categoriesId: string }) => {
    await saveService('records', record);
}

export const approveRecords = async (records: Array<Omit<RecordDataType, 'category' | 'contract'> & { categoriesId: string }>) => {
    const batch = writeBatch(firestoreDatabase);

    records.forEach(record => {
        batch.set(doc(firestoreDatabase, "records", record.id), record);
    });

    await batch.commit();
}