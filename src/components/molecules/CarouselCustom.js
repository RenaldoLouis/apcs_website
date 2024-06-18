import React, { useState, useEffect } from 'react';
import arrowRightCover from "../../assets/icons/arrowRightCover.png"
import arrowLeftCover from "../../assets/icons/arrowLeftCover.png"
import PillButton from '../atom/PillButton';
import coverImage1 from "../../assets/images/coverImage1.png"
import { logEvent } from "firebase/analytics";
import { analytics } from '../../firebase';

const images = [
    coverImage1,
    "https://images.unsplash.com/photo-1657586640569-4a3d4577328c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1656077217715-bdaeb06bd01f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80"
]

const Carousel = ({ interval = 5000, homePage = true }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
        }, interval);

        return () => clearInterval(intervalId);
    }, [interval]);

    const goToPrevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };

    const goToNextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    };

    const handleClickRegisterNow = () => {
        logEvent(analytics, 'register_now');
    }

    return (
        <>
            <div className='carouselContainer'>
                {images.map((eachImage, index) => (
                    <img loading="lazy" style={{ '--currentIndex': currentIndex }} className="carousel-image" id={`slide-${index}`} src={eachImage} alt={`photos-${index}`} />
                ))}
                <div className="carousel-navigation">
                    <button className="carousel-prev" onClick={goToPrevSlide}>
                        <img loading="lazy" src={arrowLeftCover} style={{ width: 54, height: 54 }} alt="arrowLeft" />
                    </button>
                    <button className="carousel-next" onClick={goToNextSlide}>
                        <img loading="lazy" src={arrowRightCover} style={{ width: 54, height: 54 }} alt="arrowRight" />
                    </button>
                </div>
                <div className='titleCoverContainer'>
                    <div style={{ '--currentIndex': currentIndex }} className='titleCoverContainerText'>
                        {/* titleCenter 1 */}
                    </div>
                    <div style={{ '--currentIndex': currentIndex }} className='titleCoverContainerText'>
                        titleCenter 2
                    </div>
                    <div style={{ '--currentIndex': currentIndex }} className='titleCoverContainerText'>
                        titleCenter 3
                    </div>
                </div>

                {homePage ? (
                    <div className={"slider-nav"}>
                        <div className='slider-nav-dot' style={{ opacity: currentIndex === 0 ? 1 : 0.75, cursor: "pointer" }} onClick={() => setCurrentIndex(0)}></div>
                        <div className='slider-nav-dot' style={{ opacity: currentIndex === 1 ? 1 : 0.75, cursor: "pointer" }} onClick={() => setCurrentIndex(1)}></div>
                        <div className='slider-nav-dot' style={{ opacity: currentIndex === 2 ? 1 : 0.75, cursor: "pointer" }} onClick={() => setCurrentIndex(2)}></div>
                    </div>
                ) : (
                    <div className="slider-nav-leftSide">
                        <div
                            style={{ marginLeft: 28, display: "flex", columnGap: "1rem" }}>
                            <div className='slider-nav-dot' style={{ opacity: currentIndex === 0 ? 1 : 0.75, cursor: "pointer" }} onClick={() => setCurrentIndex(0)}></div>
                            <div className='slider-nav-dot' style={{ opacity: currentIndex === 1 ? 1 : 0.75, cursor: "pointer" }} onClick={() => setCurrentIndex(1)}></div>
                            <div className='slider-nav-dot' style={{ opacity: currentIndex === 2 ? 1 : 0.75, cursor: "pointer" }} onClick={() => setCurrentIndex(2)}></div>
                        </div>
                        <div className="carousel-next" />
                    </div>
                )}

                {homePage ? (
                    <div className='cursorPointer registerButtonContainer' onClick={handleClickRegisterNow}>
                        <PillButton text={"Register Now"} />
                    </div>
                ) : (
                    <div className="registerButtonContainer-leftSide">
                        <div style={{ color: "white", marginLeft: 25 }}>
                            <p>
                                2023 A Christmas Wonderland
                            </p>
                            <p style={{ width: "50vw", height: 100 }}>
                                Lorem ipsum dolor  sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt  ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud  exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            </p>
                        </div>
                        <div className="carousel-next" />
                    </div>
                )}
            </div>
        </>
    );
};

export default Carousel;
