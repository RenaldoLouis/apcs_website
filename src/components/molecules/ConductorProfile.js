import React from "react";
import AnimatedComponent from "../atom/AnimatedComponent";
import { flagIcon } from "../../utils/Utils";

const ConductorProfile = (props) => {
    const { title, desc, eventYear, eventName, titleUser = null, country = null } = props

    return (
        <div className="col" style={{ color: "white" }}>
            <AnimatedComponent animationClass="animate__fadeInDown">
                <div className="mangolaineFont lineHeightNormal text-align-justify" style={{ fontSize: 40 }}>
                    {title}
                </div>

                {titleUser && (
                    <div className="text-align-justify" style={{ fontSize: 20 }}>
                        {titleUser}
                    </div>
                )}

                {country && (
                    <div className="d-flex" style={{ marginTop: 16 }}>
                        <img src={flagIcon(country)} alt={"country"} />
                    </div>
                )}

                <div className="text-align-justify" style={{ marginTop: 30 }}>
                    {desc}
                </div>

                <div className="text-align-justify" style={{ marginTop: 30 }}>
                    {eventYear}<br />
                    <span className="italicText">   {eventName}</span>
                </div>
            </AnimatedComponent>
        </div>

    )
}

export default ConductorProfile;