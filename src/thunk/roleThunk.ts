import { createAsyncThunk } from "@reduxjs/toolkit";
import { getListRole } from "~/api/roleAPI";
import { Role } from "~/reducers/role";

export const getRoles = createAsyncThunk(
    'role/getRoles',
    async () => {
        const result = await getListRole();
        let roles: Array<Role> = [];

        roles = result.map(role => {
            return {
                id: role.id,
                role: role.role
            }
        });
        
        return roles;
    }
)