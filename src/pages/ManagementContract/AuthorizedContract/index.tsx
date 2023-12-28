import classNames from "classnames/bind";

import { CommonPage } from "~/pages/CommonPage";
import style from './AuthorizedContract.module.scss';
import { Table } from "~/components/Table";

const cx = classNames.bind(style);

function AuthorizedContractManagementPage() {
    return (
        <CommonPage
            title='Danh sách hợp đồng'
        >
            <Table
                thead={['']}
            >
                <tr></tr>
            </Table>
        </CommonPage>
    );
}

export default AuthorizedContractManagementPage;