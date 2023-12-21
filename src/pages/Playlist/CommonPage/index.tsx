import { faEarthAmericas, faRepeat, faShuffle, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames/bind";
import { ReactNode, memo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

import { Record } from "~/api/recordAPI";
import { User } from "~/api/userAPI";
import { ActionDataType } from "~/components/Action";
import { AudioDialog } from "~/components/AudioDialog";
import Image from "~/components/Image";
import { Input } from "~/components/Input";
import { PagingItemType } from "~/components/Paging";
import { Switch } from "~/components/Switch";
import { Upload } from "~/components/Upload";
import { useMenu } from "~/context/hooks";
import { CommonPage } from "~/pages/CommonPage";
import { RootState } from "~/store";
import style from './CommonPage.module.scss';

const cx = classNames.bind(style);

export type PlaylistValue = {
    title: string;
    categories: Array<string>;
    createdDate: string;
    createdBy: User;
    description: string;
    mode: string;
    imageURL: string;
    records: Array<Record>;
} & { quantity: number, totalTime: string, playlistId: string, playlistRecordId: string }

type PlaylistProps = {
    type: {
        type: 'modify',
        formik: any
    } | 'read' | {
        type: 'add',
        formik: any
    };
    paging?: Array<PagingItemType>;
    actionData?: Array<any>;
    playlistDetail: PlaylistValue;
    audio?: {
        audioLink: string;
        active: boolean;
        setActive: React.Dispatch<React.SetStateAction<boolean>>
    }
    children: ReactNode;
    titlePage?: string
}

const CategoryBoxItem = memo(({ title, onClick }: { title?: string, onClick: () => void }) => {
    return (
        <div className={cx('category-box-item')}>
            {title && <>
                <p>{title}</p>
                <FontAwesomeIcon icon={faXmark} onClick={onClick} />
            </>}
        </div>
    )
});

export const CommonPlaylistPage = memo(({ titlePage, type, paging, actionData, playlistDetail, audio, children }: PlaylistProps) => {
    const { setActive, setType } = useMenu();
    const navigate = useNavigate();

    const category = useSelector((state: RootState) => state.category);
    const [title, setTitle] = useState<string>('');

    useEffect(() => {
        if (title !== '')
            return;

        playlistDetail.title && setTitle(playlistDetail.title);
    }, [playlistDetail]);

    let isExistType = Object.keys(type).length > 0;

    return (
        <>
            {Object.keys(playlistDetail).length > 0 && <CommonPage
                pagingData={paging || []}
                title={titlePage || `Playlist ${title}`}
                actionData={actionData}
                className={cx('common-page-container')}
            >
                <form className={cx('playlist-form')} onSubmit={isExistType && type !== 'read' && type.formik.handleSubmit}>
                    <div className={cx('playlist-form__information')}>
                        <div className={cx('container__playlist-info')}>
                            <div className={cx('info__header')}>
                                {isExistType && type !== 'read'
                                    ? <>
                                        <div className={cx('info__header__image')}>
                                            <p>Ảnh bìa <span>*</span></p>
                                            <Upload />
                                        </div>
                                        <Input
                                            small
                                            fieldName="Tiêu đề:"
                                            isRequired
                                            name="title"
                                            value={playlistDetail.title}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => type.formik.setFieldValue('title', e.target.value)}
                                        />
                                    </>
                                    : <>
                                        <Image src={playlistDetail.imageURL} alt='playlist image' width={274} height={274} />
                                        <p>{playlistDetail.title}</p>
                                    </>
                                }
                            </div>
                            <div className={cx('info__content')}>
                                <div className={cx('item__left')}>
                                    {Object.keys(playlistDetail.createdBy).length > 0 && <p>Người tạo:</p>}
                                    <p>Tổng số:</p>
                                    <p>Tổng thời lượng:</p>
                                </div>
                                <div className={cx('item__right')}>
                                    <p>{Object.keys(playlistDetail.createdBy).length > 0 && playlistDetail.createdBy.role.name}</p>
                                    <p>{playlistDetail.quantity} bản ghi</p>
                                    <p>{playlistDetail.totalTime}</p>
                                </div>
                            </div>
                            <div className={cx('info__description')}>
                                {isExistType && type !== 'read'
                                    ? <Input
                                        small
                                        as='textarea'
                                        rows={4}
                                        fieldName="Mô tả:"
                                        name="description"
                                        value={playlistDetail.description}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => type.formik.setFieldValue('description', e.target.value)}
                                    />
                                    : <p>{playlistDetail.description}</p>
                                }
                            </div>
                            <div className={cx('info__category')}>
                                {isExistType && type !== 'read'
                                    ? <div className={cx('info__category__container')}>
                                        <div className={cx('info__category__box')}>
                                            {playlistDetail.categories.map((id: string) =>
                                                <CategoryBoxItem
                                                    key={id}
                                                    title={category.categoryList.find(category => category.id === id)?.name}
                                                    onClick={() => { type.formik.setFieldValue('categories', playlistDetail.categories.filter(category => category !== id)) }}
                                                />
                                            )}
                                        </div>
                                        <Input name='' placeholder='Nhập chủ đề' />
                                    </div>
                                    : <>
                                        {playlistDetail.categories.map((id: string) => (
                                            <div key={id} className={cx('info__category__item')}>
                                                <span></span>
                                                <span>{category.categoryList.find(category => category.id === id)?.name}</span>
                                            </div>
                                        ))}
                                    </>
                                }
                            </div>
                            <div className={cx('info__mode')}>
                                {isExistType && type !== 'read'
                                    ? <Switch
                                        title='Chế độ công khai'
                                        status={playlistDetail.mode === 'public' ? true : false}
                                        onClick={() => type.formik.setFieldValue('mode', playlistDetail.mode === 'public' ? 'private' : 'public')}
                                    />
                                    : <>
                                        <div className={cx('info__mode__item')}>
                                            <FontAwesomeIcon icon={faEarthAmericas} />
                                            <span>Hiển thị ở chế độ {playlistDetail.mode === 'public' ? 'công khai' : 'riêng tư'}</span>
                                        </div>
                                        <div className={cx('info__mode__item')}>
                                            <FontAwesomeIcon icon={faShuffle} />
                                            <span>Phát ngẫu nhiên</span>
                                        </div>
                                        <div className={cx('info__mode__item')}>
                                            <FontAwesomeIcon icon={faRepeat} />
                                            <span>Lặp lại</span>
                                        </div>
                                    </>
                                }
                            </div>
                        </div>
                        <div className={cx('container-table-data', 'table-data')}>
                            {children}
                            {/* {type !== 'read' && <>
                                <Button outline type='button' onClick={() => navigate(`/playlist-detail/${playlistDetail.playlistRecordId}`)}>Hủy</Button>
                                <Button type='submit'>Lưu</Button>
                            </>} */}
                        </div>
                    </div>
                    <div className={cx('playlist-form__action')}>

                    </div>
                </form>
                {audio && <AudioDialog src={audio.audioLink} visible={audio.active} setVisible={audio.setActive} />}
            </CommonPage >}
        </>
    );
})