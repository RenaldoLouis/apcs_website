import React, { useCallback, useEffect, useRef, useState } from "react";
import { ListEvent, YearlyEvent } from "../../constant/YearlyEvent";
import Galery from "./Galery";
import homeScreen from "../../assets/images/homeScreenImage.jpg"
import arrowMoreGalery from "../../assets/images/arrowMoreGalery.PNG"
import HeaderTitle from "../../components/atom/HeaderTitle";
import { FontSizeTitle } from "../../constant/FontSizeTitle";
import { Spin } from 'antd';
import { useTranslation } from "react-i18next";
import CoverVideo from "../../components/molecules/CoverVideo";
import { collection, getDocs, limit, query, startAfter, orderBy } from "firebase/firestore";
import { db } from '../../firebase';

import { TurningPointImages } from "../../constant/TurningPointImages";
import { AutumnInKoreaImages } from "../../constant/AutumnInKoreaImages";
import { MagicalMusicSoundtractImages } from "../../constant/MagicalMusicSoundtract";
import { ClassicalFestivalSurabayaImages } from "../../constant/ClassicalFestivalSurabayaImages";
import { ClassicalFestivalJakartaImages } from "../../constant/ClassicalFestivalJakarta";
import { ChristmasInWonderlandImages } from "../../constant/ChristmasWonderlandImages";
import { MasterClassImages } from "../../constant/MasterClassImages";
import { useAuth } from "../../context/DataContext";
import { useSwipeable } from 'react-swipeable';
import Typograhpy from "../../components/atom/Typograhpy";
import { FestivalJkt2024 } from "../../constant/FestivalJkt2024";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import apis from "../../apis";


