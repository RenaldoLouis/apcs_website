import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import persona5 from "../../assets/audios/p5.mp3"

const audio = new Audio(persona5);
const LandingPage = () => {
    const navigate = useNavigate();

    const [isWelcomeExit, setIsWelcomeExit] = useState(false)

    const handleClickWelcome = () => {
        audio.play()

        document.getElementById("welcomeText").classList.add('welcomeExit')

        setTimeout(() => {
            setIsWelcomeExit(true)
        }, 2000);
    }

    const handleClickAPCS = () => {
        document.getElementById("apcsText").classList.add('welcomeExit')
        document.getElementById("buttonEntrance").classList.add('buttonExit')
    }

    const handleExplore = () => {
        audio.pause();
        audio.currentTime = 0;
        audio.load();
        navigate("/home");
    }

    return (
        <div className="landingContiner" >
            {!isWelcomeExit ? (
                <div id="welcomeText" className="welcomeEntrance" onClick={() => handleClickWelcome()}>
                    Welcome
                </div>
            ) : (
                <div>
                    <div id="apcsText" className="welcomeEntrance" onClick={() => handleClickAPCS()}>
                        APC Website
                    </div>
                    <div id="buttonEntrance" className="buttonEntrance" onClick={() => handleExplore()}>
                        button
                    </div>
                </div>
            )}
        </div>
    )
}

export default LandingPage;