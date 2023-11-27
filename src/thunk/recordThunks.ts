import { createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { firestoreDatabase } from "~/config/firebase";

import { Record, addRecord, approveRecords } from "~/api/recordAPI";
import { Category } from "~/api/categoryAPI";
import { RecordDataType } from "~/pages/ApprovePage";

export const getRecords = createAsyncThunk(
    'record/getList',
    async ({ categoryList, status = 'approved' }: { categoryList: Array<Category>, status?: 'not yet approved' | 'approved' }) => {
        let q;
        if (status === 'not yet approved')
            q = query(
                collection(firestoreDatabase, 'records'),
                where('approvalDate', '==', ''),
                orderBy('approvalDate', 'desc')
            );
        else
            q = query(
                collection(firestoreDatabase, 'records'),
                where('approvalDate', '!=', ''),
                orderBy('approvalDate', 'desc')
            );

        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ISRCCode: doc.data().ISRCCode,
            approvalDate: doc.data().approvalDate,
            approvalBy: doc.data().approvalBy,
            author: doc.data().author,
            category: categoryList.find(type => doc.data().categoriesId === type.id) || {} as Category,
            contractId: doc.data().contractId,
            createdBy: doc.data().createdBy,
            createdDate: doc.data().createdDate,
            expiryDate: doc.data().expiryDate,
            expirationDate: doc.data().expirationDate,
            format: doc.data().format,
            nameRecord: doc.data().nameRecord,
            producer: doc.data().producer,
            singer: doc.data().singer,
            time: doc.data().time,
            expitationDate: doc.data().expirationDate
        }));
    }
);

export const saveRecord = createAsyncThunk(
    'record/addRecord',
    async (data: Omit<Record, 'category'> & { categoriesId: string }) => {
        await addRecord(data);
    }
);

export const approveRecordList = createAsyncThunk(
    'record/approveRecordList',
    async (records: Array<Omit<RecordDataType, 'category' | 'contract'> & { categoriesId: string }>) => {
        await approveRecords(records);
    }
);