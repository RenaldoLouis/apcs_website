import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { AnimationClass } from "../../constant/AnimationClass";
import { ContentPosition } from "../../constant/ContentPosition";
import AnimatedComponent from "../atom/AnimatedComponent";

const CoverImageHomeMobile = (props) => {
    const { logo, background, position } = props
    const location = useLocation();

    const { t, i18n } = useTranslation();
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    const returnTextPosition = () => {
        switch (position) {
            case ContentPosition.MIDDLE:
                return "registerButtonContainer-center"
            case ContentPosition.MIDDLE50:
                return "registerButtonContainer-center50"
            case ContentPosition.MIDDLELEFT:
                return "registerButtonContainer-centerLeft"
            case ContentPosition.MIDDLELEFT40:
                return "registerButtonContainer-centerLeft40"
            default:
                return "registerButtonContainer-center-top"
        }
    }

    const handleImageLoad = () => {
        setIsImageLoaded(true);
    };

    return (
        <div className='overflow-x-hidden' style={{ position: "relative" }}>
            <div className="fadeDarkImageTopBottom">
                <img
                    //  loading="lazy"
                    key={location.pathname}
                    src={background}
                    alt="homeScreen"
                    className='homeScreenimage'
                    onLoad={handleImageLoad} style={{ display: isImageLoaded ? "" : "none" }} />
                <div style={{ background: 'black', width: "100vw", height: "100vh", display: isImageLoaded ? "none" : "" }} />
            </div>

            <div className={returnTextPosition()}>
                <AnimatedComponent animationClass={AnimationClass.fadeIn}>
                    {logo && (
                        <img className={"homeScreenLogoMobile"} loading="lazy" src={logo} alt="apcsLogo" />
                    )}
                </AnimatedComponent>
            </div>

            <div style={{
                position: 'absolute', top: '75%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: "350px"
            }}>
                <AnimatedComponent animationClass={AnimationClass.fadeIn}>
                    <div className="row justify-center" style={{ justifySelf: "center" }}>
                        <div className="col-md-6">
                            <div className="goldenText mangolaineFont" style={{ fontSize: 40, textAlign: 'center', width: 237, letterSpacing: 5, lineHeight: "38px" }}>
                                A PIANO CONCERTO SERIES
                            </div>
                        </div>
                    </div>
                    <div className="row justify-center" style={{ marginTop: 18 }}>
                        <div className="col-md-6">
                            <div className="fontSizeDesktopOnlyHeader text-align-center" style={{ color: "white" }}>
                                {t("home1")}
                            </div>
                        </div>
                    </div>
                </AnimatedComponent>
            </div>

        </div>
    )
}

export default CoverImageHomeMobile;