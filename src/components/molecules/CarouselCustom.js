import React, { useState, useEffect } from 'react';

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
            <div style={{ display: "flex", position: "relative" }}>
                {images.map((eachImage, index) => (
                    <img style={{ '--currentIndex': currentIndex }} className="carousel-image" id={`slide-${index}`} src={eachImage} alt={`photos-${index}`} />
                ))}
                <div className="carousel-navigation">
                    <button className="carousel-prev" onClick={goToPrevSlide}>
                        &lt;
                    </button>
                    <button className="carousel-next" onClick={goToNextSlide}>
                        &gt;
                    </button>
                </div>
                <div class="slider-nav">
                    <div className='slider-nav-dot' style={{ opacity: currentIndex === 0 ? 1 : 0.75, cursor: "pointer" }} onClick={() => setCurrentIndex(0)}></div>
                    <div className='slider-nav-dot' style={{ opacity: currentIndex === 1 ? 1 : 0.75, cursor: "pointer" }} onClick={() => setCurrentIndex(1)}></div>
                    <div className='slider-nav-dot' style={{ opacity: currentIndex === 2 ? 1 : 0.75, cursor: "pointer" }} onClick={() => setCurrentIndex(2)}></div>
                </div>
            </div>
        </>
    );
};

export default Carousel;
