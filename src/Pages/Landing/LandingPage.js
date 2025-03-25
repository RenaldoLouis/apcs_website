import Lottie from "lottie-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import backgroundWelcome2 from "../../assets/images/backgroundWelcome2.png";
import homeScreenImageGradient from "../../assets/images/homeScreenImageGradient.jpg";
import homeScreenImageGradientMobile from "../../assets/images/homeScreenImageGradientMobile.jpg";
import loadingAnimation from "../../assets/lottie/loading.json";

const LandingPage = React.memo((props) => {
    const navigate = useNavigate();
    const [isReadyToNavigate, setIsReadyToNavigate] = useState(false);

    useEffect(() => {
        const imagesToPreload = [homeScreenImageGradient, homeScreenImageGradientMobile, backgroundWelcome2];

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
            <Lottie style={{ width: "15%", paddingLeft: "3px" }} animationData={loadingAnimation} loop={true} />

        </article >
    )
});

export default LandingPage;