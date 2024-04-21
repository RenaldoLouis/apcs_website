import React, { useEffect, useState } from "react";
import village from "../../assets/videos/village.mp4"

const CoverImage = (props) => {
    const { audio } = props
    const [isMutedVideo, setIsMutedVideo] = useState(false)

    // useEffect(() => {
    //     audio.pause();
    //     audio.currentTime = 0;
    //     audio.load();
    // }, [audio])

    const handleClickPlayVideo = () => {
        document.querySelector("video").play()
    }

    return (
        <div className='overflow-x-hidden'>
            <video src={village}
                // preload="none"
                muted={isMutedVideo}
                playsInline loop autoPlay className='video-container'></video>

            <div className='content-container'>
                <span className='text-6xl'>
                    Background Video
                </span>
                <span className='text-neutral-200'>
                    Welcome text
                </span>
                <button className="readMoreButtonContainer" onClick={handleClickPlayVideo}>
                    Play Video
                </button>
            </div>
        </div>
    )
}

export default CoverImage;