import { createSlice } from "@reduxjs/toolkit";

import { changePassword, login } from "../thunk/userThunk";
import { User } from "~/api/userAPI";

type Status = '' | 'Sai tên tài khoản hoặc mật khẩu' | 'loggedIn' | 'Đổi mật khẩu thất bại';

type InitialStateType = {
    currentUser: User;
    loading: boolean;
    status: Status
}

const initialState: InitialStateType = {
    currentUser: {} as User,
    loading: false,
    status: ''
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
                state.loading = true;
            })
            .addCase(changePassword.fulfilled, (state, action) => {
                console.log(action);
                
                if (action.payload) {
                    state.currentUser = {
                        ...state.currentUser,
                        ...action.payload
                    }
                    // state.currentUser.password = action.payload.password;
                    // state.currentUser.userName = action.payload.email;
                    state.loading = false;
                    
                    action.payload.navigate();
                } else {
                    state.loading = false;
                    state.status = 'Đổi mật khẩu thất bại';
                }
            })
            .addCase(changePassword.rejected, (state, action) => {
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
                    let { avatar, dateOfBirth, email, firstName, id, lastName,
                        password, phoneNumber, role, userName } = action.payload.user;

                    state.currentUser = {
                        avatar: avatar,
                        dateOfBirth: dateOfBirth,
                        email: email,
                        firstName: firstName,
                        id: id,
                        lastName: lastName,
                        password: password,
                        phoneNumber: phoneNumber,
                        role: role || { id: '', role: '' },
                        userName: userName
                    };
                    state.status = 'loggedIn';

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
    }
});

export const { reducer: userReducer } = userSlice;
export const { setDataUser, setNewData } = userSlice.actions;