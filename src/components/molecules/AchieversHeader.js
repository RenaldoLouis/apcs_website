import React from "react";
import lineAchievers from "../../assets/images/lineAchievers.png"

const AchieversHeader = (props) => {
    const { title, description, image } = props
    return (
        <div className="container" style={{ marginBottom: 150 }}>
            <div className="row justify-center">
                <div className="col-md-auto ">
                    <img loading="lazy" src={lineAchievers} alt={`lineAchievers`} style={{ width: "100%" }} />
                </div>
            </div>
            <div className="row justify-center place-items-center gx-5" style={{ margin: "47px 0px 47px 0px" }}>
                <div className="col-md-6 text-align-last-end">
                    <img loading="lazy" src={image} alt="apcsLogo" style={{ width: 400 }} />
                </div>
                <div className="col-md-6">
                    <div className="goldenText">
                        {title}
                    </div>
                    <div style={{ color: "white" }}>
                        {description}
                    </div>
                </div>
            </div>
            <div className="row justify-center">
                <div className="col-md-auto">
                    <img loading="lazy" src={lineAchievers} alt={`lineAchievers`} style={{ width: "100%" }} />
                </div>
            </div>
        </div>
    )
}

export default AchieversHeader;