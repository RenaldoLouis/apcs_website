import React, { useState, useEffect } from 'react';
import arrowRightCover from "../../assets/icons/arrowRightCover.png"
import arrowLeftCover from "../../assets/icons/arrowLeftCover.png"
import PillButton from '../atom/PillButton';
import coverImage1 from "../../assets/images/coverImage1.png"
import banner1 from "../../assets/images/homeBanner/banner1.jpg"
import banner2 from "../../assets/images/homeBanner/banner2.jpg"
import banner3 from "../../assets/images/homeBanner/banner3.jpg"
import banner4 from "../../assets/images/homeBanner/banner4.jpg"
import banner5 from "../../assets/images/homeBanner/banner5.jpg"
import banner6 from "../../assets/images/homeBanner/banner6.jpg"
import banner7 from "../../assets/images/homeBanner/banner7.jpg"
import { logEvent } from "firebase/analytics";
import { analytics } from '../../firebase';
import Button from '@mui/material/Button';
import zIndex from '@mui/material/styles/zIndex';
import { PathName } from '../../constant/PathName';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/DataContext';
import { YearlyEvent } from '../../constant/YearlyEvent';
import { useSwipeable } from 'react-swipeable';

const images = [
    banner2,
    banner5,
    banner1,
    banner6,
    banner7,
    banner4,
    banner3,
]

const Carousel = ({ interval = 5000, homePage = true }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();
    const { setSelectedEvent, selectedEvent } = useAuth()

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

    const handleDirectToWhatsApp = () => {
        window.open("https://api.whatsapp.com/send/?phone=6282213002686", '_blank');
    }

    const handleMovePage = (path, event) => {
        setSelectedEvent(event)
        navigate(path);
        window.scrollTo(0, 0);
    }

    const swipeHandlers = useSwipeable({
        onSwipedLeft: () => goToNextSlide(),
        onSwipedRight: () => goToPrevSlide(),
        swipeDuration: 500,
        preventDefaultTouchmoveEvent: true,
        trackMouse: true
    });

    return (
        <>
            <div className='carouselContainer' {...swipeHandlers}>
                {images.map((eachImage, index) => (
                    <img loading="lazy" style={{ '--currentIndex': currentIndex }} className="carousel-image" id={`slide-${index}`} src={eachImage} alt={`photos-${index}`} />
                ))}
                <div className="carousel-navigation">
                    <button className="carousel-prev" onClick={goToPrevSlide}>
                        <img loading="lazy" src={arrowLeftCover} style={{ width: "6vmin" }} alt="arrowLeft" />
                    </button>
                    <button className="carousel-next" onClick={goToNextSlide}>
                        <img loading="lazy" src={arrowRightCover} style={{ width: "6vmin" }} alt="arrowRight" />
                    </button>
                </div>
                <div className='titleCoverContainer-Banner'>
                    <div style={{ '--currentIndex': currentIndex }} className='titleCoverContainerText'>
                        <div>
                            <Button variant="outlined" sx={{ zIndex: 10 }} onClick={() => handleMovePage(PathName.gallery, YearlyEvent.CHRISTMASWONDERLAND)}>Watch Now</Button>
                        </div>
                    </div>
                    <div style={{ '--currentIndex': currentIndex }} className='titleCoverContainerText'>
                        <div>
                            <Button variant="outlined" sx={{ zIndex: 10 }} onClick={handleDirectToWhatsApp}>More Info</Button>
                        </div>
                    </div>
                    <div style={{ '--currentIndex': currentIndex }} className='titleCoverContainerText'>
                        <div>
                            <Button variant="outlined" sx={{ zIndex: 10 }} onClick={handleDirectToWhatsApp}>More Info</Button>
                        </div>
                    </div>
                    <div style={{ '--currentIndex': currentIndex }} className='titleCoverContainerText'>
                        <div>
                            <Button variant="outlined" sx={{ zIndex: 10 }} onClick={() => handleMovePage(PathName.gallery, YearlyEvent.MAGICALMUSICSOUNDTRACT)}>Watch Now</Button>
                        </div>
                    </div>
                    <div style={{ '--currentIndex': currentIndex }} className='titleCoverContainerText'>
                        <div>
                            <Button variant="outlined" sx={{ zIndex: 10 }} disabled>Coming Soon</Button>
                        </div>
                    </div>
                    <div style={{ '--currentIndex': currentIndex }} className='titleCoverContainerText'>
                        <div>
                            <Button variant="outlined" sx={{ zIndex: 10 }} onClick={() => handleMovePage(PathName.gallery, YearlyEvent.CLASSICALFESTIVALJKT)}>Watch Now</Button>
                        </div>
                    </div>
                    <div style={{ '--currentIndex': currentIndex }} className='titleCoverContainerText'>
                        <div>
                            <Button variant="outlined" sx={{ zIndex: 10 }} onClick={() => handleMovePage(PathName.gallery, YearlyEvent.CLASSICALFESTIVALSBY)}>Watch Now</Button>
                        </div>
                    </div>
                </div>

                {homePage ? (
                    <div className={"slider-nav"}>
                        {/* <div className='slider-nav-dot' style={{ opacity: currentIndex === 0 ? 1 : 0.75, cursor: "pointer" }} onClick={() => setCurrentIndex(0)}></div>
                        <div className='slider-nav-dot' style={{ opacity: currentIndex === 1 ? 1 : 0.75, cursor: "pointer" }} onClick={() => setCurrentIndex(1)}></div>
                        <div className='slider-nav-dot' style={{ opacity: currentIndex === 2 ? 1 : 0.75, cursor: "pointer" }} onClick={() => setCurrentIndex(2)}></div>
                        <div className='slider-nav-dot' style={{ opacity: currentIndex === 3 ? 1 : 0.75, cursor: "pointer" }} onClick={() => setCurrentIndex(3)}></div>
                        <div className='slider-nav-dot' style={{ opacity: currentIndex === 4 ? 1 : 0.75, cursor: "pointer" }} onClick={() => setCurrentIndex(4)}></div>
                        <div className='slider-nav-dot' style={{ opacity: currentIndex === 5 ? 1 : 0.75, cursor: "pointer" }} onClick={() => setCurrentIndex(5)}></div>
                        <div className='slider-nav-dot' style={{ opacity: currentIndex === 6 ? 1 : 0.75, cursor: "pointer" }} onClick={() => setCurrentIndex(6)}></div> */}
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
                        {/* <PillButton text={"Register Now"} /> */}
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
