import React from "react";
import background2Small from '../../assets/images/Background2-small.jpg';
import taleBackgroundMobile from "../../assets/images/taleBackgroundMobile.jpg"
import taleMusicalJourney from "../../assets/images/TaleMusicalJourney.svg"
import letUsGuideYou from "../../assets/images/LetUsGuideYou.svg"
import letusGuideToMobile from "../../assets/images/letusGuideToMobile.png"
import { useInView } from "react-intersection-observer";
import zIndex from "@mui/material/styles/zIndex";


const LetUsGuideToMobile = () => {
    const { ref: ref1, inView: inView1 } = useInView({
        triggerOnce: true,
        threshold: 0,
        rootMargin: '0px 0px -100px 0px',
    });

    const { ref: ref2, inView: inView2 } = useInView({
        triggerOnce: true,
        threshold: 0,
        rootMargin: '0px 0px -100px 0px',
    });

    return (
        <div className="image-container-fadedTopBottom autoHeight">
            <img loading="lazy" src={taleBackgroundMobile} alt={`taleBackgroundMobile`} style={{ width: "100%", marginBottom: "-3px" }} />

            {/* <div className={`letUsGuideYou`}>
                <img
                    ref={ref1} className={`animate__animated ${inView2 ? "animate__fadeIn" : ''}`}
                    loading="lazy" src={letUsGuideYou} alt="apcsLogo" style={{ width: "26%", visibility: inView2 ? "" : "hidden" }} />
            </div> */}

            <div className={`taleMusicalMobile`} style={{ zIndex: 1000 }}>
                <img
                    ref={ref2} className={`animate__animated ${inView2 ? "animate__fadeIn" : ''}`}
                    loading="lazy" src={letusGuideToMobile} alt="apcsLogo" style={{ width: 200, visibility: inView2 ? "" : "hidden" }} />
            </div>
        </div >
    )
}

export default LetUsGuideToMobile;