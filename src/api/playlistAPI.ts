import { addDoc, collection, getDocs } from "firebase/firestore";

import { firestoreDatabase } from "~/config/firebase";
import { User } from "./userAPI";
import { deleteService, updateService } from "~/service";

export type Playlist = {
    id: string;
    title: string;
    categories: Array<string>;
    createdDate: string;
    createdBy: User;
    description: string;
    mode: string;
    imageURL: string;
}

export const getPlaylists = async () => {
    const resultSnapshot = await getDocs(collection(firestoreDatabase, 'playlists'));
    const userList = await getDocs(collection(firestoreDatabase, 'users'));
    const roleList = await getDocs(collection(firestoreDatabase, 'roles'));

    return resultSnapshot.docs.map(doc => {
        const user = userList.docs.find(user => user.id === doc.data().createdBy);
        const role = roleList.docs.find(role => role.id === user?.data().rolesId);

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
                role: role ? { id: role.id, name: role.data().name } : { id: '', name: '' },
                id: user?.id || ''
            },
            description: doc.data().description,
            mode: doc.data().mode,
            imageURL: doc.data().imageURL
        }
    });
}

export const editPlaylistAPI = async ({ description, categories, title, mode, id }:
    Pick<Playlist, 'description' | 'categories' | 'title' | 'mode' | 'id'>
) => {
    await updateService('playlists', { id, description, categories, title, mode });
}

export const savePlaylist = async ({ playlist }: { playlist: Omit<Playlist, 'id' | 'createdBy'> & { createdBy: string } }) => {
    return (await addDoc(collection(firestoreDatabase, 'playlists'), { ...playlist })).id;
}

export const deletePlaylistAPI = async (id: string) => {
    await deleteService('playlists', id);
}