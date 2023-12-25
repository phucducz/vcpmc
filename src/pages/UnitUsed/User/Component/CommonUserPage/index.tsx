import classNames from "classnames/bind";
import { useSelector } from "react-redux";

import { BlockInput } from "~/components/Block";
import { Button } from "~/components/Button";
import { Form } from "~/components/Form";
import Loading from "~/components/Loading";
import { PagingItemType } from "~/components/Paging";
import { CommonPage } from "~/pages/CommonPage";
import { RootState } from "~/store";
import style from './CommonPage.module.scss';

const cx = classNames.bind(style);

type CommonUserPageProps = {
    title: string;
    formik: any;
    pagingData: Array<PagingItemType>;
    handleCloseAction: () => void;
    inputs: any;
}

export const CommonUserPage = (({ title, formik, pagingData, inputs, handleCloseAction }: CommonUserPageProps) => {
    const etmContract = useSelector((state: RootState) => state.etmContract);

    return (
        <CommonPage pagingData={pagingData} title={title}>
            <Form visible={true} onSubmit={formik.handleSubmit} className={cx('form')}>
                <div className={cx('form__body')}>
                    <BlockInput data={inputs.slice(0, 3)} />
                    <BlockInput data={inputs.slice(3, inputs.length)} />
                </div>
                <div className={cx('form__note')}>
                    <p>*</p>
                    <p>là những trường thông tin bắt buộc</p>
                </div>
                <div className={cx('form__footer')}>
                    <Button outline type='button' onClick={handleCloseAction}>Hủy</Button>
                    <Button type='submit'>Lưu</Button>
                </div>
            </Form>
            <Loading visible={etmContract.loading} />
        </CommonPage>
    );
});