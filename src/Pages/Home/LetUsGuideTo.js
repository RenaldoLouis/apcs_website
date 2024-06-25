import React from "react";
import background2 from '../../assets/images/Background2.svg';
import taleMusicalJourney from "../../assets/images/TaleMusicalJourney.svg"
import letUsGuideYou from "../../assets/images/LetUsGuideYou.svg"
import { useInView } from "react-intersection-observer";


const LetUsGuideTo = () => {
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
            <img loading="lazy" src={background2} alt={`background2`} style={{ width: "100%", marginBottom: "-3px" }} />

            <div className={`letUsGuideYou`}>
                <img
                    ref={ref1} className={`animate__animated ${inView2 ? "animate__fadeIn" : ''}`}
                    loading="lazy" src={letUsGuideYou} alt="apcsLogo" style={{ width: "26%", visibility: inView2 ? "" : "hidden"  }} />
            </div>

            <div className={`taleMusical`}>
                <img
                    ref={ref2} className={`animate__animated ${inView2 ? "animate__fadeIn" : ''}`}
                    loading="lazy" src={taleMusicalJourney} alt="apcsLogo" style={{ width: "72%", visibility: inView2 ? "" : "hidden" }} />
            </div>
        </div>
    )
}

export default LetUsGuideTo;