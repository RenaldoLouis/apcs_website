import React from "react";
// import homeScreen from "../../assets/images/homeScreenImage.svg"

const CoverImageHome = (props) => {
    const { logo, isMiddleLeft, background } = props
    return (
        <div className='overflow-x-hidden'>
            <div className="fadeDarkImageTopBottom">
                <img loading="lazy" src={background}
                    alt="homeScreen"
                    className='homeScreenimage' />
            </div>

            <div className={isMiddleLeft ? "registerButtonContainer-centerLeft" : "registerButtonContainer-center-top"}>
                <img loading="lazy" src={logo} alt="apcsLogo" style={{ width: 400 }} />
            </div>

        </div>
    )
}

export default CoverImageHome;