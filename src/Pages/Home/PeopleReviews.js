import React from "react";
import PeopleQuotes from "../../components/molecules/PeopleQuotes";
import PillButton from "../../components/atom/PillButton";
import background2 from '../../assets/images/Background2.svg';
const PeopleReviews = () => {

    return (
        <div className="peopleReviewContainer">
            <img src={background2} alt={`background2`} style={{ width: "100%", marginBottom: "-3px" }} />

            {/* <div className="container" style={{ paddingTop: 32, paddingBottom: 32 }}>
                <div className="row">
                    <div className="col">
                        <div style={{ display: 'flex', gap: 88 }}>
                            <PeopleQuotes />
                            <PeopleQuotes />
                        </div>
                    </div>
                    <div className="col" style={{ textAlign: "center" }} />
                </div>

                <div className="row">
                    <div className="col" />
                    <div className="col" />
                    <div className="col">
                        <div className="flex-column" style={{ alignItems: "start" }}>
                            <div style={{ color: "white" }}>
                                Lorem Ipsum
                            </div>
                            <div style={{ color: "white" }}>
                                Lorem ipsum dolor  sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt  ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud  exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            </div>
                            <div style={{ marginTop: 23 }}>
                                <PillButton text="View More" isWhite={true} />
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}
        </div>
    )
}

export default PeopleReviews;