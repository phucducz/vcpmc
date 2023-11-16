import { createSlice } from "@reduxjs/toolkit";

import { changePassword } from "../thunk/userThunk";
import { User } from "../api/user";

type initialStateType = {
    currentUser: User;
    loading: boolean
}

const initialState: initialStateType = {
    currentUser: {
        dateOfBirth: '',
        email: '',
        firstName: '',
        id: '',
        lastName: '',
        password: '',
        phoneNumber: '',
        rolesId: '',
        userName: ''
    },
    loading: false
}

const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        setDataUser: (state, action) => {
            state.currentUser = { ...action.payload }
        },
        setPassword: (state, action) => {
            state.currentUser.password = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(changePassword.pending, (state: initialStateType) => {
                state.loading = true;
            })
            .addCase(changePassword.fulfilled, (state: initialStateType, action) => {
                state.loading = false;
                console.log(action);
            })
            .addCase(changePassword.rejected, (state: initialStateType) => {
                console.log(new Error('Change password failure. Try again, pls!'));
            })
    }
});

export const { reducer: userReducer } = userSlice;
export const { setDataUser, setPassword } = userSlice.actions;