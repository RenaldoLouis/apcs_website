import React, { useEffect, useState } from "react";
import village from "../../assets/videos/village.mp4"
// import homeScreen from "../../assets/images/homeScreenImage.svg"

const CoverImage = (props) => {
    const { logo, isMiddleLeft, background } = props
    return (
        <div className='overflow-x-hidden'>
            <div
                className="fullScreenHeight"
            >
                <img loading="lazy" src={background}
                    alt="homeScreen"
                    className='CoverImageContainer' />
            </div>

            <div className={isMiddleLeft ? "registerButtonContainer-centerLeft" : "registerButtonContainer-center"}>
                <img loading="lazy" src={logo} alt="apcsLogo" style={{ width: 400 }} />
            </div>

        </div>
    )
}

export default CoverImage;