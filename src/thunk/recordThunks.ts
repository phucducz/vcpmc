import { createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs, query } from "firebase/firestore";
import { firestoreDatabase } from "~/config/firebase";

import { Record, addRecord } from "~/api/recordAPI";
import { Category } from "~/api/categoryAPI";
import { Approval } from "~/api/approvalAPI";

export const getRecords = createAsyncThunk(
    'record/getList',
    async ({ categoryList, approvalList }: {
        categoryList?: Array<Category>;
        approvalList?: Array<Approval>;
    }) => {
        if (typeof categoryList === 'undefined' || typeof approvalList === 'undefined') return;

        let q = query(collection(firestoreDatabase, 'records'));

        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => {
            let approval = approvalList.find(approval => approval.recordsId === doc.id);

            return {
                approvalsId: approval ? approval.id : '',
                id: doc.id,
                imageURL: doc.data().imageURL,
                ISRCCode: doc.data().ISRCCode,
                approvalDate: approval ? approval.approvalDate : '',
                approvalBy: approval ? approval.approvalBy : '',
                audioLink: doc.data().audioLink,
                author: doc.data().author,
                category: categoryList.find(type => doc.data().categoriesId === type.id) || {} as Category,
                contractId: doc.data().contractId,
                createdBy: doc.data().createdBy,
                createdDate: doc.data().createdDate,
                expirationDate: doc.data().expirationDate,
                format: doc.data().format,
                nameRecord: doc.data().nameRecord,
                producer: doc.data().producer,
                singer: doc.data().singer,
                time: doc.data().time,
                status: approval ? approval.status : 'not yet approved',
            }
        });
    }
);

export const saveRecord = createAsyncThunk(
    'record/addRecord',
    async (data: Omit<Record, 'category' | 'approvalsId'> & { categoriesId: string }) => {
        await addRecord(data);
    }
);