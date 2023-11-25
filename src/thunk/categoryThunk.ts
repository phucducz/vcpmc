import { createAsyncThunk } from "@reduxjs/toolkit";
import { getCategoryList } from "~/api/categoryAPI";


export const getCategories = createAsyncThunk(
    'type/getCategories',
    async () => {
        const result = await getCategoryList();

        return result.map(item => ({
            id: item.id,
            name: item.name
        }));
    }
);