const GaleryPage = () => {
    const { t, i18n } = useTranslation();
    const { setSelectedEvent, selectedEvent } = useAuth()
    const scrollContainerRef = useRef(null);
    const { isMobileAndSmaller } = useAuth();

    const [isLoading, setIsLoading] = useState(true)
    const [isLoadingPictures, setIsLoadingPictures] = useState(true)
    const [galeryContent, setGaleryContent] = useState({})
    const [videoList, setVideoList] = useState([])
    const [ListGaleryContent, setListGaleryContent] = useState([
        {
            name: YearlyEvent.TURNINGPOINT,
            video: null,
            title: "THE INITIAL TURNING POINTS",
            subTitle: "UNDER THE BATON OF WISHNU DEWANTA",
            featuring: [
                {
                    name: "Michaela Sutejo",
                    title: "main soloist",
                    role: "Pianist",
                    founder: true
                },
                {
                    name: "Wishnu Dewanta",
                    role: "Conductor"
                },
                {
                    name: "Vahur Luhtsalu",
                    role: "Cellist"
                },
                {
                    name: "Andreas Arianto",
                    role: "Accordionist"
                },
                {
                    name: "Amelia Tionanda",
                    role: "Violinist"
                },
            ],
            images: TurningPointImages
        },
        {
            name: YearlyEvent.AUTUMINKOREA,
            video: null,
            title: "천고마비 - FIND THE RHYTHM IN QUARANTINE",
            subTitle: "UNDER THE BATON OF CHIKITA AMANDA",
            featuring: [
                {
                    name: "Michaela Sutejo",
                    title: "main soloist",
                    role: "Pianist",
                    founder: true
                },
                {
                    name: "Chikita Amanda",
                    role: "Conductor"
                },
                {
                    name: "Nathania Jualim",
                    role: "Guitarist"
                },
                {
                    name: "Michelle Hendra / Michimomo",
                    role: "Singer"
                },
                {
                    name: "Park Keun Woo",
                    role: "Singer"
                },
            ],
            images: AutumnInKoreaImages
        },
        {
            name: YearlyEvent.MAGICALMUSICSOUNDTRACT,
            video: null,
            title: "THE FIRST NATIONAL ORCHESTRA SERIES FOR ALL GENERATIONS",
            subTitle: "UNDER THE BATON OF CHIKITA AMANDA",
            featuring: [
                {
                    name: "Michaela Sutejo",
                    // title: "guest artist",
                    role: "Pianist",
                    // founder: true
                },
                {
                    name: "Filda Salim",
                    role: "Pianist"
                },
                {
                    name: "Stephanie Jingga",
                    role: "Pianist"
                },
                {
                    name: "Chikita Amanda",
                    role: "Conductor",
                    achivement: "APCS 2021 & 2022"
                },
            ],
            images: MagicalMusicSoundtractImages
        },
        {
            name: YearlyEvent.CLASSICALFESTIVALSBY,
            video: null,
            title: "THE FIRST NATIONAL CLASSICAL SERIES FOR ALL GENERATIONS",
            subTitle: "SHANGRI-LA Surabaya",
            featuring: [
                // {
                //     name: "Michaela Sutejo",
                //     title: "main soloist",
                //     role: "Pianist",
                //     founder: true
                // },
                {
                    name: "Firdy Salim",
                    role: "Pianist"
                },
                {
                    name: "Christine Utomo",
                    role: "Pianist"
                },
                {
                    name: "Iswargia Sudarno",
                    role: "Pianist"
                },
                {
                    name: "Myra Karlina Pranajaya",
                    role: "Pianist"
                },
                {
                    name: "Michelle Kartika Bahari",
                    role: "Pianist",
                    // title: "guest artist",
                    achivement: " APCS Classical Festival 2023"
                },
            ],
            images: ClassicalFestivalSurabayaImages
        },
        {
            name: YearlyEvent.CLASSICALFESTIVALJKT,
            video: null,
            title: "THE SECOND NATIONAL CLASSICAL SERIES FOR ALL GENERATIONS",
            subTitle: "SOEHANNA HALL Jakarta",
            featuring: [
                // {
                //     name: "Michaela Sutejo",
                //     title: "main soloist",
                //     role: "Pianist",
                //     founder: true
                // },
                {
                    name: "Firdy Salim",
                    role: "Pianist"
                },
                {
                    name: "Christine Utomo",
                    role: "Pianist"
                },
                {
                    name: "Iswargia Sudarno",
                    role: "Pianist",
                    // title: "guest artist",
                    achivement: " APCS Classical Festival 2023"

                },
            ],
            images: ClassicalFestivalJakartaImages
        },
        {
            name: YearlyEvent.CHRISTMASWONDERLAND,
            video: null,
            title: "THE SECOND NATIONAL ORCHESTRA SERIES FOR ALL GENERATIONS",
            subTitle: "UNDER THE BATON OF CHIKITA AMANDA",
            featuring: [
                {
                    name: "Michaela Sutejo",
                    // title: "guest artist",
                    role: "Pianist",
                    // founder: true
                },
                // {
                //     name: "Stephanie Jingga",
                //     role: "Pianist"
                // },
                {
                    name: "Ify Alyssa",
                    role: "Singer - Pianist"
                },
                {
                    name: "Stephanie Jingga",
                    role: "Pianist"
                },
                {
                    name: "Chikita Amanda",
                    role: "Conductor",
                    achivement: "APCS 2022 & 2023"
                },
            ],
            images: ChristmasInWonderlandImages
        },
        {
            name: YearlyEvent.MASTERCLASS,
            video: null,
            title: "MASTERCLASS",
            subTitle: "Surabaya & Jakarta",
            featuring: [
                {
                    name: "Firdy Salim",
                    role: "Guest Coach"
                },
                {
                    name: "Myra Karlina Pranajaya",
                    role: "Guest Coach"
                },
                {
                    name: "Christine Utomo",
                    role: "Guest Coach"
                },
                {
                    name: "Iswargia Sudarno",
                    role: "Guest Coach"
                },
            ],
            images: MasterClassImages
        },
        {
            name: YearlyEvent.CLASSICALFESTIVALJKT2024,
            video: null,
            title: "THE THIRD NATIONAL CLASSICAL SERIES FOR ALL GENERATIONS ",
            subTitle: "SALIHARA HALL, Jakarta",
            featuring: [
                {
                    name: "Firdy Salim",
                    role: "Pianist"
                },
                {
                    name: "Piano Duo Winner of APCS Cassical Festival Jakarta 2023 & Winners of APCS Classical Festival Jakarta 2024",
                    // role: "Guest Coach"
                },
                // {
                //     name: "Christine Utomo",
                //     role: "Guest Coach"
                // },
                // {
                //     name: "Iswargia Sudarno",
                //     role: "Guest Coach"
                // },
            ],
            images: FestivalJkt2024
        },
    ])

    useEffect(() => {
        fetchVideos()
    }, [])

    useEffect(() => {
        fetchGalery()
    }, [selectedEvent])

    const fetchGalery = () => {
        setIsLoadingPictures(true)
        const normalizedName = selectedEvent.replace(/\s+/g, '').toLowerCase()
        apis.galery.getGalery(normalizedName).then((res) => {
            if (res.status === 200) {
                // console.log("res", res)
            }
            setIsLoadingPictures(false)
        })
    }

    const fetchVideos = useCallback(async () => {
        setIsLoading(true)
        apis.galery.getVideos().then((res) => {
            if (res.status === 200) {
                setVideoList(res.data)
            }
            setIsLoading(false)
        })
    }, [])

    useEffect(() => {
        if (videoList.length > 0) {
            // Create a lookup table from the videoLinks array
            const videoLookup = videoList.reduce((acc, item) => {
                const normalizedName = item.name.replace(/\s+/g, '').toLowerCase();
                acc[normalizedName] = item.video;
                return acc;
            }, {});

            // Update the events array with the video links
            const updatedEvents = ListGaleryContent.map(event => {
                const normalizedName = event.name.replace(/\s+/g, '').toLowerCase();
                if (videoLookup[normalizedName]) {
                    event.video = videoLookup[normalizedName];
                }
                return event;
            });
            setListGaleryContent(updatedEvents)
            setIsLoading(false)
        }
        setIsLoading(false)
    }, [videoList])

    useEffect(() => {
        setIsLoading(true)
        const element = document.getElementById(selectedEvent);

        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        let tempData = ListGaleryContent.filter((data) => data.name === selectedEvent)
        setGaleryContent(tempData[0])
        setIsLoading(false)
    }, [ListGaleryContent, selectedEvent])


    const handleClickEvent = (eventName) => {
        setSelectedEvent(eventName)
    }

    const smoothScroll = (element, targetPosition, duration) => {
        const startPosition = element.scrollLeft;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            element.scrollLeft = run;
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    }

    const handleScrollEvents = (scrollAmount) => {
        if (scrollContainerRef.current) {
            const targetPosition = scrollContainerRef.current.scrollLeft + scrollAmount;
            smoothScroll(scrollContainerRef.current, targetPosition, 300);
        }
    };

    const handlers = useSwipeable({
        onSwipedLeft: () => handleScrollEvents(100),
        onSwipedRight: () => handleScrollEvents(-100),
        preventDefaultTouchmoveEvent: true,
        trackMouse: true
    });

    return (
        <div className="primaryBackgroundBlack" style={{ padding: "128px 0px 48px 0px" }}>
            <div className="container" style={{ marginBottom: 30 }}>
                <div className="row">
                    <div className="col-sm">
                        <div className="color-white mangolaineFont">
                            YEAR
                        </div>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className={`row ${isMobileAndSmaller ? "" : "justify-content-center"}`}>
                    <div className="col-1 align-self-center cursorPointer" onClick={() => handleScrollEvents(-100)} style={{ width: "5%", marginRight: 20 }}>
                        <img src={arrowMoreGalery} alt="arrowMoreGalery" style={{ width: 32, rotate: "180deg" }} />
                    </div>

                    <div
                        {...handlers}
                        className="scrollable-container col-md-10 col-9 "
                        style={{ padding: 0 }}
                        ref={scrollContainerRef}
                    >
                        <div
                            className="scrollable-content">
                            {ListEvent.map((eachEvent) => (
                                <div id={eachEvent?.title} className="col-auto" key={eachEvent?.title} style={{ color: "white" }}>
                                    <div
                                        onClick={() => handleClickEvent(eachEvent?.title)}
                                        className={`itemMenuSelected special-case ${selectedEvent === eachEvent?.title ? 'selected textColorSelected' : ''}`}
                                    >
                                        <div className="mangolaineFont" style={{ fontSize: 16 }}>
                                            {eachEvent?.year}
                                        </div>
                                        <div
                                            className={`nowrap ${selectedEvent === eachEvent?.title ? "mosafinFont" : "mangolaineFont"}`}
                                            style={{ fontSize: 18 }}
                                        >
                                            {eachEvent?.title}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="col-2 col-md-1 align-self-center cursorPointer" onClick={() => handleScrollEvents(100)} style={{ width: "5%" }}>
                        <img src={arrowMoreGalery} alt="arrowMoreGalery" style={{ width: 32 }} />
                    </div>
                </div>
            </div>
            {isLoading ? (
                <div className="loadingContainer">
                    <Spin tip="Loading" size="large" />
                </div>
            ) : (
                <>
                    {galeryContent?.video && (
                        <div className="container" style={{ marginTop: 64 }}>
                            <div className="row">
                                <div className="col">
                                    <CoverVideo video={galeryContent?.video} />
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="container" style={{ marginTop: 100 }}>
                        <HeaderTitle>
                            {galeryContent?.title}
                        </HeaderTitle>
                    </div>
                    <HeaderTitle fontSize={FontSizeTitle.small}>
                        <span className="">{galeryContent?.subTitle}</span>
                    </HeaderTitle>

                    <div className="container">
                        <div className="row">
                            <div className={galeryContent?.name === YearlyEvent.CLASSICALFESTIVALSBY ? "col-lg-9 mx-auto d-flex flex-column justify-content-center align-items-center" : "col-lg-6 mx-auto d-flex flex-column justify-content-center align-items-center"}>
                                <div className="italicText textColor mt-4 mb-4">
                                    <Typograhpy
                                        text={"featuring"}
                                    />
                                </div>
                                <div className="textColor text-align-center mb-5">
                                    {galeryContent?.featuring?.map((eachFeature, index) => (
                                        <React.Fragment key={index}>
                                            {index > 0 && " • "}
                                            <span className="feature-name">
                                                <span className="feature-name fontSizeBody">{eachFeature?.name} {eachFeature?.founder && (<span className="italicText"> (Founder) </span>)}</span>{" "}
                                                <span className="italicText fontSizeBody">
                                                    {eachFeature?.title && (`as the ${eachFeature?.title}`)} {eachFeature?.role ? `(${eachFeature?.role})` : ""} {eachFeature?.achivement && (` and Winners of ${eachFeature?.achivement}`)}
                                                </span>
                                            </span>
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        </div>
                        {isLoadingPictures ? (
                            <div className="loadingContainer">
                                <Spin tip="Loading" size="large" />
                            </div>
                        ) : (
                            <Galery name={galeryContent?.name} images={galeryContent?.images} isDynamicType={true} />
                        )}

                    </div>
                </>
            )}
        </div>
    )
}

export default GaleryPage;