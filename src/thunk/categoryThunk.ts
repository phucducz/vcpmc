import { createAsyncThunk } from "@reduxjs/toolkit";
import { Category, addCategoryAPI, getCategoryList, updateCategoriesById } from "~/api/categoryAPI";


export const getCategories = createAsyncThunk(
    'type/getCategories',
    async () => {
        return await getCategoryList();
    }
);

export const updateCategories = createAsyncThunk(
    'type/updateCategories',
    async ({ categories, navigate }: { categories: Array<Category>, navigate: () => void }, thunkAPI) => {
        await updateCategoriesById(categories);
        await thunkAPI.dispatch(getCategories());

        navigate();
    }
);

export const addCategory = createAsyncThunk(
    'type/addCategory',
    async ({ category }: { category: Category }, thunkAPI) => {
        await addCategoryAPI(category);
        thunkAPI.dispatch(getCategories());
    }
);