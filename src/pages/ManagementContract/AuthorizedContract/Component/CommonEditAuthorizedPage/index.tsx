import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames/bind";
import { ReactNode, memo, useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { BlockInfo, BlockInput } from "~/components/Block";
import { Button } from "~/components/Button";
import { ComboBox } from "~/components/ComboBox";
import { Input } from "~/components/Input";
import { PagingItemType } from "~/components/Paging";
import { RadioButton } from "~/components/RadioButton";
import { TabItemProps } from "~/components/Tab";
import { Upload } from "~/components/Upload";
import { CommonPage } from "~/pages/CommonPage";
import style from './CommonPage.module.scss';
import { useMenu } from "~/context/hooks";

const cx = classNames.bind(style);

type CommonPageAuthorizedContractEditProps = {
    title: string;
    edit: boolean;
    setEdit: React.Dispatch<React.SetStateAction<boolean>>;
    data: Array<any>;
    pagingData: Array<PagingItemType>;
    formikData: any;
    actionData?: Array<any>;
    children?: ReactNode;
}

export const CommonPageAuthorizedContractEdit = memo(({ title, edit, setEdit, data, pagingData, formikData, actionData = [], children }: CommonPageAuthorizedContractEditProps) => {
    const { setActive } = useMenu();

    const [tab, setTab] = useState<TabItemProps[]>([]);
    const [visibleComboBox, setVisibleComboBox] = useState<boolean>(false);

    useEffect(() => {
        setTab([
            {
                title: 'Thông tin hợp đồng',
                onClick: () => { },
            }, {
                title: 'Tác phẩm uỷ quyền',
                onClick: () => { },
            }
        ]);
    }, []);

    const BLOCK_INPUTS_1 = [
        {
            fieldName: 'Số hợp đồng:',
            isRequired: true,
            input: <Input
                type='text'
                name='contractCode'
                value={formikData.values.contractCode}
                errorMessage={formikData.errors.contractCode}
                touched={formikData.touched.contractCode}
                onChange={formikData.handleChange}
                onFocus={() => formikData.setFieldTouched('contractCode', true)}
                onBlur={() => formikData.setFieldTouched('contractCode', false)}
            />
        }, {
            fieldName: 'Tên hợp đồng:',
            isRequired: true,
            input: <Input
                type='text'
                name='customer'
                value={formikData.values.customer}
                errorMessage={formikData.errors.customer}
                touched={formikData.touched.customer}
                onChange={formikData.handleChange}
                onFocus={() => formikData.setFieldTouched('customer', true)}
                onBlur={() => formikData.setFieldTouched('customer', false)}
            />
        }, {
            fieldName: 'Ngày hiệu lực:',
            isRequired: true,
            input: <Input
                type='date'
                name='effectiveDate'
                value={formikData.values.effectiveDate}
                errorMessage={formikData.errors.effectiveDate}
                touched={formikData.touched.effectiveDate}
                onChange={formikData.handleChange}
                onFocus={() => formikData.setFieldTouched('effectiveDate', true)}
                onBlur={() => formikData.setFieldTouched('effectiveDate', false)}
            />
        }, {
            fieldName: 'Ngày hết hạn:',
            isRequired: true,
            input: <Input
                type='date'
                name='expirationDate'
                value={formikData.values.expirationDate}
                errorMessage={formikData.errors.expirationDate}
                touched={formikData.touched.expirationDate}
                onChange={formikData.handleChange}
                onFocus={() => formikData.setFieldTouched('expirationDate', true)}
                onBlur={() => formikData.setFieldTouched('expirationDate', false)}
            />
        }, {
            fieldName: 'Tình trạng:',
            isRequired: true,
            input: <ComboBox
                active={formikData.values.status}
                data={[]}
                onClick={() => { }}
                className={cx('block__input__status')}
            />
        }
    ];

    const BLOCK_INPUTS_2_ORGANIZATION = [
        {
            fieldName: 'Pháp nhân ủy quyền:',
            input: <div className={cx("block__input__authorized-person")}>
                <RadioButton
                    title='Cá nhân'
                    checked={formikData.values.authorizingLegalEntity === 'Cá nhân'}
                    onChange={() => formikData.setFieldValue('authorizingLegalEntity', 'Cá nhân')}
                />
                <RadioButton
                    title='Tổ chức'
                    checked={formikData.values.authorizingLegalEntity === 'Tổ chức'}
                    onChange={() => formikData.setFieldValue('authorizingLegalEntity', 'Tổ chức')}
                />
            </div>
        }, {
            fieldName: 'Tên tổ chức:',
            isRequired: true,
            input: <Input
                type='text'
                name='companyName'
                value={formikData.values.companyName}
                onChange={formikData.handleChange}
                errorMessage={formikData.errors.companyName}
                touched={formikData.touched.companyName}
                onFocus={() => formikData.setFieldTouched('companyName', true)}
                onBlur={() => formikData.setFieldTouched('companyName', false)}
            />
        }, {
            fieldName: 'Mã số thuế:',
            isRequired: true,
            input: <Input
                type='text'
                name='taxCode'
                value={formikData.values.taxCode}
                onChange={formikData.handleChange}
                errorMessage={formikData.errors.taxCode}
                touched={formikData.touched.taxCode}
                onFocus={() => formikData.setFieldTouched('taxCode', true)}
                onBlur={() => formikData.setFieldTouched('taxCode', false)}
            />
        }, {
            fieldName: 'Số tài khoản:',
            isRequired: true,
            input: <Input
                type='text'
                name='bankNumber'
                value={formikData.values.bankNumber}
                onChange={formikData.handleChange}
                errorMessage={formikData.errors.bankNumber}
                touched={formikData.touched.bankNumber}
                onFocus={() => formikData.setFieldTouched('bankNumber', true)}
                onBlur={() => formikData.setFieldTouched('bankNumber', false)}
            />
        }, {
            fieldName: 'Ngân hàng:',
            isRequired: true,
            input: <Input
                type='text'
                name='bank'
                value={formikData.values.bank}
                onChange={formikData.handleChange}
                errorMessage={formikData.errors.bank}
                touched={formikData.touched.bank}
                onFocus={() => formikData.setFieldTouched('bank', true)}
                onBlur={() => formikData.setFieldTouched('bank', false)}
            />
        }, {
            fieldName: 'Địa chỉ:',
            isRequired: true,
            input: <Input
                as='textarea'
                rows={5}
                cols={34}
                name='residence'
                value={formikData.values.residence}
                onChange={formikData.handleChange}
            />
        }
    ];

    const handleClick = useCallback((visible: boolean) => {
        setVisibleComboBox(visible);
    }, []);

    const handleItemClick = useCallback((item: any) => {
        formikData.setFieldValue('nationality', item.title);
    }, []);

    const BLOCK_INPUTS_2_PERSONAL = [
        {
            fieldName: 'Pháp nhân ủy quyền:',
            input: <div className={cx("block__input__authorized-person")}>
                <RadioButton
                    title='Cá nhân'
                    checked={formikData.values.authorizingLegalEntity === 'Cá nhân'}
                    onChange={() => formikData.setFieldValue('authorizingLegalEntity', 'Cá nhân')}
                />
                <RadioButton
                    title='Tổ chức'
                    checked={formikData.values.authorizingLegalEntity === 'Tổ chức'}
                    onChange={() => formikData.setFieldValue('authorizingLegalEntity', 'Tổ chức')}
                />
            </div>
        }, {
            fieldName: 'Tên người uỷ quyền:',
            isRequired: true,
            input: <Input
                type='text'
                name='fullName'
                value={formikData.values.fullName}
                onChange={formikData.handleChange}
                errorMessage={formikData.errors.fullName}
                touched={formikData.touched.fullName}
                onFocus={() => formikData.setFieldTouched('fullName', true)}
                onBlur={() => formikData.setFieldTouched('fullName', false)}
            />
        }, {
            fieldName: 'Ngày sinh:',
            isRequired: true,
            input: <Input
                type='date'
                name='dateOfBirth'
                value={formikData.values.dateOfBirth}
                onChange={formikData.handleChange}
                errorMessage={formikData.errors.dateOfBirth}
                touched={formikData.touched.dateOfBirth}
                onFocus={() => formikData.setFieldTouched('dateOfBirth', true)}
                onBlur={() => formikData.setFieldTouched('dateOfBirth', false)}
            />
        }, {
            fieldName: 'Giới tính:',
            isRequired: true,
            input: <div className={cx("block__input__authorized-person")}>
                <RadioButton
                    title='Nam'
                    checked={formikData.values.gender === 'Nam'}
                    onChange={() => formikData.setFieldValue('gender', 'Nam')}
                />
                <RadioButton
                    title='Nữ'
                    checked={formikData.values.gender === 'Tổ chức'}
                    onChange={() => formikData.setFieldValue('gender', 'Tổ chức')}
                />
            </div>
        }, {
            fieldName: 'Quốc tịch:',
            isRequired: true,
            input: <ComboBox
                data={[
                    { title: 'Việt Nam' },
                    { title: 'Mỹ' },
                    { title: 'Anh' }
                ]}
                active={formikData.values.nationality}
                className={cx('nationality-combo-box')}
                visible={visibleComboBox}
                onItemClick={handleItemClick}
                onClick={() => handleClick(!visibleComboBox)}
            />
        }, {
            fieldName: 'Số điện thoại:',
            isRequired: true,
            input: <Input
                type='text'
                name='phoneNumber'
                value={formikData.values.phoneNumber}
                onChange={formikData.handleChange}
                errorMessage={formikData.errors.phoneNumber}
                touched={formikData.touched.phoneNumber}
                onFocus={() => formikData.setFieldTouched('phoneNumber', true)}
                onBlur={() => formikData.setFieldTouched('phoneNumber', false)}
            />
        }
    ];

    const BLOCK_INPUTS_3_ORGANIZATION = [
        {
            fieldName: 'Người đại diện:',
            isRequired: true,
            input: <Input
                type='text'
                name='fullName'
                value={formikData.values.fullName}
                onChange={formikData.handleChange}
                errorMessage={formikData.errors.fullName}
                touched={formikData.touched.fullName}
                onFocus={() => formikData.setFieldTouched('fullName', true)}
                onBlur={() => formikData.setFieldTouched('fullName', false)}
            />
        }, {
            fieldName: 'Chức vụ:',
            isRequired: true,
            input: <Input
                type='text'
                name='role'
                value={formikData.values.role}
                onChange={formikData.handleChange}
                errorMessage={formikData.errors.role}
                touched={formikData.touched.role}
                onFocus={() => formikData.setFieldTouched('role', true)}
                onBlur={() => formikData.setFieldTouched('role', false)}
            />
        }, {
            fieldName: 'Ngày sinh:',
            isRequired: true,
            input: <Input
                type='date'
                name='dateOfBirth'
                value={formikData.values.dateOfBirth}
                onChange={formikData.handleChange}
                errorMessage={formikData.errors.dateOfBirth}
                touched={formikData.touched.dateOfBirth}
                onFocus={() => formikData.setFieldTouched('dateOfBirth', true)}
                onBlur={() => formikData.setFieldTouched('dateOfBirth', false)}
            />
        }, {
            fieldName: 'Giới tính:',
            isRequired: true,
            input: <div className={cx("block__input__authorized-person")}>
                <RadioButton
                    title='Nam'
                    checked={formikData.values.gender === 'Nam'}
                    onChange={() => formikData.setFieldValue('gender', 'Nam')}
                />
                <RadioButton
                    title='Nữ'
                    checked={formikData.values.gender === 'Nữ'}
                    onChange={() => formikData.setFieldValue('gender', 'Nữ')}
                />
            </div>
        }, {
            fieldName: 'CMND/CCCD:',
            isRequired: true,
            input: <Input
                type='text'
                name='idNumber'
                value={formikData.values.idNumber}
                onChange={formikData.handleChange}
                errorMessage={formikData.errors.idNumber}
                touched={formikData.touched.idNumber}
                onFocus={() => formikData.setFieldTouched('idNumber', true)}
                onBlur={() => formikData.setFieldTouched('idNumber', false)}
            />
        }, {
            fieldName: 'Ngày cấp:',
            isRequired: true,
            input: <Input
                type='date'
                name='dateRange'
                value={formikData.values.dateRange}
                onChange={formikData.handleChange}
                errorMessage={formikData.errors.dateRange}
                touched={formikData.touched.dateRange}
                onFocus={() => formikData.setFieldTouched('dateRange', true)}
                onBlur={() => formikData.setFieldTouched('dateRange', false)}
            />
        }, {
            fieldName: 'Nơi cấp:',
            isRequired: true,
            input: <Input
                type='text'
                name='issuedBy'
                value={formikData.values.issuedBy}
                onChange={formikData.handleChange}
                errorMessage={formikData.errors.issuedBy}
                touched={formikData.touched.issuedBy}
                onFocus={() => formikData.setFieldTouched('issuedBy', true)}
                onBlur={() => formikData.setFieldTouched('issuedBy', false)}
            />
        }, {
            fieldName: 'Quốc tịch:',
            isRequired: true,
            input: <ComboBox
                data={[
                    { title: 'Việt Nam' },
                    { title: 'Mỹ' },
                    { title: 'Anh' }
                ]}
                active={formikData.values.nationality}
                className={cx('nationality-combo-box')}
                visible={visibleComboBox}
                onItemClick={handleItemClick}
                onClick={() => handleClick(!visibleComboBox)}
            />
        }
    ];

    const BLOCK_INPUTS_3_PERSONAL = [
        {
            fieldName: 'CMND/CCCD:',
            isRequired: true,
            input: <Input
                type='text'
                name='idNumber'
                value={formikData.values.idNumber}
                onChange={formikData.handleChange}
                errorMessage={formikData.errors.idNumber}
                touched={formikData.touched.idNumber}
                onFocus={() => formikData.setFieldTouched('idNumber', true)}
                onBlur={() => formikData.setFieldTouched('idNumber', false)}
            />
        }, {
            fieldName: 'Ngày cấp:',
            isRequired: true,
            input: <Input
                type='date'
                name='dateRange'
                value={formikData.values.dateRange}
                onChange={formikData.handleChange}
                errorMessage={formikData.errors.dateRange}
                touched={formikData.touched.dateRange}
                onFocus={() => formikData.setFieldTouched('dateRange', true)}
                onBlur={() => formikData.setFieldTouched('dateRange', false)}
            />
        }, {
            fieldName: 'Nơi cấp:',
            isRequired: true,
            input: <Input
                type='text'
                name='issuedBy'
                value={formikData.values.issuedBy}
                onChange={formikData.handleChange}
                errorMessage={formikData.errors.issuedBy}
                touched={formikData.touched.issuedBy}
                onFocus={() => formikData.setFieldTouched('issuedBy', true)}
                onBlur={() => formikData.setFieldTouched('issuedBy', false)}
            />
        }, {
            fieldName: 'Mã số thuế:',
            isRequired: true,
            input: <Input
                type='text'
                name='taxCode'
                value={formikData.values.taxCode}
                onChange={formikData.handleChange}
                errorMessage={formikData.errors.taxCode}
                touched={formikData.touched.taxCode}
                onFocus={() => formikData.setFieldTouched('taxCode', true)}
                onBlur={() => formikData.setFieldTouched('taxCode', false)}
            />
        }, {
            fieldName: 'Nơi cư trú:',
            isRequired: true,
            input: <Input
                as='textarea'
                rows={5}
                cols={34}
                name='residence'
                value={formikData.values.residence}
                onChange={formikData.handleChange}
                errorMessage={formikData.errors.residence}
                touched={formikData.touched.residence}
                onFocus={() => formikData.setFieldTouched('residence', true)}
                onBlur={() => formikData.setFieldTouched('residence', false)}
            />
        }
    ];

    const BLOCK_INPUTS_4_PERSONAL = [
        {
            fieldName: 'Email:',
            input: <Input
                type='text'
                name='email'
                value={formikData.values.email}
                onChange={formikData.handleChange}
                errorMessage={formikData.errors.email}
                touched={formikData.touched.email}
                onFocus={() => formikData.setFieldTouched('email', true)}
                onBlur={() => formikData.setFieldTouched('email', false)}
            />
        }, {
            fieldName: 'Tên đăng nhập:',
            isRequired: true,
            input: <Input
                type='text'
                name='userName'
                value={formikData.values.userName}
                onChange={formikData.handleChange}
                errorMessage={formikData.errors.userName}
                touched={formikData.touched.userName}
                onFocus={() => formikData.setFieldTouched('userName', true)}
                onBlur={() => formikData.setFieldTouched('userName', false)}
            />
        }, {
            fieldName: 'Mật khẩu:',
            isRequired: true,
            input: <Input
                type='password'
                name='password'
                value={formikData.values.password}
                onChange={formikData.handleChange}
                errorMessage={formikData.errors.password}
                touched={formikData.touched.password}
                onFocus={() => formikData.setFieldTouched('password', true)}
                onBlur={() => formikData.setFieldTouched('password', false)}
            />
        }, {
            fieldName: 'Số tài khoản:',
            input: <Input
                type='password'
                name='bankNumber'
                value={formikData.values.bankNumber}
                onChange={formikData.handleChange}
                errorMessage={formikData.errors.bankNumber}
                touched={formikData.touched.bankNumber}
                onFocus={() => formikData.setFieldTouched('bankNumber', true)}
                onBlur={() => formikData.setFieldTouched('bankNumber', false)}
            />
        }, {
            fieldName: 'Ngân hàng:',
            input: <Input
                type='text'
                name='bank'
                value={formikData.values.bank}
                onChange={formikData.handleChange}
                errorMessage={formikData.errors.bank}
                touched={formikData.touched.bank}
                onFocus={() => formikData.setFieldTouched('bank', true)}
                onBlur={() => formikData.setFieldTouched('bank', false)}
            />
        }
    ];

    const BLOCK_INPUTS_4_ORGANIZATION = [
        {
            fieldName: 'Số điện thoại:',
            input: <Input
                type='text'
                name='phoneNumber'
                value={formikData.values.phoneNumber}
                onChange={formikData.handleChange}
                errorMessage={formikData.errors.phoneNumber}
                touched={formikData.touched.phoneNumber}
                onFocus={() => formikData.setFieldTouched('phoneNumber', true)}
                onBlur={() => formikData.setFieldTouched('phoneNumber', false)}
            />
        }, {
            fieldName: 'Email:',
            isRequired: true,
            input: <Input
                type='date'
                name='email'
                value={formikData.values.email}
                onChange={formikData.handleChange}
                errorMessage={formikData.errors.email}
                touched={formikData.touched.email}
                onFocus={() => formikData.setFieldTouched('email', true)}
                onBlur={() => formikData.setFieldTouched('email', false)}
            />
        }, {
            fieldName: 'Tên đăng nhập:',
            isRequired: true,
            input: <Input
                type='text'
                name='userName'
                value={formikData.values.userName}
                onChange={formikData.handleChange}
                errorMessage={formikData.errors.userName}
                touched={formikData.touched.userName}
                onFocus={() => formikData.setFieldTouched('userName', true)}
                onBlur={() => formikData.setFieldTouched('userName', false)}
            />
        }, {
            fieldName: 'Mật khẩu:',
            isRequired: true,
            input: <Input
                type='password'
                name='password'
                value={formikData.values.password}
                onChange={formikData.handleChange}
                errorMessage={formikData.errors.password}
                touched={formikData.touched.password}
                onFocus={() => formikData.setFieldTouched('password', true)}
                onBlur={() => formikData.setFieldTouched('password', false)}
            />
        }
    ];

    return (
        <CommonPage
            title={title}
            pagingData={pagingData}
            actionData={!edit ? actionData : []}
            tab={tab}
        >
            <form className={cx('form')} onSubmit={() => { }}>
                {edit
                    ? <div className={cx('form__edit')}>
                        <div className={cx('form__edit-top')}>
                            <BlockInput data={BLOCK_INPUTS_1} />
                            <BlockInput data={[{
                                fieldName: 'Đính kèm tệp:',
                                isRequired: true,
                                input: <Upload />
                            }]} />
                            <div className={cx('form__edit__block')}>
                                <div className={cx('block__title')}>
                                    <FontAwesomeIcon icon={faInfoCircle} />
                                    <p>Mức nhuận bút</p>
                                </div>
                                <div className={cx('block__own-block')}>
                                    <div className={cx('own-block__left')}>
                                        <p>Quyền tác giả:</p>
                                        <p>Quyền liên quan:</p>
                                        <p>Quyền của người biểu diễn:</p>
                                        <p>Quyền của nhà sản xuất: (Bản ghi/video)</p>
                                    </div>
                                    <div className={cx('own-block__right')}>
                                        <p>0%</p>
                                        <p>0%</p>
                                        <p>50%</p>
                                        <p>50%</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={cx('form__edit-bottom')}>
                            <p className={cx('title')}>Thông tin pháp nhân uỷ quyền</p>
                            <div className={cx('form__edit-bottom__block-input')}>
                                <BlockInput data={formikData.values.authorizingLegalEntity === 'Cá nhân'
                                    ? BLOCK_INPUTS_2_PERSONAL : BLOCK_INPUTS_2_ORGANIZATION} />
                                <BlockInput data={formikData.values.authorizingLegalEntity === 'Cá nhân'
                                    ? BLOCK_INPUTS_3_PERSONAL : BLOCK_INPUTS_3_ORGANIZATION} />
                                <BlockInput data={formikData.values.authorizingLegalEntity === 'Cá nhân'
                                    ? BLOCK_INPUTS_4_PERSONAL : BLOCK_INPUTS_4_ORGANIZATION} />
                            </div>
                        </div>
                    </div>
                    : <div className={cx('from__information')}>
                        <div className={cx('form__information__block-top')}>
                            <BlockInfo data={data.slice(0, 2)} className={cx('form__information__block-info')} />
                            <div className={cx('form__information__block')}>
                                <div className={cx('block__title')}>
                                    <FontAwesomeIcon icon={faInfoCircle} />
                                    <p>Mức nhuận bút</p>
                                </div>
                                <div className={cx('block__own-block')}>
                                    <div className={cx('own-block__left')}>
                                        <p>Quyền tác giả:</p>
                                        <p>Quyền liên quan:</p>
                                        <p>Quyền của người biểu diễn:</p>
                                        <p>Quyền của nhà sản xuất: (Bản ghi/video)</p>
                                    </div>
                                    <div className={cx('own-block__right')}>
                                        <p>0%</p>
                                        <p>0%</p>
                                        <p>50%</p>
                                        <p>50%</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={cx('from__information__block-bottom')}>
                            <p className={cx('title')}>Thông tin pháp nhân uỷ quyền</p>
                            <BlockInfo data={data.slice(2, data.length)} className={cx('form__information__block-info')} />
                        </div>
                    </div>
                }
                {edit && <div className={cx('form__action')}>
                    <Button outline type='button' onClick={() => {
                        setEdit(!edit);
                        setActive(false);
                    }}>Hủy</Button>
                    <Button type='submit'>Lưu</Button>
                </div>}
            </form>
        </CommonPage >
    );
});