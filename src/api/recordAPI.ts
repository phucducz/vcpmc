import { getService } from "~/service";
import { Type } from "./typeAPI";

export type Record = {
    author: string;
    singer: string;
    ISRCCode: string;
    expiryDate: string;
    time: string;
    nameRecord: string;
    format: 'Ballad' | 'Pop' | 'EDM';
    type: Type;
}

export const getRecordList = async () => {
    return await getService('records');
}