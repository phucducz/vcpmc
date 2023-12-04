import { createAsyncThunk } from "@reduxjs/toolkit";

import { User, changePasswordUserById, getUserById, saveUserAPI, updateUserById } from "../api/userAPI";
import { Role } from "~/reducers/role";
import { checkLogin } from "~/api/loginAPI";

export const changePassword = createAsyncThunk(
    'user/changePassword',
    async ({ email, password, navigate }
        : Pick<User, 'email' | 'password'> & { navigate?: () => void }
    ) => {
        if (email !== '') {
            await changePasswordUserById({ email: email, password: password });
            navigate && navigate();

            return {
                password: password,
                userName: email,
                navigate: navigate
            };
        }

        return null;
    }
)

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
    user: Omit<User, 'role'>
}

export const saveUser = createAsyncThunk(
    'user/saveUser',
    async ({ user }: SaveUserParamsType) => {
        await saveUserAPI(user);
    }
)