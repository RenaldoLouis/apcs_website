import React, { useEffect, useRef, useState } from "react";
import {
    MutedOutlined,
    CloseOutlined,
    PlayCircleOutlined,
    PauseCircleOutlined
} from '@ant-design/icons';
const CoverVideo = (props) => {
    const { video } = props

    const [isMutedVideo, setIsMutedVideo] = useState(false)
    const [isVideoPlay, setIsVideoPlay] = useState(false)

    const videoRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;

        const handlePlay = () => {
            setIsVideoPlay(true);
        };

        const handlePause = () => {
            setIsVideoPlay(false);
        };

        // Add event listeners
        video.addEventListener('play', handlePlay);
        video.addEventListener('pause', handlePause);

        // Clean up event listeners on unmount
        return () => {
            video.removeEventListener('play', handlePlay);
            video.removeEventListener('pause', handlePause);
        };
    }, []);

    const handleClickPlayVideo = () => {
        setIsVideoPlay(true)
        const video = videoRef.current;
        if (video.paused) {
            video.play();
        }
    };

    const handleClickPauseVideo = () => {
        setIsVideoPlay(false)
        const video = videoRef.current;
        if (!video.paused) {
            video.pause();
        }
    };

    const handleClickMuteVideo = () => {
        setIsMutedVideo(true)
    }

    const handleClickUnmuteVideo = () => {
        setIsMutedVideo(false)
    }

    return (
        <div className='overflow-x-hidden' style={{ position: "relative" }}>
            <video ref={videoRef} src={video}
                // preload="none"
                muted={isMutedVideo}
                playsInline loop autoPlay className='video-container' style={{ objectFit: "cover", width: "100%", height: "100%" }} ></video>

            {/* <div className='content-container'>
                <span className='text-6xl'>
                    Background Video
                </span>
                <span className='text-neutral-200'>
                    Welcome text
                </span>
                <button className="readMoreButtonContainer" onClick={handleClickPlayVideo}>
                    Play Video
                </button>
            </div> */}


            <div className="registerButtonContainer-leftSide-Bottom cursorPointer justify-content-center" style={{ marginBottom: 16 }} >
                <div style={{ color: "white", marginLeft: 25 }}>
                    {/* <p>
                        2023 A Christmas Wonderland
                    </p> */}
                    {isVideoPlay ? (
                        <PauseCircleOutlined style={{ fontSize: 40, marginRight: 16 }} onClick={handleClickPauseVideo} />
                    ) : (
                        <PlayCircleOutlined style={{ fontSize: 40, marginRight: 16 }} onClick={handleClickPlayVideo} />
                    )}
                    <MutedOutlined style={{ fontSize: 40 }} onClick={handleClickMuteVideo} />
                    <CloseOutlined className="closeMute" onClick={handleClickUnmuteVideo} style={{ fontSize: 40, display: isMutedVideo ? "" : "none" }} />
                    {/* <p style={{ width: "50vw", height: 100 }}>
                        Lorem ipsum dolor  sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt  ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud  exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p> */}
                </div>
                <div className="carousel-next" />
            </div>
        </div>
    )
}

export default CoverVideo;