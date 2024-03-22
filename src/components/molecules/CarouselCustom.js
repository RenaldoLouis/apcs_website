import React, { useState, useEffect } from 'react';
import arrowRight from "../../assets/icons/arrowRight.png"
import arrowLeft from "../../assets/icons/arrowLeft.png"
import PillButton from '../atom/PillButton';

const images = [
    "https://images.unsplash.com/photo-1656464868371-602be27fd4c2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1657586640569-4a3d4577328c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1656077217715-bdaeb06bd01f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80"
]

const Carousel = ({ interval = 3000 }) => {
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

    return (
        <>
            <div className='carouselContainer'>
                {images.map((eachImage, index) => (
                    <img style={{ '--currentIndex': currentIndex }} className="carousel-image" id={`slide-${index}`} src={eachImage} alt={`photos-${index}`} />
                ))}
                <div className="carousel-navigation">
                    <button className="carousel-prev" onClick={goToPrevSlide}>
                        <img src={arrowLeft} style={{ width: 54, height: 54 }} alt="arrowLeft" />
                    </button>
                    <button className="carousel-next" onClick={goToNextSlide}>
                        <img src={arrowRight} style={{ width: 54, height: 54 }} alt="arrowRight" />
                    </button>
                </div>
                <div className='titleCoverContainer'>
                    <div style={{ '--currentIndex': currentIndex }} className='titleCoverContainerText'>
                        titleCenter 1
                    </div>
                    <div style={{ '--currentIndex': currentIndex }} className='titleCoverContainerText'>
                        titleCenter 2
                    </div>
                    <div style={{ '--currentIndex': currentIndex }} className='titleCoverContainerText'>
                        titleCenter 3
                    </div>
                </div>
                <div className="slider-nav">
                    <div className='slider-nav-dot' style={{ opacity: currentIndex === 0 ? 1 : 0.75, cursor: "pointer" }} onClick={() => setCurrentIndex(0)}></div>
                    <div className='slider-nav-dot' style={{ opacity: currentIndex === 1 ? 1 : 0.75, cursor: "pointer" }} onClick={() => setCurrentIndex(1)}></div>
                    <div className='slider-nav-dot' style={{ opacity: currentIndex === 2 ? 1 : 0.75, cursor: "pointer" }} onClick={() => setCurrentIndex(2)}></div>
                </div>
                <div className='registerButtonContainer'>
                    <PillButton text={"Register Now"} />
                </div>
            </div>
        </>
    );
};

export default Carousel;
