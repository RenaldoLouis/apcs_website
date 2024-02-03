import React, { useEffect, useState } from "react";
import rengoku from "../../assets/videos/rengoku.mp4"
import village from "../../assets/videos/village.mp4"

const CoverImage = (props) => {
    const { audio } = props

    const [isMutedVideo, setIsMutedVideo] = useState(false)

    useEffect(() => {
        audio.pause();
        audio.currentTime = 0;
        audio.load();
    }, [audio])

    return (
        <div className='overflow-x-hidden'>
            <video src={village}
                muted={isMutedVideo}
                playsinline loop autoPlay className='video-container'></video>

            <div className='content-container'>
                <span className='text-6xl'>
                    Background Video
                </span>
                <span className='text-neutral-200'>
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. A, quas, iusto corrupti quidem, molestiae id quia necessitatibus veritatis dolorum reprehenderit totam eligendi aliquid quo suscipit praesentium commodi optio! Animi eaque omnis, velit et alias inventore maxime mollitia accusamus laborum rem! Est dolor veniam hic ad eos illum similique maxime harum, eveniet eum in neque quidem magnam consectetur facere tempora animi error repellat aliquid sequi praesentium! Quidem nisi, perferendis blanditiis quam placeat voluptate optio provident eveniet voluptatum modi sequi dolorum repellat ipsam doloremque consectetur, autem voluptas fugiat reiciendis ullam ipsum eum! Excepturi nesciunt et facere. Voluptas error quam excepturi expedita quod!
                </span>
                <button className="readMoreButtonContainer">
                    Read More
                </button>
            </div>
        </div>
    )
}

export default CoverImage;