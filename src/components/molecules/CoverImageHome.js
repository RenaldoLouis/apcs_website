import React, { useEffect, useState } from "react";
import village from "../../assets/videos/village.mp4"
// import homeScreen from "../../assets/images/homeScreenImage.svg"

const CoverImageHome = (props) => {
    const { logo, isMiddleLeft, background } = props
    return (
        <div className='overflow-x-hidden'>
            <div className="fadeDarkImageTopBottom">
                <img src={background}
                    alt="homeScreen"
                    className='homeScreenimage' />
            </div>

            <div className={isMiddleLeft ? "registerButtonContainer-centerLeft" : "registerButtonContainer-center"}>
                <img src={logo} alt="apcsLogo" style={{ width: 400 }} />
            </div>

        </div>
    )
}

export default CoverImageHome;