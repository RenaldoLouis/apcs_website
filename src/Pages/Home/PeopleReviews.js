import React from "react";
import PeopleQuotes from "../../components/molecules/PeopleQuotes";
import PillButton from "../../components/atom/PillButton";

const PeopleReviews = () => {

    return (
        <div className="peopleReviewContainer">
            <div className="container" style={{ paddingTop: 32, paddingBottom: 32 }}>
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
                            <div style={{ width: 392, color: "white" }}>
                                Lorem ipsum dolor  sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt  ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud  exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            </div>
                            <div style={{ marginTop: 23 }}>
                                <PillButton text="View More" isWhite={true} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PeopleReviews;