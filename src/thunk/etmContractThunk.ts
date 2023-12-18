import { createAsyncThunk } from "@reduxjs/toolkit";

import { getEtmContracts, getEtmContractById, saveETMContract, EtmContract, getEtmContractsDetail } from "~/api/etmContractAPI";
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