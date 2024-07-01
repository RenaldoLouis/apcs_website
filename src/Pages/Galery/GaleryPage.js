import React, { useCallback, useEffect, useState } from "react";
import { ListEvent, YearlyEvent } from "../../constant/YearlyEvent";
import Galery from "./Galery";
import homeScreen from "../../assets/images/homeScreenImage.jpg"
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

const GaleryPage = () => {
    const { t, i18n } = useTranslation();
    const [selectedEvent, setSelectenEvent] = useState(YearlyEvent.TURNINGPOINT);
    const [isLoading, setIsLoading] = useState(false)
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
                    name: "Michaela Sutejo as the main soloist",
                    role: "Pianist"
                },
                {
                    name: "Wishnu",
                    role: "conductor"
                }
            ],
            images: TurningPointImages
        },
        {
            name: YearlyEvent.AUTUMINKOREA,
            video: null,
            title: "천고마비 - THE PANDEMIC ERA",
            subTitle: "UNDER THE BATON OF CHIKITA AMANDA",
            featuring: [
                {
                    name: "Michaela Sutejo as the main soloist",
                    role: "Pianist"
                },
                {
                    name: "Chikita Amanda",
                    role: "conductor"
                }
            ],
            images: AutumnInKoreaImages
        },
        {
            name: YearlyEvent.MAGICALMUSICSOUNDTRACT,
            video: null,
            title: "The First National Orchestra Series for all generations",
            subTitle: "UNDER THE BATON OF CHIKITA AMANDA",
            featuring: [
                {
                    name: "Michaela Sutejo as the main soloist",
                    role: "Pianist"
                },
                {
                    name: "Chikita Amanda",
                    role: "conductor"
                }
            ],
            images: MagicalMusicSoundtractImages
        },
        {
            name: YearlyEvent.CLASSICALFESTIVALSBY,
            video: null,
            title: "THE FIRST NATIONAL CLASSICAL SERIES FOR ALL GENERATIONS, SHANGRI-LA",
            subTitle: "UNDER THE BATON OF CHIKITA AMANDA",
            featuring: [
                {
                    name: "Michaela Sutejo as the main soloist",
                    role: "Pianist"
                },
                {
                    name: "Chikita Amanda",
                    role: "conductor"
                }
            ],
            images: ClassicalFestivalSurabayaImages
        },
        {
            name: YearlyEvent.CLASSICALFESTIVALJKT,
            video: null,
            title: "THE SECOND NATIONAL CLASSICAL SERIES FOR ALL GENERATIONS, SOEHANNA HALL",
            subTitle: "",
            featuring: [
                {
                    name: "Michaela Sutejo as the main soloist",
                    role: "Pianist"
                },
                {
                    name: "Chikita Amanda",
                    role: "conductor"
                }
            ],
            images: ClassicalFestivalJakartaImages
        },
        {
            name: YearlyEvent.CHRISTMASWONDERLAND,
            video: null,
            title: "APCS CHRISTMAS WONDERLAND",
            subTitle: "UNDER THE BATON OF CHIKITA AMANDA",
            featuring: [
                {
                    name: "Michaela Sutejo as the main soloist",
                    role: "Pianist"
                },
                {
                    name: "Chikita Amanda",
                    role: "conductor"
                }
            ],
            images: ChristmasInWonderlandImages
        },
    ])

    useEffect(() => {
        fetchPost()
    }, [])

    const fetchPost = useCallback(async () => {
        setIsLoading(true)
        const q = query(collection(db, "videos"), orderBy("order"));

        await getDocs(q)
            .then((querySnapshot) => {
                if (querySnapshot) {
                    const newData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
                    setVideoList(newData)

                }
            })
            .catch((error) => {
                console.error("Error getting documents: ", error);
            });
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
        let tempData = ListGaleryContent.filter((data) => data.name === selectedEvent)
        setGaleryContent(tempData[0])
        setIsLoading(false)
    }, [selectedEvent])


    const handleClickEvent = (eventName) => {
        setIsLoading(true)
        setSelectenEvent(eventName)
    }

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
                <div class="row" style={{ color: "white" }}>
                    {ListEvent.map((eachEvent) => {
                        return (
                            <div className="col-sm" >
                                <div onClick={() => handleClickEvent(eachEvent.title)}
                                    className={`itemMenuSelected special-case ${selectedEvent === eachEvent.title ? 'selected textColorSelected' : ''}`}>
                                    <div className="mangolaineFont" style={{ fontSize: 16 }}>
                                        {eachEvent.year}
                                    </div>
                                    <div className={`nowrap ${selectedEvent === eachEvent.title ? "mosafinFont" : "mangolaineFont"}`} style={{ fontSize: 18 }}>
                                        {eachEvent.title}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            {isLoading ? (
                <div className="loadingContainer">
                    <Spin tip="Loading" size="large" />
                </div>
            ) : (
                <>
                    <div style={{ marginTop: 64, marginBottom: 100 }}>
                        <CoverVideo video={galeryContent.video} />
                    </div>
                    <HeaderTitle>
                        {galeryContent.title}
                    </HeaderTitle>
                    <HeaderTitle fontSize={FontSizeTitle.small}>
                        {galeryContent.subTitle}
                    </HeaderTitle>

                    <div class="container">
                        <div class="row">
                            <div class="col-xs-12 col-lg-5 mx-auto d-flex flex-column justify-content-center align-items-center">
                                <div className="textColor mt-5 mb-5">
                                    featuring
                                </div>
                                <div className="textColor text-align-center mb-5">
                                    Michaela Sutejo as the main soloist (Pianist), Wishnu Dewanta (Conductor), Vahur Luhtsalu (Cellist), Andreas Arianto (Accordionist) and Amelia Tionanda (Violinist)
                                </div>
                            </div>
                        </div>
                        <Galery images={galeryContent.images} isDynamicType={true} />
                    </div>
                </>
            )}
        </div>
    )
}

export default GaleryPage;