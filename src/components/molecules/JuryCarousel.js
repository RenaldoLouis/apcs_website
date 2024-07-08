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
import jury4noText from "../../assets/images/jurySlider/jury4noText.png"
import jury5noText from "../../assets/images/jurySlider/jury5noText.png"
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const images = [
    jury1noText,
    jury2noText,
    jury3noText,
    jury4noText,
    jury5noText,
]

const JuryCarousel = ({ interval = 5000, homePage = true }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const { t, i18n } = useTranslation();
    const theme = useTheme();
    const isTabletAndSmaller = useMediaQuery(theme.breakpoints.down('lg'));

    const dataJury = [
        {
            firstQuote: t("theseAreNotJustYoung"),
            secondQuote: t("withSuchStrong"),
            name: "- Firdy Salim -",
            title: "Jury & Conductor",
            image: jury1noText
        },
        {
            firstQuote: t("christineQuote"),
            secondQuote: t("christineExp"),
            name: "- Christine Utomo -",
            title: "APCS CLASSICAL FESTIVAL 2023 JURIES",
            image: jury2noText
        },
        {
            firstQuote: t("iswargiaQuote"),
            secondQuote: t("iswargiaExp"),
            name: "- Iswargia Sudarno -",
            title: "APCS CLASSICAL FESTIVAL 2023 JURIES",
            image: jury3noText
        },
        {
            firstQuote: t("michelleQuote"),
            secondQuote: t("michelleExp"),
            name: "- Michelle Kartika Bahari -",
            title: "APCS CLASSICAL FESTIVAL 2023 JURIES",
            image: jury4noText
        },
        {
            firstQuote: t("myraQuote"),
            secondQuote: t("myraExp"),
            name: "- Myra Karlina Pranajaya -",
            title: "APCS CLASSICAL FESTIVAL 2023 JURIES",
            image: jury5noText
        },
    ]

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
        }, interval);

        return () => clearInterval(intervalId);
    }, [interval]);

    useEffect(() => {
        setCurrentIndex(0)
    }, [])

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
                                <div className="mangolaineFont" style={{ color: "#FFD990", fontSize: isTabletAndSmaller ? "3vmin" : 36 }}>
                                    {eachData.firstQuote}
                                </div>
                                {!isTabletAndSmaller && (
                                    <div style={{ fontSize: 20, marginTop: 40 }}>
                                        {eachData.secondQuote}
                                    </div>
                                )}
                                <div style={{ marginTop: 24, fontSize: '2vmin' }}>
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
