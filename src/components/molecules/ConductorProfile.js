import React from "react";

const ConductorProfile = (props) => {
    const { title, desc, eventYear, eventName } = props

    return (
        <div className="col" style={{ color: "white" }}>
            <div className="mangolaineFont lineHeightNormal text-align-justify" style={{ fontSize: 40 }}>
                {title}
            </div>

            <div className="text-align-justify" style={{ marginTop: 30 }}>
                {desc}
            </div>

            <div className="text-align-justify" style={{ marginTop: 30 }}>
                {eventYear}<br />
                {eventName}
            </div>
        </div>
    )
}

export default ConductorProfile;