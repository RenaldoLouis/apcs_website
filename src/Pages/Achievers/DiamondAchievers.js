import React from "react";
import diamondAchieversText from "../../assets/images/diamondAchieversText.svg"
import ProfileToYoutube from "../../components/molecules/ProfileToYoutube";
import AchieversHeader from "../../components/molecules/AchieversHeader";

const DiamondAchievers = (props) => {
    const { data } = props
    return (
        <div style={{ paddingTop: 150, background: "#1c1c1d" }}>
            <AchieversHeader
                title="THOSE WHO HAD GREAT PERFORMANCE"
                image={diamondAchieversText}
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