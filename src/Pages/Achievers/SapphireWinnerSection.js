import React from "react";
import goldenLine from "../../assets/images/goldenLine.png"

const SapphireWinnerSection = () => {

    return (
        <div className="primaryBackgroundBlack " style={{ paddingTop: 150 }}>
            <div className="container" style={{ marginBottom: 150 }}>
                <div className="row justify-center">
                    <div className="col-md-auto ">
                        <img loading="lazy" src={goldenLine} alt={`goldenLine`} style={{ width: "100%" }} />
                    </div>
                </div>
                <div style={{ margin: "47px 0px 47px 0px" }}>
                    <div className="row justify-center">
                        <div className="col-md-6">
                            <div className="goldenText">
                                A PIANO CONCERTO SERIES
                            </div>
                        </div>
                    </div>
                    <div className="row justify-center">
                        <div className="col-md-6">
                            <div style={{ color: "white" }}>
                                A Piano Concerto Series is an annual music series, designed in a thematic project, shaped in a piano concerto format where the pianist is accompanied by orchestra and conductor.
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row justify-center">
                    <div className="col-md-auto">
                        <img loading="lazy" src={goldenLine} alt={`goldenLine`} style={{ width: "100%" }} />
                    </div>
                </div>
            </div>
            <div className="container color-white">
                <div className="row">
                    <div className="col-sm">
                        <img loading="lazy" style={{ aspectRatio: "1/1", objectFit: "cover", width: "100%" }} src='https://images.unsplash.com/photo-1661435805196-81136edfa297?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NjI5OTQxMTQ&ixlib=rb-1.2.1&q=80&w=400' alt='' />
                        John Doe
                    </div>
                    <div className="col-sm">
                        One of three columns
                    </div>
                    <div className="col-sm">
                        One of three columns
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SapphireWinnerSection;