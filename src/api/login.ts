import { sendPasswordResetEmail } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, firestoreDatabase } from "~/config/firebase";

export const checkLogin = async (userName: string, password: string) => {
    const q = query(
        collection(firestoreDatabase, 'users'),
        where("userName", "==", `${userName}`),
        where("password", "==", `${password}`)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.docs.map(doc => doc.id).length !== 0)
        return querySnapshot.docs.map(doc => doc.id)[0];

    return null;
}

export const sendPasswordToResetEmail = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
}