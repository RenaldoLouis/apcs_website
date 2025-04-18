import React from "react";
import PillButton from "../atom/PillButton";
import { ContentPosition } from "../../constant/ContentPosition";

const BackgroundWithText = (props) => {
    const { image, logo, text, buttonText, contentPosition, centerText = true, noRelativeContainer, buttonOnclick = () => { } } = props

    const returnTextPosition = () => {
        switch (contentPosition) {
            case ContentPosition.MIDDLEBOTTOM:
                return "registerButtonContainer-bottom"
            case ContentPosition.MIDDLE:
                return "registerButtonContainer-center"
            case ContentPosition.MIDDLELEFT:
                return "registerButtonContainer-center-left"
            default:
                return "registerButtonContainer-bottom"
        }
    }

    return (
        <div
            style={{ position: noRelativeContainer ? "" : "relative" }}
        >
            <img loading="lazy" src={image} alt={`saphireAbout`} style={{ width: "100%" }} />
            <div className={returnTextPosition()} style={{ color: "white" }}>
                <div>
                    <img loading="lazy" src={logo} alt={logo} style={{ width: "38vmin", marginBottom: 25 }} />
                </div>
                <div className="container mb-2">
                    <div className={`row ${centerText ? "justify-content-md-center" : "justify-content-md-start"} text-align-center`}>
                        <div className="col col-lg-10" style={{ fontSize: "2vmin" }}>
                            {text}
                        </div>
                    </div>
                </div>
                <div style={{ display: buttonText === "" ? "none" : "", marginTop: 5 }}>
                    <PillButton text={buttonText} onClick={buttonOnclick} />
                </div>
            </div>
        </div>
    )
}

export default BackgroundWithText;