import React from "react";
import { useInView } from "react-intersection-observer";
import AnimatedComponent from "../atom/AnimatedComponent";
// import homeScreen from "../../assets/images/homeScreenImage.svg"

const CoverImageHome = (props) => {
    const { ref: ref1, inView: inView1 } = useInView({
        triggerOnce: true,
        threshold: 0,
        rootMargin: '0px 0px -100px 0px',
    });

    const { logo, isMiddleLeft, background } = props
    return (
        <div className='overflow-x-hidden' style={{ position: "relative" }}>
            <div className="fadeDarkImageTopBottom">
                <img loading="lazy" src={background}
                    alt="homeScreen"
                    className='homeScreenimage' />
            </div>

            <div className={isMiddleLeft ? "registerButtonContainer-centerLeft" : "registerButtonContainer-center-top"}>
                <AnimatedComponent animationClass="animate__fadeIn">
                    <img className="homeScreenLogo" loading="lazy" src={logo} alt="apcsLogo" />
                </AnimatedComponent>
            </div>

        </div>
    )
}

export default CoverImageHome;