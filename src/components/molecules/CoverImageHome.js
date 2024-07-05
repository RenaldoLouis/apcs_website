import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import AnimatedComponent from "../atom/AnimatedComponent";
import { useLocation } from "react-router-dom";

// import homeScreen from "../../assets/images/homeScreenImage.svg"

const CoverImageHome = (props) => {
    const { logo, isMiddleLeft, background } = props

    const location = useLocation();
    const { ref: ref1, inView: inView1 } = useInView({
        triggerOnce: true,
        threshold: 0,
        rootMargin: '0px 0px -100px 0px',
    });

    const [isImageLoaded, setIsImageLoaded] = useState(false);

    useEffect(() => {
        setIsImageLoaded(false);  // Reset when background prop changes
    }, [background, location]);

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

            <div className={isMiddleLeft ? "registerButtonContainer-centerLeft" : "registerButtonContainer-center-top"}>
                <AnimatedComponent animationClass="animate__fadeIn">
                    {logo && (
                        <img className="homeScreenLogo" loading="lazy" src={logo} alt="apcsLogo" />
                    )}
                </AnimatedComponent>
            </div>

        </div>
    )
}

export default CoverImageHome;