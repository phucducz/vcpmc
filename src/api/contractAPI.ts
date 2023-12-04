import { doc, getDoc } from "firebase/firestore";
import { firestoreDatabase } from "~/config/firebase";

export type Contract = {
    censored: string;
    contractCode: string;
    contractDetailsId: string;
    contractTypesId: string;
    customer: string;
    dateCreated: string;
    effectiveDate: string;
    expirationDate: string;
    status: string;
    usersId: string;
} 

export const getContractById = async (id: string) => {
    return (await getDoc(doc(firestoreDatabase, 'contract', id))).data();
}