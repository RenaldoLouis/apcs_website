import React, { useState } from "react";
import CoverImage from "./CoverImage";
import CardHover from "../../components/molecules/CardHover";
import CarouselCustom from "../../components/molecules/CarouselCustom";
import PeopleReviews from "./PeopleReviews";
import Galery from "../Galery/Galery";
import PillButton from "../../components/atom/PillButton";

const Content = (props) => {
    const { audio } = props

    const [selectedYear, setSelectedYear] = useState(2019);

    const handleClickChangeYear = (year) => {
        setSelectedYear(year)
    }

    return (
        <section>
            <CarouselCustom />
            {/* <CoverImage
                audio={audio}
            /> */}

            <div className="homeContentContainer">
                <div style={{ color: "white" }}>
                    Test
                </div>
                <div style={{ color: "white" }}>
                    Test
                </div>
            </div>

            <PeopleReviews />

            <div className="galeryHomeContentContainer color-white">
                <div className="flex justify-around">
                    <div>
                        <div style={{ fontSize: 40 }}>
                            Galery
                        </div>
                        <div style={{ fontSize: 16, width: 392 }}>
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

            <CardHover />

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
            </article>
        </section>
    )
}

export default Content;