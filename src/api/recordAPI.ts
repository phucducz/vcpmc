import { saveService } from "~/service";
import { Category } from "./categoryAPI";
import { collection, getDocs } from "firebase/firestore";
import { firestoreDatabase } from "~/config/firebase";

export type Record = {
    id: string;
    ISRCCode: string;
    approvalDate: string;
    approveBy: string;
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
    expirationDate?: Date
}

export const getRecordList = async () => {
    const resultSnapshot = getDocs(collection(firestoreDatabase, 'records'));

    return (await resultSnapshot).docs.map(doc => ({
        id: doc.id,
        ISRCCode: doc.data().ISRCCode,
        approvalDate: doc.data().approvalDate,
        approveBy: doc.data().approveBy,
        author: doc.data().author,
        categoriesId: doc.data().categoriesId,
        contractId: doc.data().contractId,
        createdBy: doc.data().createdBy,
        createdDate: doc.data().createdDate,
        expiryDate: doc.data().expiryDate,
        format: doc.data().format,
        nameRecord: doc.data().nameRecord,
        producer: doc.data().producer,
        singer: doc.data().singer,
        time: doc.data().time
    }));
}

export const addRecord = async (record: Omit<Record, 'category'> & { categoriesId: string }) => {
    await saveService('records', record);
}