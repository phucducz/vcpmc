import { createAsyncThunk } from "@reduxjs/toolkit";

import { getEtmContracts, getEtmContractById } from "~/api/etmContractAPI";

export const getEtmContractList = createAsyncThunk(
    'etmContract/getEtmContractList',
    async () => {
        return await getEtmContracts();
    }
);

export const getETMContractById = createAsyncThunk(
    'etmContract/getETMContractById',
    async (id: string) => {
        return await getEtmContractById(id);
    }
);