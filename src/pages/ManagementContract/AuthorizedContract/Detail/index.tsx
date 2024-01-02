import { faEdit, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames/bind";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";

import { Role } from "~/api/roleAPI";
import { PagingItemType } from "~/components/Paging";
import { routes } from "~/config/routes";
import { formatDateDMYHPTS, formatDateYMD } from "~/context";
import { Icon, clipboardNoteIcon } from "~/icons";
import { RootState, useAppDispatch } from "~/store";
import { CommonPageAuthorizedContractEdit } from "../Component/CommonEditAuthorizedPage";
import style from './Detail.module.scss';
import { cancelAuthoziedContract, renewAuthorizedContract, updateAuthorizedContract } from "~/thunk/authorizedContractThunk";
import { Form } from "~/components/Form";
import { Button } from "~/components/Button";
import { Input } from "~/components/Input";
import { Yup } from "~/constants";
import { CheckBox } from "~/components/CheckBox";
import { OwnerShip } from "~/api/authorizedContract";
import { Upload } from "~/components/Upload";

const cx = classNames.bind(style);

type DataType = {
    children: Array<{ title: string; content: string }>;
}

export type Owner = Array<string> | string;

const initialValues = {
    id: '',
    authorized: '',
    authorizedPerson: {
        avatar: '',
        bank: '',
        bankNumber: '',
        dateOfBirth: '',
        dateRange: '',
        email: '',
        firstName: '',
        gender: '',
        idNumber: '',
        issuedBy: '',
        lastName: '',
        nationality: '',
        password: '',
        phoneNumber: '',
        residence: '',
        rolesId: '',
        taxCode: '',
        userName: '',
        role: {} as Pick<Role, 'id' | 'name'>,
        id: '',
        companyName: '',
        status: '',
        expirationDate: '',
    },
    authorizingLegalEntity: '',
    censored: false,
    contractCode: '',
    contractTypesId: '',
    createdBy: {
        avatar: '',
        bank: '',
        bankNumber: '',
        dateOfBirth: '',
        dateRange: '',
        email: '',
        firstName: '',
        gender: '',
        idNumber: '',
        issuedBy: '',
        lastName: '',
        nationality: '',
        password: '',
        phoneNumber: '',
        residence: '',
        rolesId: '',
        taxCode: '',
        userName: '',
        role: {} as Pick<Role, 'id' | 'name'>,
        id: '',
        companyName: '',
        status: '',
        expirationDate: '',
    },
    customer: '',
    dateCreated: '',
    effectiveDate: '',
    expirationDate: '',
    ownerShips: [] as Array<OwnerShip>,
    reason: '',
    status: '',
    royalties: '',
    CPM: '',
    administrativeFee: '',
    forControlDate: '',
}

type TypeSubmit = 'update' | 'cancel' | 'renew';

function AuthorizedContractDetailPage() {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const authorizedContract = useSelector((state: RootState) => state.authorized);
    const role = useSelector((state: RootState) => state.role);

    const [paging, setPaging] = useState<Array<PagingItemType>>([] as Array<PagingItemType>);
    const [data, setData] = useState<DataType[]>([] as DataType[]);
    const [actionData, setActionData] = useState<any[]>([] as any[]);
    const [edit, setEdit] = useState<boolean>(false);
    const [cancelContractActive, setCancelContractActive] = useState<boolean>(false);
    const [renewContractActive, setRenewContractActive] = useState<boolean>(false);
    const [typeSubmit, setTypeSubmit] = useState<TypeSubmit>('update');

    const contractFormik = useFormik({
        initialValues: {
            ...initialValues,
            bank: '',
            bankNumber: '',
            dateOfBirth: '',
            dateRange: '',
            email: '',
            gender: '',
            idNumber: '',
            issuedBy: '',
            nationality: '',
            password: '',
            phoneNumber: '',
            residence: '',
            taxCode: '',
            userName: '',
            companyName: '',
            status: '',
            expirationDate: '',
            fullName: '',
            role: '',
            renewStartDate: '',
            renewEndDate: '',
            right: {
                type: '',
                performerValue: '',
                producerValue: '',
                authorValue: ''
            },
        },
        validationSchema: Yup.object({
            bank: Yup.string().required(),
            bankNumber: Yup.string().required(),
            dateOfBirth: Yup.string().required(),
            dateRange: Yup.string().required(),
            email: Yup.string().required(),
            idNumber: Yup.string().required(),
            issuedBy: Yup.string().required(),
            nationality: Yup.string().required(),
            password: Yup.string().required(),
            phoneNumber: Yup.string().required(),
            residence: Yup.string().required(),
            taxCode: Yup.string().required(),
            userName: Yup.string().required(),
            expirationDate: Yup.string().required(),
            fullName: Yup.string().required(),
            effectiveDate: Yup.string().required(),
            contractCode: Yup.string().required(),
            customer: Yup.string().required(),
        }),
        onSubmit: async (values) => {
            switch (typeSubmit) {
                case 'update':
                    const contract = {
                        id: values.id,
                        authorized: values.authorized,
                        authorizedPerson: values.authorizedPerson.id,
                        authorizingLegalEntity: values.authorizingLegalEntity,
                        censored: values.censored,
                        contractCode: values.contractCode,
                        contractTypesId: values.contractTypesId,
                        createdBy: values.createdBy.id,
                        customer: values.customer,
                        dateCreated: values.dateCreated,
                        effectiveDate: formatDateDMYHPTS(values.effectiveDate),
                        expirationDate: formatDateDMYHPTS(values.expirationDate),
                        ownerShips: values.ownerShips,
                        reason: values.reason,
                        status: values.status,
                        royalties: values.royalties,
                        CPM: values.CPM,
                        administrativeFee: values.administrativeFee,
                        forControlDate: values.forControlDate
                    }
                    const userRole = role.roleList.find(role => role.name.toLowerCase().trim() === values.role.toLowerCase().trim()) || role.roleList.find(role => role.id === values.authorizedPerson.rolesId);

                    const user = {
                        ...values.authorizedPerson,
                        bank: values.bank,
                        bankNumber: values.bankNumber,
                        dateOfBirth: formatDateDMYHPTS(values.dateOfBirth),
                        dateRange: formatDateDMYHPTS(values.dateRange),
                        email: values.email,
                        gender: values.gender,
                        idNumber: values.idNumber,
                        issuedBy: values.issuedBy,
                        nationality: values.nationality,
                        password: values.password,
                        phoneNumber: values.phoneNumber,
                        residence: values.residence,
                        taxCode: values.taxCode,
                        userName: values.userName,
                        companyName: values.companyName,
                        status: values.status,
                        expirationDate: values.expirationDate,
                        fullName: values.fullName,
                        role: userRole ? { id: userRole.id, name: userRole.name } : { id: '', name: '' }
                    }
                    await dispatch(updateAuthorizedContract({ contract: contract, user: user, }));
                    setEdit(false);

                    break;

                case 'renew':
                    const { right } = values;

                    if (right.type === 'author' && values.right.authorValue === '') return;
                    else if (right.type === 'more' && (values.right.performerValue === '' ||
                        values.right.producerValue === '')) return;

                    const renew = {
                        renewEndDate: formatDateDMYHPTS(values.renewEndDate),
                        right: values.right.type === 'author' ? [{
                            name: 'Tác giả',
                            value: parseInt(values.right.authorValue) || 0
                        }] : [{
                            name: 'Người biểu diễn',
                            value: parseInt(values.right.performerValue) || 0
                        }, {
                            name: 'Nhà sản xuất',
                            value: parseInt(values.right.producerValue) || 0
                        }]
                    }

                    dispatch(renewAuthorizedContract({
                        id: values.id,
                        expirationDate: renew.renewEndDate,
                        ownerShips: renew.right
                    }));
                    setRenewContractActive(false);

                    break;

                case 'cancel':
                    if (values.reason === '') return;

                    dispatch(cancelAuthoziedContract({
                        id: values.id,
                        reason: values.reason,
                        navigate: () => navigate(routes.ManagementList)
                    }));

                    break;

                default:
                    return;
            }
        }
    });

    const renewContractFormik = useFormik({
        initialValues: {
            type: '',
            performerValue: '',
            producerValue: '',
            authorValue: '',
            renewStartDate: '',
            renewEndDate: ''
        },
        validationSchema: Yup.object({
            type: Yup.string().required(),
            performerValue: Yup.string().required(),
            producerValue: Yup.string().required(),
            authorValue: Yup.string().required(),
            renewStartDate: Yup.string().required(),
            renewEndDate: Yup.string().required(),
        }),
        onSubmit: values => {
            const renew = {
                renewEndDate: formatDateDMYHPTS(values.renewEndDate),
                right: values.type === 'author' ? [{
                    name: 'Tác giả',
                    value: parseInt(values.authorValue) || 0
                }] : [{
                    name: 'Người biểu diễn',
                    value: parseInt(values.performerValue) || 0
                }, {
                    name: 'Nhà sản xuất',
                    value: parseInt(values.producerValue) || 0
                }]
            }

            dispatch(renewAuthorizedContract({
                id: contractFormik.values.id,
                expirationDate: renew.renewEndDate,
                ownerShips: renew.right
            }));
            setRenewContractActive(false);
        }
    });

    useEffect(() => {
        setPaging([
            {
                title: 'Quản lý',
                to: routes.ManagementList,
                active: true
            }, {
                title: 'Quản lý hợp đồng',
                to: routes.ManagementList,
                active: true
            }, {
                title: 'Chi tiết',
                to: "#",
                active: false
            }
        ]);

        let currentContract = authorizedContract.contracts
            .find(contract => contract.id === id) || initialValues;

        const renewStartDate = new Date(formatDateYMD(currentContract.expirationDate));
        const renewEndDate = new Date();
        let right = typeof currentContract.ownerShips
            .find(ownerShip => ownerShip.name === 'Tác giả') !== 'undefined' ? 'author' : 'more';

        authorizedContract.contracts.length > 0 && contractFormik.setValues({
            ...currentContract,
            authorizedPerson: {
                ...currentContract.authorizedPerson,
                companyName: currentContract.authorizedPerson.companyName || '',
                expirationDate: currentContract.authorizedPerson.expirationDate || ''
            },
            createdBy: {
                ...currentContract.createdBy,
                companyName: currentContract.authorizedPerson.companyName || '',
                expirationDate: currentContract.authorizedPerson.expirationDate || '',
                status: currentContract.authorizedPerson.status || ''
            },
            ownerShips: currentContract.ownerShips,
            bank: currentContract.authorizedPerson.bank,
            bankNumber: currentContract.authorizedPerson.bankNumber,
            dateOfBirth: formatDateYMD(currentContract.authorizedPerson.dateOfBirth),
            dateRange: formatDateYMD(currentContract.authorizedPerson.dateRange),
            email: currentContract.authorizedPerson.email,
            gender: currentContract.authorizedPerson.gender,
            idNumber: currentContract.authorizedPerson.idNumber,
            issuedBy: currentContract.authorizedPerson.issuedBy,
            nationality: currentContract.authorizedPerson.nationality,
            password: currentContract.authorizedPerson.password,
            phoneNumber: currentContract.authorizedPerson.phoneNumber,
            residence: currentContract.authorizedPerson.residence,
            taxCode: currentContract.authorizedPerson.taxCode,
            userName: currentContract.authorizedPerson.userName,
            companyName: currentContract.authorizedPerson.companyName || '',
            expirationDate: formatDateYMD(currentContract.expirationDate),
            fullName: `${currentContract.authorizedPerson.firstName} ${currentContract.authorizedPerson.lastName}`,
            role: '',
            effectiveDate: formatDateYMD(currentContract.effectiveDate),
            renewStartDate: `${renewStartDate.getDate() + 1}/${renewStartDate.getMonth() + 1}/${renewStartDate.getFullYear()}`,
            renewEndDate: `${renewEndDate.getFullYear() + 2}-${renewEndDate.getMonth() + 1}-${renewEndDate.getDate()}`,
            right: { ...contractFormik.values.right, type: right }
        });

        renewContractFormik.setValues({
            renewStartDate: `${renewStartDate.getDate() + 1}/${renewStartDate.getMonth() + 1}/${renewStartDate.getFullYear()}`,
            renewEndDate: `${renewEndDate.getFullYear() + 2}-${renewEndDate.getMonth() + 1}-${renewEndDate.getDate()}`,
            type: right,
            performerValue: currentContract.ownerShips.find(ownerShip => ownerShip.name === 'Người biểu diễn')?.value.toString() || '0',
            producerValue: currentContract.ownerShips.find(ownerShip => ownerShip.name === 'Nhà sản xuất')?.value.toString() || '0',
            authorValue: currentContract.ownerShips.find(ownerShip => ownerShip.name === 'Tác giả')?.value.toString() || '0',
        });

        setActionData([
            {
                icon: <FontAwesomeIcon icon={faEdit} />,
                title: 'Chỉnh sửa hợp đồng',
                onClick: () => {
                    setEdit(!edit);
                    setTypeSubmit('update');
                },
                disable: currentContract.status === 'Đã hủy' || +new Date(formatDateYMD(currentContract.expirationDate)) < +new Date()
            }, {
                icon: <Icon icon={clipboardNoteIcon} />,
                title: 'Gia hạn hợp đồng',
                onClick: () => {
                    setRenewContractActive(true);
                    setTypeSubmit('renew');
                },
                disable: currentContract.status === 'Đã hủy' || +new Date(formatDateYMD(currentContract.expirationDate)) < +new Date()
            }, {
                icon: <FontAwesomeIcon icon={faXmark} className={cx('cancel-contract-icon')} />,
                title: 'Hủy hợp đồng',
                onClick: () => {
                    setCancelContractActive(true);
                    setTypeSubmit('cancel');
                },
                disable: currentContract.status === 'Đã hủy'
            }
        ]);

        setEdit(false);
    }, [authorizedContract]);

    useEffect(() => {
        setData([
            {
                children: [
                    {
                        title: 'Số hợp đồng:',
                        content: contractFormik.values.contractCode
                    }, {
                        title: 'Tên hợp đồng:',
                        content: contractFormik.values.customer
                    }, {
                        title: 'Ngày hiệu lực:',
                        content: contractFormik.values.effectiveDate
                    }, {
                        title: 'Ngày hết hạn:',
                        content: contractFormik.values.expirationDate
                    }, {
                        title: 'Tình trạng:',
                        content: contractFormik.values.status
                    }
                ]
            }, {
                children: [{
                    title: 'Đính kèm tệp:',
                    content: ''
                }]
            }, {
                children: [
                    {
                        title: 'Pháp nhân uỷ quyền:',
                        content: contractFormik.values.authorizingLegalEntity
                    }, {
                        title: 'Tên người uỷ quyền:',
                        content: `${contractFormik.values.authorizedPerson.firstName} ${contractFormik.values.authorizedPerson.lastName}`
                    }, {
                        title: 'Ngày sinh:',
                        content: contractFormik.values.authorizedPerson.dateOfBirth
                    }, {
                        title: 'Giới tính:',
                        content: contractFormik.values.authorizedPerson.gender
                    }, {
                        title: 'Quốc tịch:',
                        content: contractFormik.values.authorizedPerson.nationality
                    }, {
                        title: 'Số điện thoại:',
                        content: contractFormik.values.authorizedPerson.phoneNumber
                    }
                ]
            }, {
                children: [
                    {
                        title: 'Số CMND/ CCCD:',
                        content: contractFormik.values.authorizedPerson.idNumber
                    }, {
                        title: 'Ngày cấp:',
                        content: contractFormik.values.authorizedPerson.dateRange
                    }, {
                        title: 'Nơi cấp:',
                        content: contractFormik.values.authorizedPerson.issuedBy
                    }, {
                        title: 'Mã số thuế:',
                        content: contractFormik.values.authorizedPerson.taxCode
                    }, {
                        title: 'Nơi cư trú:',
                        content: contractFormik.values.authorizedPerson.residence
                    }
                ]
            }, {
                children: [
                    {
                        title: 'Email:',
                        content: contractFormik.values.authorizedPerson.email
                    }, {
                        title: 'Tài khoản đăng nhập:',
                        content: contractFormik.values.authorizedPerson.userName
                    }, {
                        title: 'Mật khẩu:',
                        content: contractFormik.values.authorizedPerson.password
                    }, {
                        title: 'Số tài khoản:',
                        content: contractFormik.values.authorizedPerson.bankNumber
                    }, {
                        title: 'Ngân hàng:',
                        content: contractFormik.values.authorizedPerson.bank
                    }
                ]
            }
        ]);
    }, [contractFormik.values]);

    return (
        <CommonPageAuthorizedContractEdit
            title={`Chi tiết hợp đồng uỷ quyền bài hát - ${contractFormik.values.contractCode}`}
            edit={edit}
            setEdit={setEdit}
            data={data}
            pagingData={paging}
            formikData={contractFormik}
            actionData={actionData}
            loading={authorizedContract.loading}
            className={cx('authorized-contract-detail')}
        >
            <Form
                title="Từ chối bản ghi"
                visible={cancelContractActive}
                type="dialog"
                onSubmit={contractFormik.handleSubmit}
                className={cx('cancel-contract-form')}
            >
                <Input
                    as='textarea'
                    rows={7}
                    cols={75}
                    name='reason'
                    placeholder='Cho chúng tôi biết lý do bạn muốn từ chối bản ghi này...'
                    value={contractFormik.values.reason}
                    onChange={contractFormik.handleChange}
                    style={{ resize: 'none' }}
                />
                <div className={cx('form__action')}>
                    <Button small outline type="button" onClick={() => setCancelContractActive(false)}>
                        Hủy
                    </Button>
                    <Button small type="submit">Lưu</Button>
                </div>
            </Form>
            <Form
                title='Gia hạn uỷ quyền tác phẩm'
                visible={renewContractActive}
                type="dialog"
                onSubmit={renewContractFormik.handleSubmit}
                className={cx('renew-contract-form')}
            >
                <div className={cx('form__body')}>
                    <div>
                        <div className={cx('form__body__time-renew')}>
                            <p className={cx('form__body__title-block')}>Thời gian gia hạn<span>*</span></p>
                            <p>Từ ngày: {renewContractFormik.values.renewStartDate}</p>
                            <Input
                                fieldName='Đến ngày:'
                                type='date'
                                name='renewEndDate'
                                value={renewContractFormik.values.renewEndDate}
                                errorMessage={renewContractFormik.errors.renewEndDate}
                                touched={renewContractFormik.touched.renewEndDate}
                                onChange={renewContractFormik.handleChange}
                                onFocus={() => renewContractFormik.setFieldTouched('renewEndDate', true)}
                                onBlur={() => renewContractFormik.setFieldTouched('renewEndDate', false)}
                            />
                            <p>Lưu ý: Thời gian bắt đầu gia hạn hợp đồng mới được tính sau ngày hết hạn hợp đồng cũ một ngày.</p>
                        </div>
                        <div className={cx('form__body__royalty-rate')}>
                            <p className={cx('form__body__title-block')}>Mức nhuận bút<span>*</span></p>
                            <div className={cx('royalty-rate__author')}>
                                <CheckBox
                                    title="Quyền tác giả"
                                    checked={renewContractFormik.values.type === 'author'}
                                    onChange={() => {
                                        renewContractFormik.setValues({
                                            ...renewContractFormik.values,
                                            performerValue: '0',
                                            producerValue: '0',
                                            authorValue: '',
                                            type: 'author',
                                        });
                                    }}
                                />
                                <div className={cx('author__value')}>
                                    <Input
                                        type='text'
                                        name='right'
                                        value={renewContractFormik.values.authorValue}
                                        readOnly={renewContractFormik.values.type !== 'author'}
                                        errorMessage={renewContractFormik.errors.authorValue}
                                        touched={renewContractFormik.touched.authorValue}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            renewContractFormik.setFieldValue('authorValue', e.target.value)}
                                        onFocus={() => renewContractFormik.setFieldTouched('right', true)}
                                        onBlur={() => renewContractFormik.setFieldTouched('right', false)}
                                    />
                                    <p>%</p>
                                </div>
                            </div>
                            <div className={cx('royalty-rate__more')}>
                                <CheckBox
                                    title="Quyền liên quan:"
                                    checked={renewContractFormik.values.type === 'more'}
                                    onChange={() => {
                                        renewContractFormik.setValues({
                                            ...renewContractFormik.values,
                                            performerValue: '',
                                            producerValue: '',
                                            authorValue: '0',
                                            type: 'more',
                                        });
                                    }}
                                />
                                <div className={cx('more__value')}>
                                    <div className={cx('more__value__performer')}>
                                        <CheckBox
                                            title="Quyền của người biểu diễn"
                                            checked={renewContractFormik.values.performerValue !== '0'}
                                            onChange={() => renewContractFormik.setFieldValue('performerValue', renewContractFormik.values.performerValue === '0' ? '' : '0')}
                                        />
                                        <Input
                                            type='text'
                                            name='right'
                                            value={renewContractFormik.values.performerValue}
                                            readOnly={renewContractFormik.values.type !== 'more'}
                                            errorMessage={renewContractFormik.errors.performerValue}
                                            touched={renewContractFormik.touched.performerValue}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                renewContractFormik.setFieldValue('performerValue', e.target.value)}
                                            onFocus={() => renewContractFormik.setFieldTouched('right', true)}
                                            onBlur={() => renewContractFormik.setFieldTouched('right', false)}
                                        />
                                        <p>%</p>
                                    </div>
                                    <div className={cx('more__value__producer')}>
                                        <CheckBox
                                            title="Quyền của nhà sản xuất(bản ghi/video)"
                                            checked={renewContractFormik.values.producerValue !== '0'}
                                            onChange={() => renewContractFormik.setFieldValue('producerValue', renewContractFormik.values.producerValue === '0' ? '' : '0')}
                                        />
                                        <Input
                                            type='text'
                                            name='right'
                                            value={renewContractFormik.values.producerValue}
                                            readOnly={renewContractFormik.values.type !== 'more'}
                                            errorMessage={renewContractFormik.errors.producerValue}
                                            touched={renewContractFormik.touched.producerValue}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                renewContractFormik.setFieldValue('producerValue', e.target.value)}
                                            onFocus={() => renewContractFormik.setFieldTouched('right', true)}
                                            onBlur={() => renewContractFormik.setFieldTouched('right', false)}
                                        />
                                        <p>%</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className={cx('form__body__upload-file')}>
                            <p className={cx('form__body__title-block')}>Đính kèm tệp:<span>*</span></p>
                            <Upload />
                        </div>
                    </div>
                </div>
                <div className={cx('form__action')}>
                    <Button small outline type="button" onClick={() => setRenewContractActive(false)}>
                        Hủy
                    </Button>
                    <Button small type="submit">Lưu</Button>
                </div>
            </Form>
        </CommonPageAuthorizedContractEdit>
    );
}

export default AuthorizedContractDetailPage;