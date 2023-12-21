import { addDoc, collection, getDocs } from "firebase/firestore";
import { firestoreDatabase } from "~/config/firebase";
import { User, getUserList } from "./userAPI";

export type Feedback = {
    id: string;
    userName: string;
    content: string;
    problem: string;
    user: User;
    dateTime: string;
}

export const sendFeedbackAPI = async (feedback: Omit<Feedback, 'id' | 'user'> & { usersId: string }) => {
    await addDoc(collection(firestoreDatabase, 'feedbacks'), feedback);
}

export const getFeedbackList = async () => {
    const resultSnapshot = getDocs(collection(firestoreDatabase, 'feedbacks'));
    const userList = await getUserList();

    return (await resultSnapshot).docs.map(doc => {
        const user = userList.find(user => user.id === doc.data().usersId) || {} as User;

        return {
            id: doc.id,
            userName: doc.data().userName,
            content: doc.data().content,
            problem: doc.data().problem,
            dateTime: doc.data().dateTime,
            user: user,
        }
    });
}