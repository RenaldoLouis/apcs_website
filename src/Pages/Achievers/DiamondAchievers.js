import React from "react";
import goldenLine from "../../assets/images/goldenLine.png"
import textureBackground from "../../assets/images/textureBackground.png"
import lineAchievers from "../../assets/images/lineAchievers.png"
import apcLogoBold from "../../assets/images/apc_logo_bold.svg"
import ProfileToYoutube from "../../components/molecules/ProfileToYoutube";
import saphire1 from "../../assets/images/saphire1.png"
import saphire2 from "../../assets/images/saphire2.png"
import AchieversHeader from "../../components/molecules/AchieversHeader";

const DiamondAchievers = (props) => {
    const { data } = props
    return (
        <div style={{ paddingTop: 150, background: "#1c1c1d" }}>
            <AchieversHeader
                title="THOSE WHO HAD GREAT PERFORMANCE"
                description="Contestants who achieved a spectacular score of 95+ points." />
            <div className="container color-white" style={{ paddingBottom: 200 }}>
                <div className="row gx-5 gy-5">
                    {data.map((eachData) => (
                        <div className="col-12 col-md-4" style={{ padding: 50 }}>
                            <ProfileToYoutube data={eachData} noImage={true} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default DiamondAchievers;