import * as yup from 'yup';

import { LANGUAGE_ICONS } from '../images';

const Yup = yup;

const LANGUAGE_ITEMS = [
    {
        title: 'Tiếng Việt',
        icon: LANGUAGE_ICONS.VN
    }, {
        title: 'English',
        icon: LANGUAGE_ICONS.EN
    }, {
        title: 'France',
        icon: LANGUAGE_ICONS.FN
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
    LANGUAGE_ITEMS,
    Yup,
    ROLES
}