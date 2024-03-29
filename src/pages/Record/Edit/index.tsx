import classNames from "classnames/bind";
import { useFormik } from "formik";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";

import { Category } from "~/api/categoryAPI";
import { Contract, getContractById } from "~/api/contractAPI";
import { Record } from "~/api/recordAPI";
import { User, getUserById } from "~/api/userAPI";
import { Button } from "~/components/Button";
import { ComboBox } from "~/components/ComboBox";
import Image from "~/components/Image";
import { Input } from "~/components/Input";
import Loading from "~/components/Loading";
import { Paging, PagingItemType } from "~/components/Paging";
import { routes } from "~/config/routes";
import { formatDateMDY } from "~/context";
import { Icon, musicIcon } from "~/icons";
import { RootState, useAppDispatch } from "~/store";
import { saveRecord } from "~/thunk/recordThunks";
import style from './EditRecord.module.scss';

const cx = classNames.bind(style);

type ComboBoxItemType = {
    title: string;
    onItemClick: () => void;
}

const COMBOBOX_DATA: Array<Pick<ComboBoxItemType, 'title'>> = [
    {
        title: 'Ballad',
    }, {
        title: 'Pop',
    }, {
        title: 'Rock',
    }, {
        title: 'EDM',
    }
];

function EditRecord() {
    const { id } = useParams();

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const record = useSelector((state: RootState) => state.record);
    const category = useSelector((state: RootState) => state.category);

    const comboBoxRef = useRef<HTMLUListElement>(null);

    const recordFormik = useFormik({
        initialValues: {
            id: '',
            imageURL: '',
            ISRCCode: '',
            approvalDate: '',
            author: '',
            category: {} as Category,
            contractId: '',
            createdBy: {} as User,
            approvalBy: {} as User,
            audioLink: '',
            createdDate: '',
            expirationDate: '',
            format: '',
            nameRecord: '',
            producer: '',
            singer: '',
            time: '',
            contract: {} as Contract,
            status: ''
        },
        onSubmit: async (values) => {
            await dispatch(saveRecord({
                id: values.id,
                imageURL: values.imageURL,
                ISRCCode: values.ISRCCode,
                approvalDate: values.approvalDate,
                approvalBy: recordFormik.values.approvalBy ? recordFormik.values.approvalBy.id : '',
                author: values.author,
                audioLink: values.audioLink,
                categoriesId: values.category.id,
                contractId: values.contractId,
                createdBy: values.createdBy.id,
                createdDate: values.createdDate,
                expirationDate: values.expirationDate,
                format: values.format,
                nameRecord: values.nameRecord,
                producer: values.producer,
                singer: values.singer,
                time: values.time,
                status: 'Đã phê duyệt'
            }));

            navigate(routes.RecordPage);
        }
    });

    const [comboBoxDataActive, setComboBoxDataActive] = useState<string>('');
    const [visibleComboBox, setVisibleComboBox] = useState<boolean>(false);
    const [recordName, setRecordName] = useState<string>('');
    const [paging, setPaging] = useState<Array<PagingItemType>>([] as Array<PagingItemType>);

    const { ISRCCode, author, approvalBy, createdDate, approvalDate,
        nameRecord, producer, singer, contract } = recordFormik.values;
    const RECORD_INPUTS = [
        {
            fieldName: "Tên bản ghi:",
            name: 'nameRecord',
            value: nameRecord,
            touched: recordFormik.touched.nameRecord,
            onChange: recordFormik.handleChange,
            onFocus: () => recordFormik.setFieldTouched('nameRecord', true),
            onBlur: () => recordFormik.setFieldTouched('nameRecord', false)
        }, {
            fieldName: "Mã ISRC:",
            name: 'ISRCCode',
            value: ISRCCode,
            touched: recordFormik.touched.ISRCCode,
            onChange: recordFormik.handleChange,
            onFocus: () => recordFormik.setFieldTouched('ISRCCode', true),
            onBlur: () => recordFormik.setFieldTouched('ISRCCode', false)
        }, {
            fieldName: "Ca sĩ:",
            name: 'singer',
            value: singer,
            touched: recordFormik.touched.singer,
            onChange: recordFormik.handleChange,
            onFocus: () => recordFormik.setFieldTouched('singer', true),
            onBlur: () => recordFormik.setFieldTouched('singer', false)
        }, {
            fieldName: "Tác giả:",
            name: 'author',
            value: author,
            touched: recordFormik.touched.author,
            onChange: recordFormik.handleChange,
            onFocus: () => recordFormik.setFieldTouched('author', true),
            onBlur: () => recordFormik.setFieldTouched('author', false)
        }, {
            fieldName: "Nhà sản xuất:",
            name: 'producer',
            value: producer,
            touched: recordFormik.touched.producer,
            onChange: recordFormik.handleChange,
            onFocus: () => recordFormik.setFieldTouched('producer', true),
            onBlur: () => recordFormik.setFieldTouched('producer', false)
        }
    ];

    useEffect(() => {
        setPaging([
            {
                title: 'Kho bản ghi',
                to: routes.RecordPage,
                active: true
            }, {
                title: 'Cập nhật thông tin',
                to: "#",
                active: true
            }
        ]);
    }, []);

    useEffect(() => {
        if (!record.recordList.length) return;

        let recordItem: any = record.recordList.find((record: Record) =>
            record.ISRCCode === id
        );
        setRecordName(recordItem.nameRecord);

        const getContract = async () => {
            const contract = await getContractById(recordItem.contractId);
            const createdUser = await getUserById(recordItem.createdBy);
            let approvedUser;

            recordItem.approvalBy
                ? approvedUser = {
                    ...await getUserById(recordItem.approvalBy),
                    id: recordItem.approvalBy
                }
                : approvedUser = null;

            recordFormik.setValues({
                ...recordItem,
                contract: contract,
                createdBy: { ...createdUser, id: recordItem.createdBy },
                approvalBy: approvedUser
            });
        }

        getContract();
    }, [record.recordList]);

    useEffect(() => {
        setComboBoxDataActive(recordFormik.values.category.name);
    }, [recordFormik.values]);

    useEffect(() => {
        if (comboBoxRef.current)
            comboBoxRef.current.style.width = '695px';
    }, [comboBoxRef.current]);

    const handleComboBoxItemClick = (item: ComboBoxItemType) => {
        setComboBoxDataActive(item.title);
        recordFormik.setFieldValue('category', { ...category.categoryList.find(category => category.name === item.title) })
    }

    const isExpirationContract = (start: string, end: string) => {
        if (!start || !end) return;

        let startDate = formatDateMDY(start);
        let endDate = formatDateMDY(end);

        if (new Date(startDate) > new Date(endDate))
            return 'Hết hiệu lực';

        return 'Còn hiệu lực';
    }

    const handleBlur = useCallback((item: any) => {
        console.log(item);
        setVisibleComboBox(false);
    }, []);

    return (
        <div className={cx('edit-record')}>
            <Paging data={paging} />
            <header><h3>Bản ghi - {recordName}</h3></header>
            <form className={cx('edit-record-form')} onSubmit={recordFormik.handleSubmit}>
                <div className={cx('edit-record-container')}>
                    <div className={cx('record-container__left')}>
                        <div className={cx('record__detail')}>
                            <p className={cx('record__detail__title')}>Thông tin bản ghi</p>
                            <Image isBG className={cx('record__detail__image')} src={recordFormik.values.imageURL} alt='logo' type="upload" edit={true} />
                            <div className={cx('record__detail__mp3')}>
                                <Icon icon={musicIcon} />
                                <p>Matem.mp3</p>
                            </div>
                            <div className={cx('record__detail__content')}>
                                <div className={cx('content')}>
                                    <p>Ngày thêm:</p>
                                    <p>{createdDate}</p>
                                </div>
                                <div className={cx('content')}>
                                    <p>Người tải lên:</p>
                                    <p>{recordFormik.values.createdBy.firstName} {recordFormik.values.createdBy.lastName}</p>
                                </div>
                                <div className={cx('content')}>
                                    <p>Người duyệt:</p>
                                    {approvalBy ? <p>{approvalBy.firstName} {approvalBy.lastName}</p> : <p>Hệ thống <br />(Tự động phê duyệt)</p>}
                                </div>
                                <div className={cx('content')}>
                                    <p>Ngày phê duyệt:</p>
                                    <p>{approvalDate}</p>
                                </div>
                            </div>
                        </div>
                        <div className={cx('record__authorization-info')}>
                            <p className={cx('authorization-info__title')}>Thông tin ủy quyền</p>
                            <div className={cx('authorization-info__content')}>
                                <div className={cx('content')}>
                                    <p>Số hợp đồng:</p>
                                    <p>{contract.contractCode}</p>
                                </div>
                                <div className={cx('content')}>
                                    <p>Ngày nhận ủy quyền:</p>
                                    <p>{contract.effectiveDate}</p>
                                </div>
                                <div className={cx('content')}>
                                    <p>Ngày hết hạn:</p>
                                    <p>{contract.expirationDate}</p>
                                </div>
                                <div className={cx('content')}>
                                    <p>Trạng thái:</p>
                                    <p>{isExpirationContract(contract.effectiveDate, contract.expirationDate)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={cx('record-container__right')}>
                        <div className={cx('edit-record-info')}>
                            <p className={cx('edit-record-info__title')}>Chỉnh sửa thông tin</p>
                            <div className={cx('group-input')}>
                                {RECORD_INPUTS.map(input =>
                                    <Input key={input.fieldName} {...input} />
                                )}
                                <ComboBox
                                    width={'100%'}
                                    comboBoxRef={comboBoxRef}
                                    visible={visibleComboBox}
                                    onClick={() => setVisibleComboBox(!visibleComboBox)}
                                    className={cx('record-combobox')}
                                    title='Thể loại:'
                                    data={COMBOBOX_DATA}
                                    active={comboBoxDataActive}
                                    onItemClick={handleComboBoxItemClick}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className={cx('form__action')}>
                    <Button type='button' outline onClick={() => navigate(routes.RecordPage)}>Hủy</Button>
                    <Button as='button' type='submit'>Lưu</Button>
                </div>
            </form>
            <Loading visible={record.loading} />
        </div>
    );
}

export default EditRecord;