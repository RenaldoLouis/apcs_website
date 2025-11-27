import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { IconButton } from "@mui/material";
import { logEvent } from "firebase/analytics";
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import banner1 from "../../assets/images/homeBanner/banner1.jpg";
import banner2 from "../../assets/images/homeBanner/banner2.jpg";
import banner3 from "../../assets/images/homeBanner/banner3.jpg";
import banner4 from "../../assets/images/homeBanner/banner4.jpg";
import banner5 from "../../assets/images/homeBanner/banner5.jpg";
import banner6 from "../../assets/images/homeBanner/banner6.jpg";
import banner7 from "../../assets/images/homeBanner/banner7.jpg";
import banner8 from "../../assets/images/homeBanner/banner8.jpg";
import { PathName } from '../../constant/PathName';
import { YearlyEvent } from '../../constant/YearlyEvent';
import { useAuth } from '../../context/DataContext';
import { analytics } from '../../firebase';
import PillButton from '../atom/PillButton';

const images = [
    banner5,
    banner8,
    banner2,
    banner1,
    banner6,
    banner7,
    banner4,
    banner3,
]

const Carousel = ({ interval = 5000, homePage = true }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { setSelectedEvent, selectedEvent } = useAuth()

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        let intervalId;
        if (!isPaused) {
            intervalId = setInterval(() => {
                setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
            }, interval);
        }

        return () => clearInterval(intervalId);
    }, [interval, isPaused]);

    const goToPrevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };

    const goToNextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    };

    const handleClickRegisterNow = () => {
        logEvent(analytics, 'register_now');
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

    const handleMouseDown = () => {
        setIsPaused(true);
    };

    const handleMouseUp = () => {
        setIsPaused(false);
    };

    return (
        <>
            <div className='carouselContainer'
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                {...swipeHandlers}

            >
                {images.map((eachImage, index) => (
                    <img key={`carousel-${index}`} loading="lazy" style={{ '--currentIndex': currentIndex }} className="carousel-image" id={`slide-${index}`} src={eachImage} alt={`photos-${index}`} />
                ))}
                <div className="carousel-navigation">
                    {/* <button className="carousel-prev" onClick={goToPrevSlide}>
                        <img loading="lazy" src={arrowLeftCover} style={{ width: "6vmin" }} alt="arrowLeft" />
                    </button>
                    <button className="carousel-next" onClick={goToNextSlide}>
                        <img loading="lazy" src={arrowRightCover} style={{ width: "6vmin" }} alt="arrowRight" />
                    </button> */}
                    <IconButton
                        aria-label="back"
                        size="small"
                        onClick={goToPrevSlide}
                        sx={{
                            backgroundColor: "rgba(141, 135, 132, 1)",
                            marginLeft: "20px",
                            color: "black",
                            '&:hover': {
                                backgroundColor: "rgba(160, 155, 152, 1)", // slightly lighter on hover
                            },
                            '&:active': {
                                backgroundColor: "rgba(120, 115, 112, 1)", // slightly darker on click
                            },
                        }}
                    >

                        <LeftOutlined />
                    </IconButton>

                    <IconButton
                        aria-label="forward"
                        size="small"
                        sx={{
                            backgroundColor: "rgba(141, 135, 132, 1)",
                            marginRight: "20px",
                            color: "black",
                            '&:hover': {
                                backgroundColor: "rgba(160, 155, 152, 1)",
                            },
                            '&:active': {
                                backgroundColor: "rgba(120, 115, 112, 1)",
                            },
                        }}
                        onClick={goToNextSlide}
                    >
                        <RightOutlined />
                    </IconButton>
                </div>
                <div className='titleCoverContainer-Banner'>
                    <div style={{ '--currentIndex': currentIndex, marginTop: 36 }} className='titleCoverContainerText'>
                        <div>
                            <PillButton onClick={() => handleMovePage(PathName.contactUs, YearlyEvent.TURNINGPOINT)} text={t("moreInfo")} />
                        </div>
                    </div>
                    <div style={{ '--currentIndex': currentIndex, marginTop: 180 }} className='titleCoverContainerText'>
                        <div>
                            <PillButton onClick={() => handleMovePage(PathName.gallery, YearlyEvent.APCSTHESOUNDOFASIA2025)} text={t("moreInfo")} />
                        </div>
                    </div>
                    <div style={{ '--currentIndex': currentIndex, marginTop: 36 }} className='titleCoverContainerText'>
                        <div>
                            <PillButton onClick={() => handleMovePage(PathName.gallery, YearlyEvent.CLASSICALFESTIVALJKT2024)} text={t("watchNow")} />
                        </div>
                    </div>
                    <div style={{ '--currentIndex': currentIndex, marginTop: 36 }} className='titleCoverContainerText'>
                        <div>
                            <PillButton onClick={() => handleMovePage(PathName.gallery, YearlyEvent.CHRISTMASWONDERLAND)} text={t("watchNow")} />
                        </div>
                    </div>
                    <div style={{ '--currentIndex': currentIndex, marginTop: 36 }} className='titleCoverContainerText'>
                        <div>
                            <PillButton onClick={() => handleMovePage(PathName.gallery, YearlyEvent.CLASSICALFESTIVALJKT)} text={t("watchNow")} />
                        </div>
                    </div>
                    <div style={{ '--currentIndex': currentIndex, marginTop: 36 }} className='titleCoverContainerText'>
                        <div>
                            <PillButton onClick={() => handleMovePage(PathName.gallery, YearlyEvent.CLASSICALFESTIVALSBY)} text={t("watchNow")} />
                        </div>
                    </div>
                    <div style={{ '--currentIndex': currentIndex, marginTop: 36 }} className='titleCoverContainerText'>
                        <div>
                            <PillButton onClick={() => handleMovePage(PathName.gallery, YearlyEvent.MAGICALMUSICSOUNDTRACT)} text={t("watchNow")} />
                        </div>
                    </div>
                    <div style={{ '--currentIndex': currentIndex, marginTop: 36 }} className='titleCoverContainerText'>
                        <div>
                            <PillButton onClick={() => handleMovePage(PathName.gallery, YearlyEvent.MASTERCLASS)} text={t("watchNow")} />
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
