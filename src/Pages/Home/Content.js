import React, { useState } from "react";
import CoverImage from "../../components/molecules/CoverImage";
import CardHover from "../../components/molecules/CardHover";
import PeopleReviews from "./PeopleReviews";
import Galery from "../Galery/Galery";
import PillButton from "../../components/atom/PillButton";
import goldenLine from "../../assets/images/goldenLine.png"
import Carousel from "../../components/molecules/CarouselCustom";

const Content = (props) => {
    const { audio } = props

    const [selectedYear, setSelectedYear] = useState(2019);

    const handleClickChangeYear = (year) => {
        setSelectedYear(year)
    }

    return (
        <div>
            <Carousel />
            <div className="homeContentContainer">
                <div className="container">
                    <div className="row justify-center">
                        <div className="col-md-auto ">
                            <img src={goldenLine} alt={`goldenLine`} style={{ width: "100%" }} />
                        </div>
                    </div>
                    <div className="row justify-center">
                        <div className="col-md-auto">
                            <div style={{ color: "white" }}>
                                LOREM IPSUM DOLOR SI AMET TARA
                            </div>
                        </div>
                    </div>
                    <div className="row justify-center">
                        <div className="col-md-auto">
                            <div style={{ color: "white" }}>
                                Lorem ipsum dolor  sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt  ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud  exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum  dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non  proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </div>
                        </div>
                    </div>
                    <div className="row justify-center">
                        <div className="col-md-auto">
                            <img src={goldenLine} alt={`goldenLine`} style={{ width: "100%" }} />
                        </div>
                    </div>
                </div>
            </div>

            <PeopleReviews />

            <div className="galeryHomeContentContainer">
                <div className="container color-white">
                    <div className="flex justify-around">
                        <div>
                            <div style={{ fontSize: 40 }}>
                                Galery
                            </div>
                            <div style={{ fontSize: 16 }}>
                                Lorem ipsum dolor  sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt  ut labore et dolore magna aliqua.
                            </div>
                        </div>
                        <div>
                            <div>
                                Year
                            </div>
                            <div className="flex" style={{ gap: 16 }}>
                                <div className={`yearSelect ${selectedYear === 2019 ? 'selected' : ''}`} style={{ fontSize: 20 }} onClick={() => handleClickChangeYear(2019)}>
                                    2019
                                </div>
                                <div className={`yearSelect ${selectedYear === 2021 ? 'selected' : ''}`} style={{ fontSize: 20 }} onClick={() => handleClickChangeYear(2021)}>
                                    2021
                                </div>
                                <div className={`yearSelect ${selectedYear === 2023 ? 'selected' : ''}`} style={{ fontSize: 20 }} onClick={() => handleClickChangeYear(2023)}>
                                    2023
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <div>
                            2023
                        </div>
                        <div>
                            Christmast Wonderland
                        </div>
                    </div>
                    <Galery />
                    <div className="flex justify-center">
                        <PillButton text={"View More"} />
                    </div>
                </div>
            </div>

            {/* <CardHover />

            <article className="container">
                <div className="row">
                    <div className="col">
                        1 of 2
                    </div>
                    <div className="col">
                        2 of 2
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        1 of 3
                    </div>
                    <div className="col">
                        2 of 3
                    </div>
                    <div className="col">
                        3 of 3
                    </div>
                </div>

                <div className="row">
                    <div className="col align-self-start">
                        One of three columns
                    </div>
                    <div className="col align-self-center">
                        One of three columns
                    </div>
                    <div className="col align-self-end">
                        One of three columns
                    </div>
                </div>
            </article> */}
        </div>
    )
}

export default Content;