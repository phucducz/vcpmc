import { createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { firestoreDatabase } from "~/config/firebase";

import { Record, addRecord, getRecordList } from "~/api/recordAPI";
import { Category } from "~/api/categoryAPI";

export const getRecords = createAsyncThunk(
    'record/getList',
    async ({ categoryList }: { categoryList: Array<Category> }) => {
        const q = query(
            collection(firestoreDatabase, 'records'),
            orderBy('expirationDate', 'desc')
        );
        const querySnapshot = await getDocs(q);
        console.log(querySnapshot.docs.map(doc => doc.data()));

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ISRCCode: doc.data().ISRCCode,
            approvalDate: doc.data().approvalDate,
            approveBy: doc.data().approveBy,
            author: doc.data().author,
            category: categoryList.find(type => doc.data().categoriesId === type.id) || {} as Category,
            contractId: doc.data().contractId,
            createdBy: doc.data().createdBy,
            createdDate: doc.data().createdDate,
            expiryDate: doc.data().expiryDate,
            format: doc.data().format,
            nameRecord: doc.data().nameRecord,
            producer: doc.data().producer,
            singer: doc.data().singer,
            time: doc.data().time,
            expitationDate: doc.data().expirationDate
        }));
        // const result = await getRecordList();

        // return result.map(item => ({
        //     id: item.id,
        //     ISRCCode: item.ISRCCode,
        //     approvalDate: item.approvalDate,
        //     approveBy: item.approveBy,
        //     author: item.author,
        //     category: categoryList.find(type => item.categoriesId === type.id) || {} as Category,
        //     contractId: item.contractId,
        //     createdBy: item.createdBy,
        //     createdDate: item.createdDate,
        //     expiryDate: item.expiryDate,
        //     format: item.format,
        //     nameRecord: item.nameRecord,
        //     producer: item.producer,
        //     singer: item.singer,
        //     time: item.time
        // }));
    }
);

export const saveRecord = createAsyncThunk(
    'record/addRecord',
    async (data: Omit<Record, 'category'> & { categoriesId: string }) => {
        await addRecord(data);
    }
);