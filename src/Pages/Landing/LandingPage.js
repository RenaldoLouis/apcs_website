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
    }, [])

    return (
        <article className="landingContiner" >
            {isShowWelcome ? (
                <img src={taleMusicalJourney} className="fade-in-image-welcome" />
            ) : (
                <div className="fadeout-out-node">
                    <img src={node1} className="fade-in-image" />
                    <img src={node2} className="fade-in-image2" />
                    <img src={node3} className="fade-in-image3" />
                    <img src={node4} className="fade-in-image4" />
                </div>
            )}
        </article >
    )
});

export default LandingPage;