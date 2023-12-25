import * as yup from 'yup';

import { ReactNode } from 'react';
import { windows10Icon } from '~/icons';
import { LANGUAGE_ICONS } from '../images';
import android from '../images/android.png';
import upload from '../images/toolUpload.png';

const Yup = yup;

const LANGUAGE_ITEMS = [
    {
        title: 'Tiếng Việt',
        icon: LANGUAGE_ICONS.VN
    }, {
        title: 'English',
        icon: LANGUAGE_ICONS.EN
    }
];

const ROLES = [
    {
        id: 1,
        roleName: 'user'
    }, {
        id: 2,
        roleName: 'admin'
    }
];

export {
    LANGUAGE_ITEMS, ROLES, Yup
};

export interface Quarter {
    quarter: string;
    time: string;
}

export const QUARTERLY: Array<Quarter> = [
    {
        quarter: 'Quý 1',
        time: '01/06 - 30/07'
    }, {
        quarter: 'Quý 2',
        time: '01/08 - 30/09'
    }, {
        quarter: 'Quý 3',
        time: '01/10 - 30/11'
    }, {
        quarter: 'Quý 4',
        time: '01/12 - 31/12'
    }
];

type DownloadItem = {
    image: any;
    title: string;
    format: string;
}

export const DOWNLOAD_ITEMS: Array<DownloadItem> = [
    {
        image: upload,
        title: 'Tool Upload',
        format: 'image'
    }, {
        image: windows10Icon,
        title: 'Tải App Windows',
        format: 'icon'
    }, {
        image: android,
        title: 'Tải App Android',
        format: 'image'
    }
];