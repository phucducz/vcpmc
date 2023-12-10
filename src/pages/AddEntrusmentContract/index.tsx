import classNames from "classnames/bind";
import { useNavigate } from "react-router";
import { useFormik } from "formik";
import { useSelector } from "react-redux";

import style from './AddETMContract.module.scss';
import { CommonPageContractEdit } from "../CommonPageContractEdit";
import { PagingItemType } from "~/components/Paging";
import { routes } from "~/config/routes";
import { Button } from "~/components/Button";
import { User } from "~/api/userAPI";
import { EtmContract } from "~/api/etmContractAPI";
import { RootState, useAppDispatch } from "~/store";
import { saveEntrustmentContract } from "~/thunk/etmContractThunk";
import { Yup } from "~/constants";
import Loading from "~/components/Loading";
import { formatToLocalStringCurrentDate } from "~/context";

const cx = classNames.bind(style);

const PAGING_ITEMS: Array<PagingItemType> = [
    {
        title: 'Quản lý',
        to: '#'
    }, {
        title: 'Quản lý hợp đồng',
        to: routes.Entrustment
    }, {
        title: 'Chi tiết',
        to: "#"
    }
];

export const AddETMContractPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const etmContract = useSelector((state: RootState) => state.etmContract);
    const user = useSelector((state: RootState) => state.user);

    const contractFormik = useFormik({
        initialValues: {
            id: '',
            code: '',
            createdBy: '',
            createdDate: '',
            distributionValue: '',
            effectiveDate: '',
            expirationDate: '',
            name: '',
            status: 'Mới',
            type: 'Trọn gói',
            value: '',
            companyName: '',
            position: '',
            usersId: user.currentUser.id,
            avatar: '',
            bank: '',
            bankNumber: '',
            dateOfBirth: '',
            dateRange: '',
            email: '',
            // fullname: '',
            gender: 'Nam',
            idNumber: '',
            issuedBy: '',
            nationality: '',
            password: '',
            phoneNumber: '',
            residence: '',
            rolesId: '',
            taxCode: '',
            userName: '',
            fullName: '',
            playValue: '',
        },
        validationSchema: Yup.object({
            code: Yup.string().required(),
            effectiveDate: Yup.string().required(),
            expirationDate: Yup.string().required(),
            name: Yup.string().required(),
            type: Yup.string().required(),
            companyName: Yup.string().required(),
            position: Yup.string().required(),
            bank: Yup.string().required(),
            bankNumber: Yup.string().required(),
            dateOfBirth: Yup.string().required(),
            dateRange: Yup.string().required(),
            email: Yup.string()
                .required("Không được để trống")
                .matches(/^\S+@\S+\.\S+$/, "Vui lòng nhập địa chỉ đúng định dạng"),
            gender: Yup.string().required(),
            idNumber: Yup.number().required(),
            issuedBy: Yup.string().required(),
            nationality: Yup.string().required(),
            password: Yup.string().required(),
            phoneNumber: Yup.string().required().matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g),
            residence: Yup.string().required(),
            taxCode: Yup.number().required(),
            usersId: Yup.string().required(),
            userName: Yup.string()
                .required("Không được để trống")
                .matches(/^\S+@\S+\.\S+$/, "Vui lòng nhập địa chỉ đúng định dạng"),
            distributionValue: Yup.number().required(),
            value: Yup.number().required(),
            playValue: Yup.number().required(),
        }),
        onSubmit: values => {
            const { code, distributionValue, effectiveDate, expirationDate, name,
                playValue, fullName, type, value, companyName, position } = values;

            const { avatar, bank, bankNumber, dateOfBirth, dateRange, email, gender, idNumber, usersId,
                issuedBy, nationality, password, phoneNumber, residence, taxCode, userName } = values;

            const formatToDMY = (date: string) => {
                const dateArray = date.split('-');

                return `${dateArray[2]}/${dateArray[1]}/${dateArray[0]}`;
            }

            const fullNameList = fullName.split(' ');

            const user: Omit<User, 'role'> = {
                avatar: avatar,
                bank: bank,
                bankNumber: bankNumber,
                companyName: companyName,
                dateOfBirth: formatToDMY(dateOfBirth),
                dateRange: formatToDMY(dateRange),
                email: email,
                firstName: fullNameList[fullNameList.length - 1],
                gender: gender,
                idNumber: idNumber,
                issuedBy: issuedBy,
                lastName: fullNameList[0],
                nationality: nationality,
                password: password,
                phoneNumber: phoneNumber,
                residence: residence,
                rolesId: 'JhKyWdxCPbLtOSAboKZD',
                taxCode: taxCode,
                userName: userName,
                id: ''
            }

            const contract: EtmContract = {
                id: '',
                code: code,
                createdBy: usersId,
                createdDate: formatToLocalStringCurrentDate(),
                companyName: companyName,
                distributionValue: distributionValue,
                effectiveDate: formatToDMY(effectiveDate),
                expirationDate: formatToDMY(expirationDate),
                name: name,
                status: 'Mới',
                type: type,
                value: value,
                position: position,
                usersId: '',
                playValue: playValue,
            }

            dispatch(saveEntrustmentContract({
                contract,
                user,
                navigate: () => navigate(routes.Entrustment)
            }));
        }
    });

    const { code, distributionValue, effectiveDate, expirationDate,
        name, status, type, value, companyName, position } = contractFormik.values;

    return (
        <div className={cx('entrustment-contract-container')}>
            <CommonPageContractEdit
                pagingData={PAGING_ITEMS}
                title='Thêm hợp đồng khai thác mới'
                edit={true}
                formikData={contractFormik}
                data={
                    [
                        {
                            id: 1,
                            children: [
                                {
                                    title: 'Tên hợp đồng:',
                                    content: name
                                }, {
                                    title: 'Số hợp đồng:',
                                    content: code
                                }, {
                                    title: 'Ngày hiệu lực:',
                                    content: effectiveDate
                                }, {
                                    title: 'Ngày hết hạn:',
                                    content: expirationDate
                                }
                            ]
                        }, {
                            id: 2,
                            children: [
                                {
                                    title: 'Đính kèm tệp:',
                                    content: 'Hợp đồng kinh doanh'
                                }
                            ]
                        }, {
                            id: 3,
                            children: [
                                {
                                    title: 'Loại hợp đồng:',
                                    content: type
                                }, {
                                    title: 'Giá trị hợp đồng (VNĐ):',
                                    content: value
                                }, {
                                    title: 'Giá trị phân phối (VNĐ/ngày):',
                                    content: distributionValue
                                }, {
                                    title: 'Tình trạng:',
                                    content: status
                                }
                            ]
                        }, {
                            id: 4,
                            children: [
                                {
                                    title: 'Tên đơn vị sử dụng:',
                                    content: companyName
                                }, {
                                    title: 'Người đại diện:',
                                    content: contractFormik.values.fullName
                                }, {
                                    title: 'Chức vụ:',
                                    content: position
                                }, {
                                    title: 'Ngày sinh:',
                                    content: contractFormik.values.dateOfBirth
                                }, {
                                    title: 'Quốc tịch:',
                                    content: contractFormik.values.nationality
                                }, {
                                    title: 'Số điện thoại:',
                                    content: contractFormik.values.phoneNumber
                                }, {
                                    title: 'Email:',
                                    content: contractFormik.values.email
                                }
                            ]
                        }, {
                            id: 5,
                            children: [
                                {
                                    title: 'Giới tính:',
                                    content: contractFormik.values.gender
                                }, {
                                    title: 'CMND/ CCCD:',
                                    content: contractFormik.values.idNumber
                                }, {
                                    title: 'Ngày cấp:',
                                    content: contractFormik.values.dateRange
                                }, {
                                    title: 'Nơi cấp:',
                                    content: contractFormik.values.issuedBy
                                }, {
                                    title: 'Mã số thuế:',
                                    content: contractFormik.values.taxCode
                                }, {
                                    title: 'Nơi cư trú:',
                                    content: contractFormik.values.residence
                                }
                            ]
                        }, {
                            id: 6,
                            children: [
                                {
                                    title: 'Tên đăng nhập:',
                                    content: contractFormik.values.userName
                                }, {
                                    title: 'Mật khẩu:',
                                    content: contractFormik.values.password
                                }, {
                                    title: 'Số tài khoản:',
                                    content: contractFormik.values.bankNumber
                                }, {
                                    title: 'Ngân hàng:',
                                    content: contractFormik.values.bank
                                }
                            ]
                        }
                    ]}
            >
                <Button outline type='button' onClick={() => navigate(routes.Entrustment)}>Hủy</Button>
                <Button type='submit'>Lưu</Button>
            </CommonPageContractEdit>
            <Loading visible={etmContract.loading} />
        </div>
    );
};