import React, { useState } from "react";
import Carousel from "../../components/molecules/CarouselCustom";
import { ListEvent, YearlyEvent } from "../../constant/YearlyEvent";
import Galery from "./Galery";
import PillButton from "../../components/atom/PillButton";
import Pagination from "../../components/molecules/Pagination";
import homeScreen from "../../assets/images/homeScreenImage.svg"
import HeaderTitle from "../../components/atom/HeaderTitle";
import { FontSizeTitle } from "../../constant/FontSizeTitle";

const GaleryPage = () => {

    const [selectedEvent, setSelectenEvent] = useState(YearlyEvent.GHIBLI);

    const handleClickEvent = (eventName) => {
        setSelectenEvent(eventName)
    }

    return (
        <div className="primaryBackgroundBlack" style={{ padding: "128px 0px 48px 0px" }}>
            <div className="container">
                <div className="row">
                    <div className="col-sm">
                        <div className="color-white">
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
                                    className={`itemMenuSelected ${selectedEvent === eachEvent.title ? 'selected' : ''}`}>
                                    <div>
                                        {eachEvent.year}
                                    </div>
                                    <div>
                                        {eachEvent.title}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            <img src={homeScreen}
                alt="homeScreen"
                className='fullScreenImage'
                style={{ marginTop: 80 }}
            />
            <HeaderTitle>
                THE INITIAL TURNING POINT
            </HeaderTitle>
            <HeaderTitle fontSize={FontSizeTitle.small}>
                UNDER THE BATON OF WISHNU DEWANTA
            </HeaderTitle>
            <div className="textColor container">
                featuring Michaela Sutejo as the main soloist (Pianist), Wishnu Dewanta (Conductor), Vahur Luhtsalu (Cellist), Andreas Arianto (Accordionist) and Amelia Tionanda (Violinist)
            </div>
            <div className="container">
                <Galery isDynamicType={true} />
            </div>

            <Pagination />
        </div>
    )
}

export default GaleryPage;