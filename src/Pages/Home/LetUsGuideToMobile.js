import React from "react";
import { useInView } from "react-intersection-observer";
import backgroundLetUsguideTocropped from "../../assets/images/backgroundLetUsguideTocropped.jpg";
import letusGuideToMobilesvg from "../../assets/images/letusGuideToMobile.svg";


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
            <img loading="lazy" src={backgroundLetUsguideTocropped} alt={`backgroundLetUsguideTocropped`} style={{ width: "100%", marginBottom: "-3px" }} />

            {/* <div className={`letUsGuideYou`}>
                <img
                    ref={ref1} className={`animate__animated ${inView2 ? "animate__fadeIn" : ''}`}
                    loading="lazy" src={letUsGuideYou} alt="apcsLogo" style={{ width: "26%", visibility: inView2 ? "" : "hidden" }} />
            </div> */}

            <div className={`taleMusicalMobile`} style={{ zIndex: 1000 }}>
                <img
                    ref={ref2} className={`animate__animated ${inView2 ? "animate__fadeIn" : ''}`}
                    loading="lazy" src={letusGuideToMobilesvg} alt="apcsLogo" style={{ width: 250, visibility: inView2 ? "" : "hidden" }} />
            </div>
        </div >
    )
}

export default LetUsGuideToMobile;