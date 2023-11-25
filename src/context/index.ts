import { useLocation } from "react-router";

export const useQuery = () => {
    const location = useLocation();
    return new URLSearchParams(location.search);
}

export const getCurrentDate = () => {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();

    return mm + '/' + dd + '/' + yyyy;
}

export const formatDateDMY = (date: Date) => {
    let yyyy = date.getFullYear();
    let mm = date.getMonth() + 1;
    let dd = date.getDate();
    let day = `${dd}`, month = `${mm}`;

    if (dd < 10)
        day = `0${dd}`;
    if (mm < 10)
        month = `0${mm}`;

    return `${day}/${month}/${yyyy}`;
}

export const formatDateMDY = (date: string) => {
    let dateList = date.split('/');

    return dateList[1] + '/' + dateList[0] + '/' + dateList[2];
}