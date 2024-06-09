import React, { useState } from "react";
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
        </div>
    )
}

export default Content;