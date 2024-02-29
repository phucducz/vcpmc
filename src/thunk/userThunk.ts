import { createAsyncThunk } from "@reduxjs/toolkit";

import { User, addUserAPI, changePasswordStatusUserById, changePasswordUserById, deleteUserById, getUserById, getUserList, saveUserAPI, updateUserById } from "../api/userAPI";
import { checkLogin } from "~/api/loginAPI";
import { Role } from "~/api/roleAPI";

export const changePassword = createAsyncThunk(
    'user/changePassword',
    async ({ email = '', password, userId = '', navigate }
        : Pick<User, 'password'> & { userId?: string, email?: string, navigate?: () => void }
    ) => {
        if (email !== '') {
            await changePasswordUserById({ email: email, id: userId, password: password });
            navigate && navigate();

            return {
                password: password,
                userName: email,
                navigate: navigate
            };
        }

        return null;
    }
);

export const getUsers = createAsyncThunk(
    'user/getUsers',
    async () => {
        return await getUserList();
    }
);

export const login = createAsyncThunk(
    'user/login',
    async ({ userName, password, navigate, role }: Pick<User, 'userName' | 'password'> & {
        navigate: () => void
        role: Role[]
    }) => {
        let id = await checkLogin(userName, password);

        if (id) {
            const result = await getUserById(id, role);
            
            return {
                user: { ...result, id: id },
                navigate: () => navigate()
            }
        }

        return null;
    }
)

export const changeInfoUserById = createAsyncThunk(
    'user/changeInfo',
    async (data: Pick<User, 'lastName' | 'firstName' | 'dateOfBirth' | 'phoneNumber' | 'id'>) => {
        return await updateUserById(data);
    }
)

type SaveUserParamsType = {
    user: Omit<User, 'role'>;
    navigate?: () => void;
}

export const saveUser = createAsyncThunk(
    'user/saveUser',
    async ({ user, navigate }: SaveUserParamsType) => {
        await saveUserAPI(user);

        navigate && navigate();
    }
);

export const changePasswordStatusUser = createAsyncThunk(
    'user/changePasswordStatusUserById',
    async ({ id, password, status, navigate }: Pick<User, 'password' | 'id'> & { status: string, navigate: () => void }) => {
        await changePasswordStatusUserById({ id, password, status });

        navigate();
    }
);

export const addUser = createAsyncThunk(
    'user/addUser',
    async ({ user, navigate }: { user: Omit<User, 'role' | 'id'>; navigate?: () => void; }
    ) => {
        await addUserAPI(user);
        navigate && navigate();
    }
);

export const deleteUser = createAsyncThunk(
    'user/deleteUser',
    async ({ id, navigate }: { id: string, navigate: () => void }) => {
        await deleteUserById(id);
        navigate();
    }
);