import { createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs, query } from "firebase/firestore";
import { Approval, approveRecords } from "~/api/approvalAPI";
import { firestoreDatabase } from "~/config/firebase";

export const getApprovalList = createAsyncThunk(
    'approval/getApprovalList',
    async () => {
        const q = query(collection(firestoreDatabase, 'approvals'));
        const querySnapshot = await getDocs(q);
        
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            approvalBy: doc.data().approvalBy,
            approvalDate: doc.data().approvalDate,
            reason: doc.data().reason,
            recordsId: doc.data().recordsId,
            status: doc.data().status
        }))
    }
);

export const approveRecordList = createAsyncThunk(
    'record/approveRecordList',
    async (approvals: Array<Approval>) => {
        await approveRecords(approvals);
    }
);