import { collection, getDocs, query } from "firebase/firestore";
import { firestoreDatabase } from "~/config/firebase";

export type Type = {
    id: string;
    name: string
}

export const getTypeList = async () => {
    const q = query(collection(firestoreDatabase, 'types'));

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc, index) => ({
        id: doc.id,
        name: doc.data().name
    }));
}