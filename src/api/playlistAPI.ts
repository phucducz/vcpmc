import { collection, getDocs } from "firebase/firestore";

import { firestoreDatabase } from "~/config/firebase";
import { User, getUserById } from "./userAPI";

export type Playlist = {
    id: string;
    title: string;
    categories: Array<string>;
    createdDate: string;
    createdBy: User;
    description: string;
    mode: string;
}

export const getPlaylists = async () => {
    const resultSnapshot = await getDocs(collection(firestoreDatabase, 'playlists'));
    const userList = await getDocs(collection(firestoreDatabase, 'users'));

    return resultSnapshot.docs.map(doc => {
        const user = userList.docs.find(user => user.id === doc.data().createdBy);

        return {
            id: doc.id,
            title: doc.data().title,
            categories: doc.data().categories,
            createdDate: doc.data().createdDate,
            createdBy: {
                avatar: user?.data().avatar || '',
                bank: user?.data().bank || '',
                bankNumber: user?.data().bankNumber || '',
                dateOfBirth: user?.data().dateOfBirth || '',
                dateRange: user?.data().dateRange || '',
                email: user?.data().email || '',
                firstName: user?.data().firstName || '',
                gender: user?.data().gender || '',
                idNumber: user?.data().idNumber || '',
                issuedBy: user?.data().issuedBy || '',
                lastName: user?.data().lastName || '',
                nationality: user?.data().nationality || '',
                password: user?.data().password || '',
                phoneNumber: user?.data().phoneNumber || '',
                residence: user?.data().residence || '',
                rolesId: user?.data().rolesId || '',
                taxCode: user?.data().taxCode || '',
                userName: user?.data().userName || '',
                role: user?.data().role || '',
                id: user?.id || ''
            },
            description: doc.data().description,
            mode: doc.data().mode
        }
    });
}