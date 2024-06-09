import React, { useEffect, useState } from "react";
import village from "../../assets/videos/village.mp4"
import homeScreen from "../../assets/images/homeScreenImage.svg"
import apcLogo from "../../assets/images/apc_logo.svg"

const CoverImage = (props) => {
    const { audio, isVideo = false } = props
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
            {isVideo ? (
                <video src={village}
                    // preload="none"
                    muted={isMutedVideo}
                    playsInline loop autoPlay className='video-container' />
            ) : (
                <div className="imageContainer">
                    <img src={homeScreen}
                        alt="homeScreen"
                        className='image-container' />
                </div>
            )}

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

            <div className="registerButtonContainer-center">
                <img src={apcLogo} alt="apcsLogo" style={{ width: 400 }} />
            </div>

        </div>
    )
}

export default CoverImage;