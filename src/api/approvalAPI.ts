import { doc, writeBatch } from "firebase/firestore";
import { firestoreDatabase } from "~/config/firebase";

import { getService } from "~/service";

export type Approval = {
    id: string;
    approvalBy: string;
    approvalDate: string;
    reason: string;
    recordsId: string;
    status: string
}

export const getApproval = async () => {
    return await getService('approvals');
}

export const approveRecords = async (approvals: Array<Approval>) => {
    const batch = writeBatch(firestoreDatabase);

    approvals.forEach(approval => {
        let id = approval.id;

        if (id === '')
            id = Date.now().toString(36) + Math.random().toString(36).substr(2);

        batch.set(doc(firestoreDatabase, "approvals", id), approval);
    });

    await batch.commit();
}