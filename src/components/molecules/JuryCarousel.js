import React, { useState, useEffect } from 'react';
import arrowRightCover from "../../assets/icons/arrowRightCover.png"
import arrowLeftCover from "../../assets/icons/arrowLeftCover.png"
import PillButton from '../atom/PillButton';
import coverImage1 from "../../assets/images/coverImage1.png"
import { logEvent } from "firebase/analytics";
import { analytics } from '../../firebase';

import jury1noText from "../../assets/images/jurySlider/jury1noText.png"
import jury2noText from "../../assets/images/jurySlider/jury2noText.png"
import jury3noText from "../../assets/images/jurySlider/jury3noText.png"
import { useTranslation } from 'react-i18next';

const images = [
    jury1noText,
    jury2noText,
    jury3noText,
]

const JuryCarousel = ({ interval = 5000, homePage = true }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const { t, i18n } = useTranslation();


    const dataJury = [
        {
            firstQuote: t("theseAreNotJustYoung"),
            secondQuote: t("withSuchStrong"),
            name: "- Firdy Salim -",
            title: "jury & conductor",
            image: jury1noText
        },
        {
            firstQuote: t("theseAreNotJustYoung"),
            secondQuote: t("withSuchStrong"),
            name: "- Firdy Salim -",
            title: "jury & conductor",
            image: jury2noText
        },
        {
            firstQuote: t("theseAreNotJustYoung"),
            secondQuote: t("withSuchStrong"),
            name: "- Firdy Salim -",
            title: "jury & conductor",
            image: jury3noText
        },
    ]

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
                {dataJury.map((eachData, index) => (
                    <img loading="lazy" style={{ '--currentIndex': currentIndex }} className="carousel-image" id={`slide-${index}`} src={eachData.image} alt={`photos-${index}`} />
                ))}
                <div className='titleCoverContainer'>
                    {dataJury.map((eachData, index) => (
                        <div style={{ '--currentIndex': currentIndex }} className='titleCoverContainerText'>
                            <div className="testimonyContainer" style={{ color: 'white', textAlign: "center" }}>
                                <div className="mangolaineFont" style={{ color: "#FFD990", fontSize: 36 }}>
                                    {eachData.firstQuote}
                                </div>
                                <div style={{ fontSize: 20, marginTop: 40 }}>
                                    {eachData.secondQuote}
                                </div>
                                <div style={{ marginTop: 24 }}>
                                    {eachData.name}
                                    <div>
                                        {eachData.title}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {/* <div style={{ '--currentIndex': currentIndex }} className='titleCoverContainerText'>
                        <div>
                            asd
                        </div>
                    </div>
                    <div style={{ '--currentIndex': currentIndex }} className='titleCoverContainerText'>
                        <div>
                            asd
                        </div>
                    </div>
                    <div style={{ '--currentIndex': currentIndex }} className='titleCoverContainerText'>
                        <div>
                            asd
                        </div>
                    </div> */}
                </div>
            </div>
        </>
    );
};

export default JuryCarousel;