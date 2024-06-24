import React from "react";
import { ContentPosition } from "../../constant/ContentPosition";
// import homeScreen from "../../assets/images/homeScreenImage.svg"

const CoverImage = (props) => {
    const { logo, isMiddleLeft, background, position } = props

    const returnTextPosition = () => {
        switch (position) {
            case ContentPosition.MIDDLE:
                return "registerButtonContainer-center"
            case ContentPosition.MIDDLELEFT:
                return "registerButtonContainer-centerLeft"
            default:
                return "registerButtonContainer-center"
        }
    }
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