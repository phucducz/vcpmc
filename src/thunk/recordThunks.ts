import { createAsyncThunk } from "@reduxjs/toolkit";
import { getRecordList } from "~/api/recordAPI";
import { Type } from "~/api/typeAPI";

export const getRecords = createAsyncThunk(
    'record/getList',
    async ({ typeList }: { typeList: Array<Type> }) => {
        const result = await getRecordList();

        return result.map(item => ({
            author: item.author,
            singer: item.singer,
            ISRCCode: item.ISRCCode,
            expiryDate: item.expiryDate,
            time: item.time,
            nameRecord: item.nameRecord,
            format: item.format,
            type: typeList.find(type => item.typesId === type.id) || {} as Type,
        }));
    }
);