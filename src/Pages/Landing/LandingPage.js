import Lottie from "lottie-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import homeScreenImageGradient from "../../assets/images/homeScreenImageGradient.jpg";
import homeScreenImageGradientMobile from "../../assets/images/homeScreenImageGradientMobile.jpg";
import loadingAnimation2 from "../../assets/lottie/test.json";

const LandingPage = React.memo((props) => {
    const navigate = useNavigate();
    const [isReadyToNavigate, setIsReadyToNavigate] = useState(false);

    const [isShowWelcome, setIsShowWelcome] = useState(false);

    useEffect(() => {
        const imagesToPreload = [homeScreenImageGradient, homeScreenImageGradientMobile];

        Promise.all(
            imagesToPreload.map((src) => {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.src = src;
                    img.onload = resolve;
                    img.onerror = reject;
                });
            })
        )
            .then(() => setIsReadyToNavigate(true))
            .catch((err) => {
                console.error("Some assets failed to load", err);
                setIsReadyToNavigate(true); // optional fallback
            });
    }, []);

    useEffect(() => {
        if (isReadyToNavigate) {
            setTimeout(() => { navigate("/home"); }, 1500)
        }
    }, [isReadyToNavigate, navigate]);

    return (
        <article className="landingContiner" >
            {/* {isShowWelcome ? (
                <img alt="welcomeImageDesc" src={taleMusicalJourney} className="welcomeImage fade-in-image-welcome" />
            ) : (
                <Lottie animationData={loadingAnimation} loop={true} />
            )} */}
            <Lottie animationData={loadingAnimation2} loop={true} />
            {/* <Lottie animationData={{ animation: loadingAnimation }} loop={true} /> */}
            {/* {animationData ? (
                <Lottie animationData={animationData} loop={true} />
            ) : (
                <p>Loading animation...</p>
            )} */}

        </article >
    )
});

export default LandingPage;