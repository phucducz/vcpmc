import moment from "moment";
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

export const formatToLocalStringCurrentDate = () => {
    let date = new Date();

    return `${formatDateDMY(date)} - ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

export const formatTime = (time: number) => {
    let minutes = Math.floor(time / 60);
    let timeForSeconds = time - (minutes * 60);
    let seconds = Math.floor(timeForSeconds);
    let secondsReadable = seconds > 9 ? seconds : `0${seconds}`;

    return `${minutes}:${secondsReadable}`;
}

export const getMoment = (array: Array<any>) => {
    let momentTime = moment
        ("00000000", "hh:mm:ss")
        .utcOffset(0)
        .set({ hour: 0, minute: 0, second: 0, millisecond: 0 });

    array.filter(item => {
        let timeSplit = item.time.split(':');
        momentTime.add("minutes", timeSplit[0]).add("seconds", timeSplit[1]);
    });

    return momentTime.toISOString();
}