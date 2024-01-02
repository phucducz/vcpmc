import { addDoc, collection, doc, getDocs, query, writeBatch } from "firebase/firestore";
import { firestoreDatabase } from "~/config/firebase";

export type Category = {
    id: string;
    name: string;
    description: string;
}

export const getCategoryList = async () => {
    const q = query(collection(firestoreDatabase, 'categories'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        description: doc.data().description
    }));
}

export const updateCategoriesById = async (categories: Array<Category>) => {
    const batch = writeBatch(firestoreDatabase);

    categories.forEach(category => {
        batch.set(doc(firestoreDatabase, "categories", category.id), category);
    });

    await batch.commit();
} 

export const addCategoryAPI = async (category: Category) => {
    await addDoc(collection(firestoreDatabase, 'categories'), category);
} 