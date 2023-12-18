import { collection, getDocs } from "firebase/firestore";
import { firestoreDatabase } from "~/config/firebase";

export type Functional = {
    id: string;
    name: string;
    code: string;
    functionalTypesId: string;
}

export type FunctionalType = {
    id: string;
    name: string;
    code: string;
}

export const getFunctionalList = async () => {
    const resultSnapshot = getDocs(collection(firestoreDatabase, 'functionals'));

    return (await resultSnapshot).docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        code: doc.data().code,
        functionalTypesId: doc.data().functionalTypesId
    }));
}

export const getFunctionalTypeList = async () => {
    const resultSnapshot = getDocs(collection(firestoreDatabase, 'functionalTypes'));

    return (await resultSnapshot).docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        code: doc.data().code,
    }));
}