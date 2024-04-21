import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = React.memo((props) => {
    const navigate = useNavigate();
    const { audio } = props

    const [isWelcomeExit, setIsWelcomeExit] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            document.getElementById("welcomeText").classList.add('welcomeExit')
            setTimeout(() => {
                // setIsWelcomeExit(true)
                handleExplore()
            }, 2100);
        }, 2100);
    }, [audio])

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
        <article className="landingContiner" >
            {!isWelcomeExit ? (
                <h2 id="welcomeText" className="welcomeEntrance"
                // onClick={() => handleClickWelcome()}
                >
                    Welcome
                </h2>
            ) : (
                <section>
                    <h2 id="apcsText" className="welcomeEntrance" onClick={() => handleClickAPCS()}>
                        APC Website
                    </h2>
                    <h2 id="buttonEntrance" className="buttonEntrance buttonStyle" onClick={() => handleExplore()} style={{ marginTop: 35 }}>
                        Explore
                    </h2>
                </section>
            )}
        </article>
    )
});

export default LandingPage;