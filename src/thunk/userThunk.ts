import { createAsyncThunk } from "@reduxjs/toolkit";

import { User, changePasswordUserById, getUserById } from "../api/userAPI";
import { Role } from "~/reducers/role";
import { checkLogin } from "~/api/login";

export const changePassword = createAsyncThunk(
    'user/changePassword',
    async ({ email, password, navigate }: Pick<User, 'email' | 'password'> & {
        navigate: () => void
    }) => {
        if (email !== '') {
            await changePasswordUserById({ email: email, password: password });
            navigate();

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
            console.log(result);

            return {
                user: result,
                navigate: () => navigate()
            }
        }

        return null;
    }
)