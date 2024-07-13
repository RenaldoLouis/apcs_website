import React, { useContext } from "react";
import lineAchievers from "../../assets/images/lineAchievers.png"
import { useAuth } from "../../context/DataContext";
import { ResponsiveText } from "../atom/ResponsiveText";

const AchieversHeader = (props) => {
    const { title, description, image } = props

    const { isMobileAndSmaller } = useAuth()

    return (
        <div className="container" style={{ marginBottom: 150 }}>
            <div className="row justify-center">
                <div className="col-md-auto ">
                    <img loading="lazy" src={lineAchievers} alt={`lineAchievers`} style={{ width: "100%" }} />
                </div>
            </div>
            <div className="row justify-center place-items-center gx-5" style={{ margin: "47px 0px 47px 0px" }}>
                <div className={`col-md-6 ${isMobileAndSmaller ? "text-align-last-center" : "text-align-last-end"}`}>
                    <img loading="lazy" src={image} alt="apcsLogo" style={{ width: isMobileAndSmaller ? "100%" : "65%" }} />
                </div>
                <div className="col-md-6">
                    {/* <div className="goldenText mangolaineFont" style={{ fontSize: 40 }}>
                        {title}
                    </div> */}
                    <ResponsiveText className="goldenText mangolaineFont">
                        {title}
                    </ResponsiveText>
                    <div style={{ color: "white", fontSize: 20, textAlign: isMobileAndSmaller ? "center" : "justify", marginTop: isMobileAndSmaller ? 15 : 0 }}>
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