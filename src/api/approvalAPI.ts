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
        batch.set(doc(firestoreDatabase, "approvals", approval.id), approval);
    });

    await batch.commit();
}