import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import taleMusicalJourney from "../../assets/images/TaleMusicalJourney.svg";
import node1 from "../../assets/images/welcomePage/node1.png";
import node2 from "../../assets/images/welcomePage/node2.png";
import node3 from "../../assets/images/welcomePage/node3.png";
import node4 from "../../assets/images/welcomePage/node4.png";

const LandingPage = React.memo((props) => {
    const navigate = useNavigate();

    const [isShowWelcome, setIsShowWelcome] = useState(false);

    useEffect(() => {
        setTimeout(() => { setIsShowWelcome(true) }, 2000)
        setTimeout(() => { navigate("/home"); }, 3000)
    }, [navigate])

    return (
        <article className="landingContiner" >
            {isShowWelcome ? (
                <img alt="welcomeImageDesc" src={taleMusicalJourney} className="welcomeImage fade-in-image-welcome" />
            ) : (
                <div className="fadeout-out-node">
                    <img alt="node1" src={node1} className="nodeWelcome fade-in-image" />
                    <img alt="node2" src={node2} className="nodeWelcome fade-in-image2" />
                    <img alt="node3" src={node3} className="nodeWelcome fade-in-image3" />
                    <img alt="node4" src={node4} className="nodeWelcome fade-in-image4" />
                </div>
            )}
        </article >
    )
});

export default LandingPage;