import { faFileExport } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { useSelector } from "react-redux";
import { EtmContractForControl } from "~/api/etmContractAPI";
import { PagingItemType } from "~/components/Paging";
import { routes } from "~/config/routes";
import { RootState } from "~/store";
import { CommonDetailPage } from "../Component/CommonDetailPage";
import style from './Detail.module.scss';

const cx = classNames.bind(style);

function HistoryForControlDetailPage() {
    const { id } = useParams();

    const etmContract = useSelector((state: RootState) => state.etmContract);

    const [paging, setPaging] = useState<Array<PagingItemType>>([] as Array<PagingItemType>);
    const [actionData, setActionData] = useState<any[]>([] as any[]);
    const [entrustmentContract, setEntrustmentContract] = useState<EtmContractForControl>({} as EtmContractForControl);
    const [monthPeriod, setMonthPeriod] = useState<string>('');

    useEffect(() => {
        document.title = 'Chi tiết lịch sử đối soát doanh thu';

        setPaging([
            {
                title: 'Doanh thu',
                to: routes.HistoryForControl,
                active: true
            }, {
                title: 'Lịch sử đối soát',
                to: routes.HistoryForControl,
                active: true
            }, {
                title: 'Chi tiết',
                to: '#',
                active: false
            }
        ]);

        setActionData([{
            icon: <FontAwesomeIcon icon={faFileExport} />,
            title: 'Xuất dữ liệu',
            onClick: () => { }
        }]);

        let currentContract = etmContract.etmContractForControl.find(contract => contract.id === id);

        if (typeof currentContract !== 'undefined') setEntrustmentContract(currentContract);
    }, []);

    useEffect(() => {
        let monthPeriodSplit = entrustmentContract.checkpointDate?.split('/');

        typeof monthPeriodSplit !== 'undefined'
            && setMonthPeriod(`${monthPeriodSplit[1]}/${monthPeriodSplit[2]}`);
    }, [entrustmentContract]);

    return (
        <CommonDetailPage
            title={`Doanh thu theo hợp đồng - ${entrustmentContract.code} - Kỳ Tháng ${monthPeriod}`}
            pagingData={paging}
            actionData={actionData}
        />
    )
}

export default HistoryForControlDetailPage;