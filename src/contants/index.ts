import * as yup from 'yup';

import { languageIcon } from '../images';

const languages = [
    {
        title: 'Tiếng Việt',
        icon: languageIcon.vn
    }, {
        title: 'English',
        icon: languageIcon.en
    }, {
        title: 'France',
        icon: languageIcon.fn
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
]

const Yup = yup;

export { languages, Yup, ROLES }