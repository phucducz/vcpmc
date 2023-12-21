import classNames from "classnames/bind";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

import { Button } from "~/components/Button";
import { Form } from "~/components/Form";
import { Input } from "~/components/Input";
import { PagingItemType } from "~/components/Paging";
import { routes } from "~/config/routes";
import { Yup } from "~/constants";
import { CommonPage } from "~/pages/CommonPage";
import { setExpiredWarningDate } from "~/reducers/etmContract";
import { RootState, useAppDispatch } from "~/store";
import style from './Contract.module.scss';

const cx = classNames.bind(style);

function EditExpirationContractPage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const etmContract = useSelector((state: RootState) => state.etmContract);

    const [paging, setPaging] = useState<Array<PagingItemType>>([] as Array<PagingItemType>);

    const contractFormik = useFormik({
        initialValues: {
            exiprationDays: etmContract.expiredWarningDate
        },
        validationSchema: Yup.object({
            exiprationDays: Yup.string().required()
        }),
        onSubmit: values => {
            dispatch(setExpiredWarningDate({
                expirationDate: values.exiprationDays,
                navigate: () => navigate(routes.ConfigContract)
            }));
        }
    });

    useEffect(() => {
        setPaging([
            {
                title: 'Cài đặt',
                to: routes.ConfigContract,
                active: true
            }, {
                title: 'Quản lý loại hợp đồng',
                to: routes.ConfigContract,
                active: true
            }
        ]);
    }, []);

    return (
        <CommonPage
            title='Loại hợp đồng'
            className={cx('config-edit-contract')}
            pagingData={paging}
        >
            <Form
                className={cx('config-edit-contract__form')}
                visible={true}
                onSubmit={contractFormik.handleSubmit}
            >
                <div className={cx('form__body')}>
                    <p className={cx('form__body__title')}>Cảnh báo hết hạn khai thác tác phẩm</p>
                    <div className={cx('form__body__input')}>
                        <p>Hợp đồng được cảnh báo trước thời gian hết hạn:</p>
                        <Input
                            value={contractFormik.values.exiprationDays}
                            errorMessage={contractFormik.errors.exiprationDays}
                            touched={contractFormik.touched.exiprationDays}
                            onChange={(e: any) => contractFormik.setFieldValue('exiprationDays', e.target.value)}
                            onFocus={() => contractFormik.setFieldTouched('expirationDays', true)}
                            onBlur={() => contractFormik.setFieldTouched('expirationDays', false)}
                        />
                        <p>ngày</p>
                    </div>
                </div>
                <div className={cx('form__footer')}>
                    <Button outline type='button' onClick={() => navigate(routes.ConfigContract)}>Hủy</Button>
                    <Button type='submit'>Lưu</Button>
                </div>
            </Form>
        </CommonPage>
    );
}

export default EditExpirationContractPage;