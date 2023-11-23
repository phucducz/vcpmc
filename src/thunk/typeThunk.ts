import { createAsyncThunk } from "@reduxjs/toolkit";
import { getTypeList } from "~/api/typeAPI";


export const getTypes = createAsyncThunk(
    'type/getTypes',
    async () => {
        const result = await getTypeList();

        return result.map(item => ({
            id: item.id,
            name: item.name
        }));
    }
);