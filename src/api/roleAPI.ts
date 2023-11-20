import { collection, getDocs, query } from "firebase/firestore";
import { firestoreDatabase } from "~/config/firebase";

export const getListRole = async () => {
    const q = query(collection(firestoreDatabase, 'roles'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        role: doc.data().role
    }));
}