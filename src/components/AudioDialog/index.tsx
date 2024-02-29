import { faClose, faMaximize, faPause, faPlay, faVolumeLow, faVolumeXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames/bind";
import { memo, useEffect, useRef, useState } from "react";

import { formatTime } from "~/context";
import { Input } from "../Input";
import style from './AudioDialog.module.scss';

const cx = classNames.bind(style);

type AudioDialogProps = {
    src: string;
    visible: boolean;
    setVisible: (visible: boolean) => void;
}

export const AudioDialog = memo(({ src, visible, setVisible }: AudioDialogProps) => {
    const [audioStatus, setAudioStatus] = useState<boolean>(true);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [muted, setMuted] = useState<boolean>(false);
    const [maximum, setMaximum] = useState<boolean>(false);

    const progressRef = useRef<HTMLDivElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const audioDialogRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const keyDownHandler = (event: any) => {
            if (event.key === 'Escape')
                setVisible(false);
        }

        document.addEventListener('keydown', keyDownHandler);

        return () => document.removeEventListener('keydown', keyDownHandler);
    }, []);

    useEffect(() => {
        if (audioRef.current) {
            try {
                audioStatus ? audioRef.current.play() : audioRef.current.pause();
            } catch (error) {
                console.log(error);
            }
        }
    }, [audioStatus]);

    useEffect(() => {
        if (progressRef.current)
            if (audioRef.current) {
                let currentTime = audioRef.current.currentTime;
                let duration = audioRef.current.duration;
                let widthPercent = currentTime * 100 / duration;

                progressRef.current.style.width = `${widthPercent}%`;
            }
    }, [currentTime]);

    useEffect(() => {
        if (audioDialogRef.current) {
            if (maximum)
                audioDialogRef.current.requestFullscreen();
            else if (document.fullscreenElement)
                document.exitFullscreen();
        }
    }, [maximum]);

    return (
        <div className={cx('audio-dialog-container', visible && 'active')}>
            <div ref={audioDialogRef} className={cx('audio-dialog')}>
                <FontAwesomeIcon
                    icon={faClose}
                    onClick={() => setVisible(false)}
                    className={cx('box__close-modal')}
                />
                <div
                    className={cx('audio-dialog__box')}
                    style={{
                        backgroundImage: 'url(https://res.cloudinary.com/dvlzvsyxs/image/upload/v1701143261/audio-file-types-36_tirpkn.jpg)',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover'
                    }}
                >
                    {visible && <audio muted={muted} ref={audioRef} autoPlay onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}>
                        <source src={src} type="audio/mpeg" />
                    </audio>}
                    <div className={cx('box__control')}>
                        <div className={cx('box__control__progress-bar')}>
                            <Input
                                type="range"
                                name='progress'
                                max={audioRef.current?.duration || 0}
                                value={currentTime}
                                className={cx('progress__input')}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setCurrentTime(parseInt(e.target.value)) }}
                            />
                            <div ref={progressRef} className={cx('range__progress')}></div>
                        </div>
                        <div className={cx('box__control__input')}>
                            <div className={cx('box__control__input__left')}>
                                {!audioStatus
                                    ? <FontAwesomeIcon icon={faPlay} className={cx('audio-status')} onClick={() => setAudioStatus(!audioStatus)} />
                                    : <FontAwesomeIcon icon={faPause} className={cx('audio-status')} onClick={() => setAudioStatus(!audioStatus)} />
                                }
                                {muted
                                    ? <FontAwesomeIcon icon={faVolumeXmark} className={cx('volume')} onClick={() => setMuted(!muted)} />
                                    : <FontAwesomeIcon icon={faVolumeLow} className={cx('volume')} onClick={() => setMuted(!muted)} />
                                }
                                <div className={cx('box__control__duration')}>
                                    <span>{formatTime(currentTime)}</span>
                                    <span> / </span>
                                    <span>{formatTime(audioRef.current?.duration || 0)}</span>
                                </div>
                            </div>
                            <div className={cx('box__control__input__right')}>
                                <FontAwesomeIcon icon={faMaximize} onClick={() => setMaximum(!maximum)} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
});