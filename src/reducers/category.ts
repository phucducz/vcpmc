import { createSlice } from "@reduxjs/toolkit";

import { Category } from "~/api/categoryAPI";
import { getCategories } from "~/thunk/categoryThunk";

type InitialStateType = {
    categoryList: Array<Category>;
    loading: boolean
}

const initialState: InitialStateType = {
    categoryList: [],
    loading: false
}

const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(getCategories.pending, state => {
            state.loading = true;
        });
        builder.addCase(getCategories.fulfilled, (state, action) => {
            state.loading = false;

            if (action.payload)
                state.categoryList = action.payload;
        });
        builder.addCase(getCategories.rejected, (state, action) => {
            state.loading = false;
            throw new Error(`${action.error.name}: ${action.error.message}`);
        });
    }
});

export const { reducer: categoryReducer } = categorySlice;