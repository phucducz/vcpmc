import { createAsyncThunk } from "@reduxjs/toolkit";

import { ETMContractType, EtmContract, EtmContractDetail, EtmContractForControl, addContractTypesAPI, addEmployeeToContract, checkpointContracts, deleteContractById, deleteContractTypesAPI, deleteEmployeesById, getETMContractTypes, getEtmContractById, getEtmContractForControlList, getEtmContracts, getEtmContractsDetail, saveETMContract, updateContractTypesById } from "~/api/etmContractAPI";
import { User, addUserAPI } from "~/api/userAPI";
import { getUsers, saveUser } from "./userThunk";
import { firestoreDatabase } from "~/config/firebase";
import { doc, updateDoc } from "firebase/firestore";

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
        const etmContract = {
            ...contract,
            checkpointDate: '',
            CPM: 2280000,
            performanceRight: 40,
            productionRight: 40,
            royalties: 0.5,
            unDistributedRevenue: 0,
            vcpmcRight: 20,
            employeeIds: []
        }

        if (user.id === '') {
            newUser = await addUserAPI(user);
            await saveETMContract({ contract: { ...etmContract, usersId: newUser.id } });
        }
        else {
            thunkAPI.dispatch(saveUser({ user }));
            await saveETMContract({ contract: { ...etmContract } });
        }

        navigate();
    }
);

export const cancelEntrustmentContract = createAsyncThunk(
    'etmContract/cancelEntrustmentContract',
    async (contract: { id: string, status: string }) => {
        await updateDoc(doc(firestoreDatabase, 'entrustmentContract', `${contract.id}`), { ...contract });
        // await saveETMContract({ contract });
    }
);

export const getEtmContractListDetail = createAsyncThunk(
    'etmContract/getEtmContractListDetail',
    async () => {
        return await getEtmContractsDetail();
    }
);

export const getEtmContractForControls = createAsyncThunk(
    'etmContract/getEtmContractForControls',
    async () => {
        return await getEtmContractForControlList();
    }
);

export const getEtmContractTypes = createAsyncThunk(
    'etmContract/getEtmContractTypes',
    async () => {
        return await getETMContractTypes();
    }
);

export const updateEtmContractTypes = createAsyncThunk(
    'etmContract/updateEtmContractTypes',
    async ({ types, navigate }: { types: Array<ETMContractType>, navigate: () => void }) => {
        await updateContractTypesById(types);
        navigate();
    }
);

export const addEtmContractType = createAsyncThunk(
    'etmContract/addEtmContractTypes',
    async ({ type }: { type: ETMContractType }, thunkAPI) => {
        await addContractTypesAPI(type);
        thunkAPI.dispatch(getEtmContractTypes());
    }
);

export const deleteEtmContractType = createAsyncThunk(
    'etmContract/deleteEtmContractType',
    async ({ id }: { id: string }, thunkAPI) => {
        await deleteContractTypesAPI(id);
        thunkAPI.dispatch(getEtmContractTypes());
    }
);

export const addEmployee = createAsyncThunk(
    'etmContract/addEmployee',
    async ({ user, employeeIds, navigate, entrustmentContractId }: {
        user: Omit<User, 'role' | 'id'>;
        navigate: () => void;
        employeeIds: Array<string>;
        entrustmentContractId: string;
    }, thunkAPI) => {
        await addEmployeeToContract({ user, employeeIds, entrustmentContractId });

        await thunkAPI.dispatch(getEtmContractListDetail());
        await thunkAPI.dispatch(getUsers());

        navigate();
    }
);

export const updateEmployee = createAsyncThunk(
    'etmContract/updateEmployee',
    async ({ user, navigate }: {
        user: Omit<User, 'role'>;
        navigate: () => void;
    }, thunkAPI) => {
        await thunkAPI.dispatch(saveUser({ user }));

        await thunkAPI.dispatch(getUsers());

        navigate();
    }
);

export const deleteEmployees = createAsyncThunk(
    'etmContract/deleteEmployees',
    async ({ currentEmployees, employeeIds, id }: { currentEmployees: Array<string>, id: string, employeeIds: Array<string> }, thunkAPI) => {
        if (id === '') return;

        await deleteEmployeesById({ currentEmployees, id, employeeIds });

        await thunkAPI.dispatch(getEtmContractListDetail());
        await thunkAPI.dispatch(getUsers());
    }
);

export const deleteContracts = createAsyncThunk(
    'etmContract/deleteContracts',
    async (contracts: Array<EtmContractDetail>, thunkAPI) => {
        await deleteContractById(contracts);

        await thunkAPI.dispatch(getEtmContractListDetail());
        await thunkAPI.dispatch(getUsers());
    }
);

export const checkpointAllContract = createAsyncThunk(
    'etmContract/checkpointAllContract',
    async ({ contracts, checkpointDate }: { contracts: Array<EtmContractForControl>; checkpointDate: string }, thunkAPI) => {
        await checkpointContracts({ contracts, checkpointDate });

        thunkAPI.dispatch(getEtmContractForControls());
    }
);