import { createAsyncThunk } from "@reduxjs/toolkit";

import { getEtmContracts, getEtmContractById, saveETMContract, EtmContract, getEtmContractsDetail, getETMContractTypes, ETMContractType, updateContractTypesById, addContractTypesAPI, deleteContractTypesAPI } from "~/api/etmContractAPI";
import { saveUser } from "./userThunk";
import { User, addUserAPI } from "~/api/userAPI";

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

type SaveEntrustmentContractParamsType = {
    contract: EtmContract;
    user: Omit<User, 'role'>;
    navigate: () => void;
}

export const saveEntrustmentContract = createAsyncThunk(
    'etmContract/saveEntrustmentContract',
    async (
        { contract, user, navigate }: SaveEntrustmentContractParamsType,
        thunkAPI
    ) => {
        let newUser;

        if (user.id === '') {
            newUser = await addUserAPI(user);
            await saveETMContract({ contract: { ...contract, usersId: newUser.id } });
        }
        else {
            thunkAPI.dispatch(saveUser({ user }));
            await saveETMContract({ contract: { ...contract } });
        }

        navigate();
    }
);

export const cancelEntrustmentContract = createAsyncThunk(
    'etmContract/cancelEntrustmentContract',
    async ({ contract }: { contract: EtmContract }) => {
        await saveETMContract({ contract });
    }
);

export const getEtmContractListDetail = createAsyncThunk(
    'etmContract/getEtmContractListDetail',
    async () => {
        return await getEtmContractsDetail();
    }
)

export const getEtmContractTypes = createAsyncThunk(
    'etmContract/getEtmContractTypes',
    async () => {
        return await getETMContractTypes();
    }
)

export const updateEtmContractTypes = createAsyncThunk(
    'etmContract/updateEtmContractTypes',
    async ({ types, navigate }: { types: Array<ETMContractType>, navigate: () => void }, thunkAPI) => {
        await updateContractTypesById(types);
        navigate();
    }
)

export const addEtmContractType = createAsyncThunk(
    'etmContract/addEtmContractTypes',
    async ({ type }: { type: ETMContractType }, thunkAPI) => {
        await addContractTypesAPI(type);
        thunkAPI.dispatch(getEtmContractTypes());
    }
)

export const deleteEtmContractType = createAsyncThunk(
    'etmContract/deleteEtmContractType',
    async ({ id }: { id: string }, thunkAPI) => {
        await deleteContractTypesAPI(id);
        thunkAPI.dispatch(getEtmContractTypes());
    }
)