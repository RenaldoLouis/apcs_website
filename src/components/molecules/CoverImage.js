import React, { useEffect, useState } from "react";
import village from "../../assets/videos/village.mp4"
import homeScreen from "../../assets/images/homeScreenImage.svg"
import apcLogoBold from "../../assets/images/apc_logo_bold.svg"

const CoverImage = () => {

    return (
        <div className='overflow-x-hidden'>
            <div className="fadeDarkImageTopBottom">
                <img src={homeScreen}
                    alt="homeScreen"
                    className='homeScreenimage' />
            </div>

            <div className="registerButtonContainer-center">
                <img src={apcLogoBold} alt="apcsLogo" style={{ width: 400 }} />
            </div>

        </div>
    )
}

export default CoverImage;