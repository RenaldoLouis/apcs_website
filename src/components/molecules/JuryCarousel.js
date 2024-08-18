import React, { useState, useEffect } from 'react';

import jury1noText from "../../assets/images/jurySlider/jury1noText.png"
import jury2noText from "../../assets/images/jurySlider/jury2noText.png"
import jury3noText from "../../assets/images/jurySlider/jury3noText.png"
import jury4noText from "../../assets/images/jurySlider/jury4noText.png"
import jury5noText from "../../assets/images/jurySlider/jury5noText.png"
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useAuth } from '../../context/DataContext';

const images = [
    jury1noText,
    jury2noText,
    jury3noText,
    jury4noText,
    jury5noText,
]

const JuryCarousel = ({ interval = 10000, homePage = true }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const { t, i18n } = useTranslation();
    const theme = useTheme();
    const isTabletAndSmaller = useMediaQuery(theme.breakpoints.down('lg'));
    const [isPaused, setIsPaused] = useState(false);

    const { isMobileAndSmaller } = useAuth();

    const dataJury = [
        {
            firstQuote: `“${t("home7")}”`,
            secondQuote: t("home8"),
            name: "- Firdy Salim -",
            title: "APCS CLASSICAL FESTIVAL 2023 JURIES",
            image: jury1noText
        },
        {
            firstQuote: `“${t("home9")}”`,
            secondQuote: t("home10"),
            name: "- Christine Utomo -",
            title: "APCS CLASSICAL FESTIVAL 2023 JURIES",
            image: jury2noText
        },
        {
            firstQuote: `“${t("home11")}”`,
            secondQuote: t("home12"),
            name: "- Iswargia Sudarno -",
            title: "APCS CLASSICAL FESTIVAL 2023 JURIES",
            image: jury3noText
        },
        {
            firstQuote: `“${t("home13")}”`,
            secondQuote: t("home14"),
            name: "- Michelle Kartika Bahari -",
            title: "APCS CLASSICAL FESTIVAL 2023 JURIES",
            image: jury4noText
        },
        {
            firstQuote: `“${t("home15")}”`,
            secondQuote: t("home16"),
            name: "- Myra Karlina Pranajaya -",
            title: "APCS CLASSICAL FESTIVAL 2023 JURIES",
            image: jury5noText
        },
    ]

    useEffect(() => {
        let intervalId;
        if (!isPaused) {
            intervalId = setInterval(() => {
                setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
            }, interval);
        }

        return () => clearInterval(intervalId);
    }, [interval, isPaused]);

    useEffect(() => {
        setCurrentIndex(0)
    }, [])

    const handleMouseEnter = () => {
        setIsPaused(true);
    };

    const handleMouseLeave = () => {
        setIsPaused(false);
    };

    return (
        <>
            <div className='carouselContainer'
                onMouseDown={handleMouseEnter}
                onMouseUp={handleMouseLeave}
            >
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
                                <div style={{ marginTop: isMobileAndSmaller ? 4 : 24, fontSize: '2vmin' }}>
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
