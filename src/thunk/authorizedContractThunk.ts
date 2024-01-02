import { createAsyncThunk } from "@reduxjs/toolkit";

import { AuthorizedContract, OwnerShip, addAuthorizedContractById, cancelAuthorizedContractById, getAuthorizedContract, renewAuthorizedContractById, updateAuthorizedContractById } from "~/api/authorizedContract";
import { addUser, getUsers, saveUser } from "./userThunk";
import { User } from "~/api/userAPI";
import { addDoc, collection } from "firebase/firestore";
import { firestoreDatabase } from "~/config/firebase";

export const getAuthorizedContracts = createAsyncThunk(
    'authorizedContract/getAuthorizedContracts',
    async () => {
        return await getAuthorizedContract();
    }
);

export const updateAuthorizedContract = createAsyncThunk(
    'authorizedContract/updateAuthorizedContract',
    async ({ contract, user }: { contract: AuthorizedContract, user: User }, thunkAPI) => {
        await updateAuthorizedContractById(contract);
        await thunkAPI.dispatch(saveUser({ user }));

        await thunkAPI.dispatch(getUsers());
        await thunkAPI.dispatch(getAuthorizedContracts());
    }
);

export const addAuthoziedContract = createAsyncThunk(
    'authorizedContract/addAuthoziedContract',
    async ({ contract, user, navigate }: { contract: AuthorizedContract, user: Omit<User, 'id'>, navigate: () => void }, thunkAPI) => {
        const userId = (await addDoc(collection(firestoreDatabase, 'users'), { ...user })).id;
        await addAuthorizedContractById({ ...contract, authorizedPerson: userId });

        await thunkAPI.dispatch(getUsers());
        await thunkAPI.dispatch(getAuthorizedContracts());
        navigate();
    }
);

export const cancelAuthoziedContract = createAsyncThunk(
    'authorizedContract/cancelAuthoziedContract',
    async ({ id, navigate, reason }: { id: string, navigate: () => void; reason: string }, thunkAPI) => {
        await cancelAuthorizedContractById({ id, reason });

        await thunkAPI.dispatch(getAuthorizedContracts());
        navigate();
    }
);

export const renewAuthorizedContract = createAsyncThunk(
    'authorizedContract/renewAuthorizedContract',
    async ({ id, expirationDate, ownerShips }: { id: string, expirationDate: string, ownerShips: OwnerShip[] }, thunkAPI) => {
        await renewAuthorizedContractById({ id, expirationDate, ownerShips });

        await thunkAPI.dispatch(getAuthorizedContracts());
    }
);