import classNames from "classnames/bind";
// import { useParams } from "react-router";
// import { useSelector } from "react-redux";
import { ReactNode, memo, useEffect, useState } from "react";
// import { useFormik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
// import { faEdit, faEye, faXmark } from "@fortawesome/free-solid-svg-icons";

import style from './CommonPageContractEdit.module.scss';
import { PagingItemType } from "~/components/Paging";
// import { routes } from "~/config/routes";
import { BlockInfo, BlockInput } from "~/components/Block";
// import { BlockInfo, BlockInput, BlockInfoItemProps } from "~/components/Block";
// import { RootState, useAppDispatch } from "~/store";
// import { getETMContractById } from "~/thunk/etmContractThunk";
// import { getUserById } from "~/api/userAPI";
import { CommonPage } from "../CommonPage";
import { ActionDataType } from "~/components/Action";
import Input from "~/components/Input";
import { Button } from "~/components/Button";
import { RadioButton } from "~/components/RadioButton";
import { Upload } from "~/components/Upload";

const cx = classNames.bind(style);

// type BlockData = {
//     id: number;
//     children: Array<BlockInfoItemProps>;
// }

type CommonPageContractEditProps = {
    title: string;
    edit: boolean;
    // edit: {
    //     isEdit: boolean;
    //     setEdit?(edit: boolean): void;
    // }
    data: Array<any>;
    pagingData: Array<PagingItemType>;
    formikData: any;
    actionData?: Array<ActionDataType>;
    children?: ReactNode;
}

