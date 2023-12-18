import { createSlice } from "@reduxjs/toolkit";

import { addUser, changeInfoUserById, changePassword, changePasswordStatusUser, deleteUser, getUsers, login, saveUser } from "../thunk/userThunk";
import { User } from "~/api/userAPI";

type Status = '' | 'Sai tên tài khoản hoặc mật khẩu' | 'Đăng nhập thành công'
    | 'Đổi mật khẩu thất bại' | 'Đổi mật khẩu thành công';

type InitialStateType = {
    currentUser: User;
    loading: boolean;
    status: Status;
    users: Array<User>;
}

const initialState: InitialStateType = {
    currentUser: {} as User,
    loading: false,
    status: '',
    users: []
}

const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        setDataUser: (state, action) => {
            state.currentUser = { ...action.payload }
        },
        setNewData: (state, action) => {
            state.currentUser = { ...state.currentUser, ...action.payload };
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(changePassword.pending, (state) => {
                state.status = '';
                state.loading = true;
            })
            .addCase(changePassword.fulfilled, (state, action) => {
                console.log(action);

                if (action.payload) {
                    state.currentUser = {
                        ...state.currentUser,
                        ...action.payload
                    }
                    state.loading = false;
                    state.status = 'Đổi mật khẩu thành công';

                    action.payload.navigate && action.payload.navigate();
                } else {
                    state.loading = false;
                    state.status = 'Đổi mật khẩu thất bại';
                }
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.loading = false;
                console.log(new Error(`${action.error.name}: ${action.error.message}`));
            })
            .addCase(getUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(getUsers.fulfilled, (state, action) => {
                state.users = action.payload;
                state.loading = false;
            })
            .addCase(getUsers.rejected, (state, action) => {
                state.loading = false;
                console.log(new Error(`${action.error.name}: ${action.error.message}`));
            })
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.status = '';
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;

                if (action.payload?.user) {
                    if (action.payload.user)
                        state.currentUser = {
                            ...action.payload.user,
                            role: action.payload.user.role || { id: '', name: '' }
                        }
                    state.status = 'Đăng nhập thành công';

                    action.payload.navigate();
                }
                else {
                    state.currentUser = {} as User;
                    state.status = 'Sai tên tài khoản hoặc mật khẩu';
                }
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                console.log(new Error(`${action.error.name}: ${action.error.message}`));
            })
            .addCase(changeInfoUserById.pending, (state) => {
                state.status = '';
                state.loading = true;
            })
            .addCase(changeInfoUserById.fulfilled, (state, action) => {
                if (action.payload) {
                    state.currentUser = {
                        ...state.currentUser,
                        ...action.payload
                    }
                    state.loading = false;
                }
            })
            .addCase(changeInfoUserById.rejected, (state, action) => {
                state.loading = false;
                console.log(new Error(`${action.error.name}: ${action.error.message}`));
            })
            .addCase(changePasswordStatusUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(changePasswordStatusUser.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(changePasswordStatusUser.rejected, (state, action) => {
                state.loading = false;
                console.log(new Error(`${action.error.name}: ${action.error.message}`));
            })
            .addCase(saveUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(saveUser.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(saveUser.rejected, (state, action) => {
                state.loading = false;
                console.log(new Error(`${action.error.name}: ${action.error.message}`));
            })
            .addCase(addUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(addUser.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(addUser.rejected, (state, action) => {
                state.loading = false;
                console.log(new Error(`${action.error.name}: ${action.error.message}`));
            })
            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                console.log(new Error(`${action.error.name}: ${action.error.message}`));
            })
    }
});

export const { reducer: userReducer } = userSlice;
export const { setDataUser, setNewData } = userSlice.actions;