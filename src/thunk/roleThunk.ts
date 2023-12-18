import { createAsyncThunk } from "@reduxjs/toolkit";
import { Role, addRoleAPI, deleteRoleAPI, getListRole, updateRoleById } from "~/api/roleAPI";

export const getRoles = createAsyncThunk(
    'role/getRoles',
    async () => {
        return await getListRole();
    }
);

export const updateRole = createAsyncThunk(
    'role/updateRole',
    async ({ role, navigate }: { role: Role, navigate: () => void }) => {
        await updateRoleById(role);
        navigate();
    }
);

export const addRole = createAsyncThunk(
    'role/addRole',
    async ({ role, navigate }: { role: Omit<Role, 'id'>, navigate: () => void }, thunkAPI) => {
        await addRoleAPI(role);
        thunkAPI.dispatch(getRoles());

        navigate();
    }
);

export const deleteRole = createAsyncThunk(
    'role/deleteRole',
    async (id: string, thunkAPI) => {
        await deleteRoleAPI(id);
        thunkAPI.dispatch(getRoles());
    }
);