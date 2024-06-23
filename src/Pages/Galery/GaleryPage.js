import React, { useEffect, useState } from "react";
import { ListEvent, YearlyEvent } from "../../constant/YearlyEvent";
import Galery from "./Galery";
import homeScreen from "../../assets/images/homeScreenImage.jpg"
import HeaderTitle from "../../components/atom/HeaderTitle";
import { FontSizeTitle } from "../../constant/FontSizeTitle";
import { Spin } from 'antd';
import { useTranslation } from "react-i18next";
const GaleryPage = () => {
    const { t, i18n } = useTranslation();
    const [selectedEvent, setSelectenEvent] = useState(YearlyEvent.TURNINGPOINT);
    const [isLoading, setIsLoading] = useState(false)

    const handleClickEvent = (eventName) => {
        setIsLoading(true)
        setSelectenEvent(eventName)
    }

    useEffect(() => {
        if (isLoading) {
            setTimeout(() => {
                setIsLoading(false)
            }, 1000);
        }
    }, [isLoading])

    return (
        <div className="primaryBackgroundBlack" style={{ padding: "128px 0px 48px 0px" }}>
            <div className="container">
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
                    <img loading="lazy" src={homeScreen}
                        alt="homeScreen"
                        className='fullScreenImage'
                        style={{ marginTop: 80 }}
                    />
                    <HeaderTitle>
                        THE INITIAL TURNING POINT
                    </HeaderTitle>
                    <HeaderTitle fontSize={FontSizeTitle.small}>
                        {t("underWishnu")}
                    </HeaderTitle>
                    <div className="textColor container">
                        featuring Michaela Sutejo as the main soloist (Pianist), Wishnu Dewanta (Conductor), Vahur Luhtsalu (Cellist), Andreas Arianto (Accordionist) and Amelia Tionanda (Violinist)
                    </div>
                    <div className="container">
                        <Galery isDynamicType={true} />
                    </div>
                </>
            )}
        </div>
    )
}

export default GaleryPage;