export const CommonPageContractEdit = memo(({ title, edit, data, pagingData, formikData, actionData = [], children }: CommonPageContractEditProps) => {
    // const { id } = useParams();
    // const dispatch = useAppDispatch();

    // const etmContract = useSelector((state: RootState) => state.etmContract);
    // const role = useSelector((state: RootState) => state.role);

    // const [actionData, setActionData] = useState<Array<ActionDataType>>([]);
    // const [data, setData] = useState<Array<BlockData>>([] as Array<BlockData>);
    // const [edit, setEdit] = useState<boolean>(false);
    const [passwordType, setPasswordType] = useState<string>('password');
    const [blockInput1, setBlockInput1] = useState<Array<any>>([]);
    const [blockInput2, setBlockInput2] = useState<Array<any>>([]);
    const [blockInput3, setBlockInput3] = useState<Array<any>>([]);
    const [blockInput4, setBlockInput4] = useState<Array<any>>([]);
    const [blockInput5, setBlockInput5] = useState<Array<any>>([]);

    // const formikData = useFormik({
    //     initialValues: {
    //         id: '',
    //         code: '',
    //         createdBy: '',
    //         createdDate: '',
    //         distributionValue: '',
    //         effectiveDate: '',
    //         expirationDate: '',
    //         name: '',
    //         status: '',
    //         type: '',
    //         value: '',
    //         companyName: '',
    //         position: '',
    //         usersId: '',
    //         avatar: '',
    //         bank: '',
    //         bankNumber: '',
    //         dateOfBirth: '',
    //         dateRange: '',
    //         email: '',
    //         firstName: '',
    //         gender: '',
    //         idNumber: '',
    //         issuedBy: '',
    //         lastName: '',
    //         nationality: '',
    //         password: '',
    //         phoneNumber: '',
    //         residence: '',
    //         rolesId: '',
    //         taxCode: '',
    //         userName: '',
    //         fullName: '',
    //         playValue: ''
    //     },
    //     onSubmit: values => {

    //     }
    // });

    const { type } = formikData.values;

    // const { isEdit, setEdit } = edit;

    // useEffect(() => {
    //     if (id === '') return;

    //     dispatch(getETMContractById(id || ''));
    // }, [id]);

    // useEffect(() => {
    //     if (Object.keys(etmContract.etmContract).length <= 0) return;

    //     const getUser = async () => {
    //         const { usersId } = etmContract.etmContract;
    //         const user = await getUserById(usersId, role.roleList);

    //         formikData.setValues({
    //             ...etmContract.etmContract,
    //             ...user,
    //             fullName: `${user.firstName}${user.lastName}`,
    //             playValue: ''
    //         });
    //     }

    //     getUser();
    // }, [etmContract.etmContract]);

    // useEffect(() => {
    // setData([
    //     {
    //         id: 1,
    //         children: [
    //             {
    //                 title: 'Tên hợp đồng:',
    //                 content: name
    //             }, {
    //                 title: 'Số hợp đồng:',
    //                 content: code
    //             }, {
    //                 title: 'Ngày hiệu lực:',
    //                 content: effectiveDate
    //             }, {
    //                 title: 'Ngày hết hạn:',
    //                 content: expirationDate
    //             }
    //         ]
    //     }, {
    //         id: 2,
    //         children: [
    //             {
    //                 title: 'Đính kèm tệp:',
    //                 content: 'Hợp đồng kinh doanh'
    //             }
    //         ]
    //     }, {
    //         id: 3,
    //         children: [
    //             {
    //                 title: 'Loại hợp đồng:',
    //                 content: type
    //             }, {
    //                 title: 'Giá trị hợp đồng (VNĐ):',
    //                 content: value
    //             }, {
    //                 title: 'Giá trị phân phối (VNĐ/ngày):',
    //                 content: distributionValue
    //             }, {
    //                 title: 'Tình trạng:',
    //                 content: status
    //             }
    //         ]
    //     }, {
    //         id: 4,
    //         children: [
    //             {
    //                 title: 'Tên đơn vị sử dụng:',
    //                 content: companyName
    //             }, {
    //                 title: 'Người đại diện:',
    //                 content: formikData.values.firstName
    //             }, {
    //                 title: 'Chức vụ:',
    //                 content: position
    //             }, {
    //                 title: 'Ngày sinh:',
    //                 content: formikData.values.dateOfBirth
    //             }, {
    //                 title: 'Quốc tịch:',
    //                 content: formikData.values.nationality
    //             }, {
    //                 title: 'Số điện thoại:',
    //                 content: formikData.values.phoneNumber
    //             }, {
    //                 title: 'Email:',
    //                 content: formikData.values.email
    //             }
    //         ]
    //     }, {
    //         id: 5,
    //         children: [
    //             {
    //                 title: 'Giới tính:',
    //                 content: formikData.values.gender
    //             }, {
    //                 title: 'CMND/ CCCD:',
    //                 content: formikData.values.idNumber
    //             }, {
    //                 title: 'Ngày cấp:',
    //                 content: formikData.values.dateRange
    //             }, {
    //                 title: 'Nơi cấp:',
    //                 content: formikData.values.issuedBy
    //             }, {
    //                 title: 'Mã số thuế:',
    //                 content: formikData.values.taxCode
    //             }, {
    //                 title: 'Nơi cư trú:',
    //                 content: formikData.values.residence
    //             }
    //         ]
    //     }, {
    //         id: 6,
    //         children: [
    //             {
    //                 title: 'Tên đăng nhập:',
    //                 content: formikData.values.userName
    //             }, {
    //                 title: 'Mật khẩu:',
    //                 content: formikData.values.password
    //             }, {
    //                 title: 'Số tài khoản:',
    //                 content: formikData.values.bankNumber
    //             }, {
    //                 title: 'Ngân hàng:',
    //                 content: formikData.values.bank
    //             }
    //         ]
    //     }
    // ]);
    // }, [formikData.values]);

    useEffect(() => {
        setBlockInput1([
            {
                fieldName: 'Tên hợp đồng:',
                isRequired: true,
                input: <Input
                    type='text'
                    name='name'
                    value={formikData.values.name}
                    errorMessage={formikData.errors.name}
                    touched={formikData.touched.name}
                    onChange={formikData.handleChange}
                    onFocus={() => formikData.setFieldTouched('name', true)}
                    onBlur={() => formikData.setFieldTouched('name', false)}
                />
            }, {
                fieldName: 'Số hợp đồng:',
                isRequired: true,
                input: <Input
                    type='text'
                    name='code'
                    value={formikData.values.code}
                    errorMessage={formikData.errors.code}
                    touched={formikData.touched.code}
                    onChange={formikData.handleChange}
                    onFocus={() => formikData.setFieldTouched('code', true)}
                    onBlur={() => formikData.setFieldTouched('code', false)}
                />
            }, {
                fieldName: 'Ngày hiệu lực:',
                isRequired: true,
                input: <Input
                    name='effectiveDate'
                    type='datetime-local'
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
                    name='expirationDate'
                    type='datetime-local'
                    value={formikData.values.expirationDate}
                    errorMessage={formikData.errors.expirationDate}
                    touched={formikData.touched.expirationDate}
                    onChange={formikData.handleChange}
                    onFocus={() => formikData.setFieldTouched('expirationDate', true)}
                    onBlur={() => formikData.setFieldTouched('expirationDate', false)}
                />
            }
        ]);

        setBlockInput2([
            {
                fieldName: 'Tên đơn vị sử dụng:',
                isRequired: true,
                input: <Input
                    type='text'
                    name='companyName'
                    value={formikData.values.companyName}
                    errorMessage={formikData.errors.companyName}
                    touched={formikData.touched.companyName}
                    onChange={formikData.handleChange}
                    onFocus={() => formikData.setFieldTouched('companyName', true)}
                    onBlur={() => formikData.setFieldTouched('companyName', false)}
                />
            }, {
                fieldName: 'Người đại diện:',
                isRequired: true,
                input: <Input
                    type='text'
                    name='fullName'
                    value={formikData.values.fullName}
                    errorMessage={formikData.errors.fullName}
                    touched={formikData.touched.fullName}
                    onChange={formikData.handleChange}
                    onFocus={() => formikData.setFieldTouched('fullName', true)}
                    onBlur={() => formikData.setFieldTouched('fullName', false)}
                />
            }, {
                fieldName: 'Chức vụ:',
                isRequired: true,
                input: <Input
                    type='text'
                    name='position'
                    value={formikData.values.position}
                    errorMessage={formikData.errors.position}
                    touched={formikData.touched.position}
                    onChange={formikData.handleChange}
                    onFocus={() => formikData.setFieldTouched('position', true)}
                    onBlur={() => formikData.setFieldTouched('position', false)}
                />
            }, {
                fieldName: 'Ngày sinh:',
                isRequired: true,
                input: <Input
                    name='dateOfBirth'
                    type='datetime-local'
                    value={formikData.values.dateOfBirth}
                    errorMessage={formikData.errors.dateOfBirth}
                    touched={formikData.touched.dateOfBirth}
                    onChange={formikData.handleChange}
                    onFocus={() => formikData.setFieldTouched('dateOfBirth', true)}
                    onBlur={() => formikData.setFieldTouched('dateOfBirth', false)}
                />
            }, {
                fieldName: 'Quốc tịch:',
                isRequired: true,
                input: <Input
                    name='nationality'
                    type='datetime-local'
                    value={formikData.values.nationality}
                    errorMessage={formikData.errors.nationality}
                    touched={formikData.touched.nationality}
                    onChange={formikData.handleChange}
                    onFocus={() => formikData.setFieldTouched('nationality', true)}
                    onBlur={() => formikData.setFieldTouched('nationality', false)}
                />
            }, {
                fieldName: 'Số điện thoại:',
                isRequired: true,
                input: <Input
                    type='text'
                    name='phoneNumber'
                    value={formikData.values.phoneNumber}
                    errorMessage={formikData.errors.phoneNumber}
                    touched={formikData.touched.phoneNumber}
                    onChange={formikData.handleChange}
                    onFocus={() => formikData.setFieldTouched('phoneNumber', true)}
                    onBlur={() => formikData.setFieldTouched('phoneNumber', false)}
                />
            }, {
                fieldName: 'Email:',
                isRequired: true,
                input: <Input
                    type='text'
                    name='email'
                    value={formikData.values.email}
                    errorMessage={formikData.errors.email}
                    touched={formikData.touched.email}
                    onChange={formikData.handleChange}
                    onFocus={() => formikData.setFieldTouched('email', true)}
                    onBlur={() => formikData.setFieldTouched('email', false)}
                />
            }
        ]);

        setBlockInput3([
            {
                fieldName: 'Giới tính:',
                isRequired: true,
                input: <div className={cx('gender-group')}>
                    <RadioButton title='Nam' checked={formikData.values.gender !== 'Nữ' ? true : false} onChange={() => formikData.setFieldValue('gender', 'Nam')} />
                    <RadioButton title='Nữ' checked={formikData.values.gender === 'Nữ' ? true : false} onChange={() => formikData.setFieldValue('gender', 'Nữ')} />
                </div>
            }, {
                fieldName: 'CMND/ CCCD:',
                isRequired: true,
                input: <Input
                    type='text'
                    name='idNumber'
                    value={formikData.values.idNumber}
                    errorMessage={formikData.errors.idNumber}
                    touched={formikData.touched.idNumber}
                    onChange={formikData.handleChange}
                    onFocus={() => formikData.setFieldTouched('idNumber', true)}
                    onBlur={() => formikData.setFieldTouched('idNumber', false)}
                />
            }, {
                fieldName: 'Ngày cấp:',
                isRequired: true,
                input: <Input
                    name='dateRange'
                    type='datetime-local'
                    value={formikData.values.dateRange}
                    errorMessage={formikData.errors.dateRange}
                    touched={formikData.touched.dateRange}
                    onChange={formikData.handleChange}
                    onFocus={() => formikData.setFieldTouched('dateRange', true)}
                    onBlur={() => formikData.setFieldTouched('dateRange', false)}
                />
            }, {
                fieldName: 'Nơi cấp:',
                isRequired: true,
                input: <Input
                    type='text'
                    name={'issuedBy'}
                    value={formikData.values.issuedBy}
                    errorMessage={formikData.errors.issuedBy}
                    touched={formikData.touched.issuedBy}
                    onChange={formikData.handleChange}
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
                    errorMessage={formikData.errors.taxCode}
                    touched={formikData.touched.taxCode}
                    onChange={formikData.handleChange}
                    onFocus={() => formikData.setFieldTouched('taxCode', true)}
                    onBlur={() => formikData.setFieldTouched('taxCode', false)}
                />
            }, {
                fieldName: 'Nơi cư trú:',
                isRequired: true,
                input: <Input
                    name='residence'
                    type='textarea'
                    value={formikData.values.residence}
                    errorMessage={formikData.errors.residence}
                    touched={formikData.touched.residence}
                    onChange={formikData.handleChange}
                    onFocus={() => formikData.setFieldTouched('residence', true)}
                    onBlur={() => formikData.setFieldTouched('residence', false)}
                />
            }
        ]);
    }, [formikData.values]);

    useEffect(() => {
        setBlockInput4([
            {
                fieldName: 'Tên đăng nhập:',
                isRequired: true,
                input: <Input
                    type='text'
                    name={'userName'}
                    value={formikData.values.userName}
                    errorMessage={formikData.errors.userName}
                    touched={formikData.touched.userName}
                    onChange={formikData.handleChange}
                    onFocus={() => formikData.setFieldTouched('userName', true)}
                    onBlur={() => formikData.setFieldTouched('userName', false)}
                />
            }, {
                fieldName: 'Mật khẩu:',
                isRequired: true,
                input: <Input
                    name='password'
                    type={passwordType}
                    rightIcon={<FontAwesomeIcon
                        icon={faEye}
                        onClick={() => setPasswordType(passwordType === 'password' ? 'text' : 'password')}
                    />}
                    value={formikData.values.password}
                    errorMessage={formikData.errors.password}
                    touched={formikData.touched.password}
                    onChange={formikData.handleChange}
                    onFocus={() => formikData.setFieldTouched('password', true)}
                    onBlur={() => formikData.setFieldTouched('password', false)}
                />
            }, {
                fieldName: 'Số tài khoản:',
                isRequired: true,
                input: <Input
                    type='text'
                    name='bankNumber'
                    value={formikData.values.bankNumber}
                    errorMessage={formikData.errors.bankNumber}
                    touched={formikData.touched.bankNumber}
                    onChange={formikData.handleChange}
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
                    errorMessage={formikData.errors.bank}
                    touched={formikData.touched.bank}
                    onChange={formikData.handleChange}
                    onFocus={() => formikData.setFieldTouched('bank', true)}
                    onBlur={() => formikData.setFieldTouched('bank', false)}
                />
            }
        ]);
    }, [formikData.values, passwordType]);

    useEffect(() => {
        setBlockInput5([
            {
                fieldName: 'Giá trị hợp đồng(VNĐ)',
                input: <Input
                    type='text'
                    name='value'
                    readOnly={type === 'Trọn gói' ? false : true}
                    value={formikData.values.value}
                    errorMessage={formikData.errors.value}
                    touched={formikData.touched.value}
                    onChange={formikData.handleChange}
                    onFocus={() => formikData.setFieldTouched('value', true)}
                    onBlur={() => formikData.setFieldTouched('value', false)}
                />
            }, {
                fieldName: 'Giá trị phân phối(VNĐ)/ngày',
                input: <Input
                    type='text'
                    name='distributionValue'
                    readOnly={type === 'Trọn gói' ? false : true}
                    value={formikData.values.distributionValue}
                    errorMessage={formikData.errors.distributionValue}
                    touched={formikData.touched.distributionValue}
                    onChange={formikData.handleChange}
                    onFocus={() => formikData.setFieldTouched('distributionValue', true)}
                    onBlur={() => formikData.setFieldTouched('distributionValue', false)}
                />
            }
        ])
    }, [formikData.values]);

    // useEffect(() => {
    //     setActionData([
    //         {
    //             icon: <FontAwesomeIcon icon={faEdit} style={{ color: 'var(--color-orange-4)' }} />,
    //             title: 'Chỉnh sửa',
    //             onClick: () => setEdit(true)
    //         }, {
    //             icon: <FontAwesomeIcon icon={faXmark} style={{ color: 'var(--color-red)' }} />,
    //             title: 'Huỷ hợp đồng',
    //             onClick: () => setEdit(false)
    //         }
    //     ]);
    // }, []);

    return (
        <CommonPage
            title={title}
            pagingData={pagingData}
            // pagingData={PAGING_ITEMS}
            actionData={!edit ? actionData : []}
        // actionData={edit && (!edit.isEdit ? actionData : [])}
        >
            <form className={cx('content-container')} onSubmit={formikData.handleSubmit}>
                {edit
                    ? <div className={cx('content-edit')}>
                        <div className={cx('content-edit__box')}>
                            <BlockInput data={blockInput1} />
                            <BlockInput data={[{
                                fieldName: 'Đính kèm tệp:',
                                isRequired: true,
                                input: <Upload />
                            }]} />
                            <div className={cx('content__type')}>
                                <p>Loại hợp đồng:</p>
                                <div className={cx('content__type__all')}>
                                    <BlockInput data={[{
                                        input: <RadioButton
                                            title='Trọn gói'
                                            checked={type === 'Trọn gói' ? true : false}
                                            onChange={() => formikData.setFieldValue('type', type === 'Trọn gói' ? 'Lượt phát' : 'Trọn gói')}
                                        />
                                    }]} />
                                    <div className={cx('all__value-input')}>
                                        <BlockInput data={blockInput5} />
                                    </div>
                                </div>
                                <div className={cx('content__type__all')}>
                                    <BlockInput data={[{
                                        input: <RadioButton
                                            title='Lượt phát'
                                            checked={type !== 'Trọn gói' ? true : false}
                                            onChange={() => formikData.setFieldValue('type', type === 'Trọn gói' ? 'Lượt phát' : 'Trọn gói')}
                                        />
                                    }]} />
                                    <div className={cx('all__value-input')}>
                                        <BlockInput data={[{
                                            fieldName: 'Giá trị lượt phát(VNĐ)/ngày',
                                            input: <Input
                                                type='text'
                                                name='playValue'
                                                readOnly={type === 'Trọn gói' ? true : false}
                                                value={formikData.values.playValue}
                                                errorMessage={formikData.errors.playValue}
                                                touched={formikData.touched.playValue}
                                                onChange={formikData.handleChange}
                                                onFocus={() => formikData.setFieldTouched('playValue', true)}
                                                onBlur={() => formikData.setFieldTouched('playValue', false)}
                                            />
                                        }]} />
                                    </div>
                                </div>
                            </div>
                            <BlockInput data={blockInput2} />
                            <BlockInput data={blockInput3} />
                            <BlockInput data={blockInput4} />
                        </div>
                        {children && children}
                        {/* <Button outline type='button' onClick={() => edit.setEdit && edit.setEdit(false)}>Hủy</Button>
                        <Button type='submit'>Lưu</Button> */}
                    </div>
                    : <BlockInfo data={data} />
                }
            </form>
        </CommonPage>
    );
});