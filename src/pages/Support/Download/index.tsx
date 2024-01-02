import classNames from "classnames/bind";
import { ReactNode, memo, useEffect, useState } from "react";

import { Button } from "~/components/Button";
import Image from "~/components/Image";
import { PagingItemType } from "~/components/Paging";
import { DOWNLOAD_ITEMS } from "~/constants";
import { Icon } from "~/icons";
import { CommonPage } from "~/pages/CommonPage";
import { Vector } from "../Components/Vector";
import style from './Download.module.scss';

const cx = classNames.bind(style);

type DownloadItem = {
    image: ReactNode;
    title: string;
}

type DownloadBoxItemProps = {
    data: DownloadItem;
    className?: string;
}

const DownloadBoxItem = memo(({ data, className }: DownloadBoxItemProps) => {
    return (
        <div className={cx('download__box-item', className)}>
            {data.image}
            <Button>{data.title}</Button>
        </div>
    );
});

function SupportDownloadPage() {
    const [paging, setPaging] = useState<Array<PagingItemType>>([] as Array<PagingItemType>);

    useEffect(() => {
        setPaging([
            {
                title: 'Hỗ trợ',
                to: '#',
                active: true
            }, {
                title: 'Tải App',
                to: '#',
                active: true
            }
        ]);
    }, []);

    return (
        <CommonPage
            title='Tải App'
            pagingData={paging}
            className={cx('support-download')}
        >
            <div className={cx('support-download__content')}>
                <p className={cx('support-download__content__title')}>ứng dụng <span>vcpmc</span></p>
                <div className={cx('support-download__content__sub-title')}>
                    <p>Bạn vui lòng chọn</p>
                    <span>nền tảng</span>
                    <span> phù hợp để trải nghiệm</span>
                </div>
                <div className={cx('support-download__content__download')}>
                    {DOWNLOAD_ITEMS.map(item => {
                        let imageTag: ReactNode = <></>;

                        if (item.format === 'image')
                            imageTag = <Image src={item.image} alt={item.title} height={142} className={cx('content__download__image')} />
                        else imageTag = <Icon icon={item.image} />

                        return <DownloadBoxItem key={item.title} data={{
                            image: imageTag,
                            title: item.title
                        }} />
                    })}
                </div>
            </div>
            <Vector />
        </CommonPage>
    );
}

export default SupportDownloadPage;