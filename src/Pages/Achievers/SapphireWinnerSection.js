import React from "react";
import textureBackground from "../../assets/images/textureBackground.png"
import textureBackgroundLong from "../../assets/images/textureBackgroundLong.png"
import saphireAchieverText from "../../assets/images/saphireAchieverText.svg"
import ProfileToYoutube from "../../components/molecules/ProfileToYoutube";
import AchieversHeader from "../../components/molecules/AchieversHeader";
import diamondAchieversText from "../../assets/images/diamondAchieversText.svg"
import AnimatedComponent from "../../components/atom/AnimatedComponent";

const SapphireWinnerSection = (props) => {
    const { dataSaphire, dataDiamond } = props
    return (
        <div style={{ paddingTop: 150, backgroundImage: `url(${textureBackgroundLong})`, backgroundSize: "contain" }}>
            <AchieversHeader
                title="THOSE WHO HAD BRILLIANT PERFORMANCE"
                image={saphireAchieverText}
                description="Contestants who achieved a score of 100 points deserve to play with the orchestra of the respective festival / events." />
            <div className="container color-white">
                <div className="row gx-5 gy-5">
                    {dataSaphire.map((eachData) => (
                        <div className="col-12 col-md-4" style={{ padding: 50 }}>
                            <ProfileToYoutube data={eachData} />
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ paddingTop: 150 }}>
                <AchieversHeader
                    title="THOSE WHO HAD GREAT PERFORMANCE"
                    image={diamondAchieversText}
                    description="Contestants who achieved a spectacular score of 95+ points." />
                <div className="container color-white" style={{ paddingBottom: 200 }}>
                    <div className="row gx-5 gy-5">
                        {dataDiamond.map((eachData) => (
                            <div className="col-12 col-md-4" style={{ padding: 50 }}>
                                <ProfileToYoutube data={eachData} noImage={true} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SapphireWinnerSection;