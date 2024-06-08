import React, { useEffect, useState } from "react";
import village from "../../assets/videos/village.mp4"
import homeScreen from "../../assets/images/homeScreenImage.svg"

const CoverVideo = (props) => {
    const { audio, isVideo = false, noText = true } = props
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
                        className='video-container' />
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

            {noText && (
                <div className="registerButtonContainer-leftSide">
                    <div style={{ color: "white", marginLeft: 25 }}>
                        <p>
                            2023 A Christmas Wonderland
                        </p>
                        <p style={{ width: "50vw", height: 100 }}>
                            Lorem ipsum dolor  sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt  ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud  exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </p>
                    </div>
                    <div className="carousel-next" />
                </div>
            )}

        </div>
    )
}

export default CoverVideo;