import classNames from "classnames/bind";
import { useFormik } from "formik";
import { ReactNode, memo, useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { Feedback } from "~/api/feedbackAPI";
import { Button } from "~/components/Button";
import { ComboBox } from "~/components/ComboBox";
import { Form } from "~/components/Form";
import Image from "~/components/Image";
import { Input } from "~/components/Input";
import Loading from "~/components/Loading";
import { PagingItemType } from "~/components/Paging";
import { Table } from "~/components/Table";
import { Toast } from "~/components/Toast";
import { Yup } from "~/constants";
import emailCampaign from '~/images/email-campaign-pana.svg';
import { CommonPage } from "~/pages/CommonPage";
import { RootState, useAppDispatch } from "~/store";
import { getFeedbacks, sendFeedback } from "~/thunk/feedbackThunk";
import style from './Feedback.module.scss';

const cx = classNames.bind(style);

type FeedbackInputProps = {
    fieldName: string;
    input: ReactNode;
}

type FeedbackItemProps = {
    data: Feedback;
    className?: string;
}

const FeedbackItem = memo(({ data, className }: FeedbackItemProps) => {
    return (
        <div className={cx('feedbacks__item', className)}>
            <div className={cx('feedbacks__item__avatar')}>
                <Image src={data.user.avatar} alt='avatar' width={56} height={56} />
            </div>
            <div className={cx('feedbacks__item__content')}>
                <div className={cx('item__content__header')}>
                    <span>{data.user.firstName} {data.user.lastName}</span>
                    <span>{data.dateTime}</span>
                </div>
                <div className={cx('item__content__content')}>
                    <span>Chủ đề: {data.problem} - {data.content}</span>
                </div>
            </div>
        </div>
    );
})

function SupportFeedbackPage() {
    const dispatch = useAppDispatch();

    const user = useSelector((state: RootState) => state.user);
    const feedback = useSelector((state: RootState) => state.feedback);

    const [paging, setPaging] = useState<Array<PagingItemType>>([] as Array<PagingItemType>);
    const [activeDropDown, setActiveDropDown] = useState<boolean>(false);
    const [activeToast, setActiveToast] = useState<boolean>(false);
    const [feedbacks, setFeedbacks] = useState<Array<Feedback>>([] as Array<Feedback>);
    const [itemsPerPage, setItemsPerPage] = useState<string>('6');
    const [currentItems, setCurrentItems] = useState<Array<Feedback>>([] as Array<Feedback>);
    const [feedbackActive, setFeedbackActive] = useState<Feedback>({} as Feedback);

    const feedbackFormik = useFormik({
        initialValues: {
            userName: '',
            typeProblem: '',
            content: ''
        },
        validationSchema: Yup.object({
            userName: Yup.string().required(),
            typeProblem: Yup.string().required(),
            content: Yup.string().required(),
        }),
        onSubmit: async values => {
            const currentDate = new Date();

            await dispatch(sendFeedback({
                userName: values.userName,
                content: values.content,
                problem: values.typeProblem,
                usersId: user.currentUser.id,
                dateTime: `${currentDate.getHours()}:${currentDate.getMinutes()} ${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`
            }));

            setActiveToast(true);
        }
    })

    useEffect(() => {
        setPaging([
            {
                title: 'Hỗ trợ',
                to: '#',
                active: true
            }, {
                title: 'Feedback',
                to: '#',
                active: true
            }
        ]);

        dispatch(getFeedbacks());
    }, []);

    useEffect(() => {
        document.title = 'Feeback';
    }, []);

    useEffect(() => {
        setFeedbacks(feedback.feedbacks);
    }, [feedback]);

    const handleOnItemClick = useCallback((problem: any) => {
        feedbackFormik.setFieldValue('typeProblem', problem.title);
    }, []);

    const feedbackInputs: Array<FeedbackInputProps> = [
        {
            fieldName: '',
            input: <Input
                fieldName={'Tên người dùng'}
                name={'userName'}
                value={feedbackFormik.values.userName}
                errorMessage={feedbackFormik.errors.userName}
                touched={feedbackFormik.touched.userName}
                onChange={feedbackFormik.handleChange}
                onFocus={() => feedbackFormik.setFieldTouched('userName', true)}
                onBlur={() => feedbackFormik.setFieldTouched('userName', false)}
            />
        }, {
            fieldName: '',
            input: <ComboBox
                title='Bạn muốn được hỗ trợ vấn đề gì?'
                data={[
                    { title: 'Tài khoản' },
                    { title: 'Quản lý doanh thu' },
                    { title: 'Vấn đề bản quyền' },
                    { title: 'Khác' },
                ]}
                active={feedbackFormik.values.typeProblem || 'Chọn vấn đề bạn cần được hỗ trợ'}
                onClick={() => setActiveDropDown(!activeDropDown)}
                visible={activeDropDown}
                onItemClick={handleOnItemClick}
                className={cx('form__body__combobox-problem-type', feedbackFormik.errors.typeProblem && 'invalid')}
            />
        }, {
            fieldName: '',
            input: <Input
                as='textarea'
                rows={11}
                placeholder='Nhập nội dung'
                fieldName={'Nội dung'}
                name={'content'}
                value={feedbackFormik.values.content}
                errorMessage={feedbackFormik.errors.content}
                touched={feedbackFormik.touched.content}
                onChange={feedbackFormik.handleChange}
                onFocus={() => feedbackFormik.setFieldTouched('content', true)}
                onBlur={() => feedbackFormik.setFieldTouched('content', false)}
            />
        }
    ];

    const handleSetCurrentItems = useCallback((items: Array<any>) => {
        setCurrentItems(items);
    }, []);

    return (
        <CommonPage
            title='Feedback'
            pagingData={paging}
            className={cx('support-feedback')}
        >
            {user.currentUser.role && user.currentUser.role.name.toLowerCase() === 'user'
                ? <>
                    <Form visible={true} onSubmit={feedbackFormik.handleSubmit} className={cx('support-feedback__form')}>
                        <div className={cx('form__body')}>
                            {feedbackInputs.map((input, index) => (
                                <div key={index}>
                                    {input.fieldName && <p>{input.fieldName}</p>}
                                    {input.input}
                                </div>
                            ))}
                        </div>
                        <div className={cx('form__footer')}>
                            <Button type='submit'>Gửi</Button>
                        </div>
                    </Form>
                    <Toast message='Gửi feedback thành công' visible={activeToast} setVisible={setActiveToast} duration={800} />
                    <Loading visible={feedback.loading} />
                </>
                : <div className={cx('support-feedback-container')}>
                    <Table
                        paginate={{
                            dataForPaginate: feedbacks,
                            setCurrentItems: handleSetCurrentItems
                        }}
                        itemsPerPage={itemsPerPage}
                        setItemsPerPage={setItemsPerPage}
                        className={cx('container__feedbacks')}
                        thead={[]}
                        loading={feedback.loading}
                    >
                        {currentItems.map(feedback =>
                            <tr key={feedback.id} onClick={() => setFeedbackActive(feedback)}>
                                <td style={{ height: '80px' }}>
                                    <FeedbackItem
                                        data={feedback}
                                        className={cx(feedback.id === feedbackActive.id && 'active')}
                                    />
                                </td>
                            </tr>
                        )}
                    </Table>
                    <div className={cx('container__feedbacks-detail')}>
                        {feedbackActive && feedbackActive.user
                            ? <>
                                <div className={cx('container__feedbacks-detail__header')}>
                                    <div className={cx('feedbacks-detail__header__account')}>
                                        <Image src={feedbackActive.user.avatar} alt={feedbackActive.userName} width={56} height={56} />
                                        <p>{feedbackActive.user.firstName} {feedbackActive.user.lastName}</p>
                                    </div>
                                    <p>{feedbackActive.dateTime}</p>
                                </div>
                                <div className={cx('container__feedbacks-detail__content-feedback')}>
                                    <p>Chủ đề: {feedbackActive.problem}</p>
                                    <p>{feedbackActive.content}</p>
                                </div>
                            </>
                            : <div className={cx('container__feedbacks-detail__image')}><Image src={emailCampaign} alt='support page' width={750} height={500} /></div>
                        }
                    </div>
                </div>
            }
        </CommonPage>
    );
}

export default SupportFeedbackPage;