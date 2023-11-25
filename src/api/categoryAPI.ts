import { collection, getDocs, query } from "firebase/firestore";
import { firestoreDatabase } from "~/config/firebase";

export type Category = {
    id: string;
    name: string
}

export const getCategoryList = async () => {
    const q = query(collection(firestoreDatabase, 'categories'));
    const querySnapshot = await getDocs(q);
    console.log(querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name
    })));

    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name
    }));
}