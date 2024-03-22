import React from "react";
import PeopleQuotes from "../../components/molecules/PeopleQuotes";
import PillButton from "../../components/atom/PillButton";

const PeopleReviews = () => {

    return (
        <div className="flex justify-evenly" style={{ height: 780 }}>
            <div className="flex-column justify-around" >
                <div style={{ display: 'flex', gap: 88 }}>
                    <PeopleQuotes />
                    <PeopleQuotes />
                </div>
                <div style={{ visibility: "hidden" }}>
                    <PeopleQuotes />
                </div>
            </div>
            <div className="flex-column justify-around"  >
                <div style={{ visibility: "hidden" }}>
                    asdasd
                </div>
                <div className="flex-column">
                    <div>
                        Lorem Ipsum
                    </div>
                    <div style={{ width: 392 }}>
                        Lorem ipsum dolor  sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt  ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud  exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </div>
                    <div style={{ marginTop: 23 }}>
                        <PillButton text="View More" isWhite={false} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PeopleReviews;