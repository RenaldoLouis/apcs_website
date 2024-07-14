import React from "react";
import textureBackground from "../../assets/images/textureBackground.png"
import textureBackgroundLong from "../../assets/images/textureBackgroundLong.png"
import saphireAchieverText from "../../assets/images/saphireAchieverText.svg"
import ProfileToYoutube from "../../components/molecules/ProfileToYoutube";
import AchieversHeader from "../../components/molecules/AchieversHeader";
import diamondAchieversText from "../../assets/images/diamondAchieversText.svg"
import AnimatedComponent from "../../components/atom/AnimatedComponent";
import GoldSection from "./GoldSection";
import { useAuth } from "../../context/DataContext";

const SapphireWinnerSection = (props) => {
    const { dataSaphire, dataDiamond } = props
    const { isMobileAndSmaller } = useAuth();

    return (
        <div style={{ paddingTop: 150, backgroundImage: `url(${textureBackgroundLong})`, backgroundSize: "contain" }}>
            <AchieversHeader
                title="THOSE WHO HAD BRILLIANT PERFORMANCE"
                image={saphireAchieverText}
                description="Contestants who achieved a score of 100 points deserve to play with the orchestra of the respective festival / events." />
            <div className="container color-white">
                <div className="row gy-5 gy-md-1">
                    {dataSaphire.map((eachData, index) => {
                        // const colClass = index === 24 ? "col-12 col-md-4 offset-md-4" : "col-12 col-md-4";
                        return (
                            <div className={"col-6 col-md-4"} style={{ padding: isMobileAndSmaller ? 5 : 50 }}>
                                <ProfileToYoutube data={eachData} />
                            </div>
                        )
                    })}
                </div>
            </div>

            <div style={{ paddingTop: 150 }}>
                <AchieversHeader
                    title="THOSE WHO HAD GREAT PERFORMANCE"
                    image={diamondAchieversText}
                    description="Contestants who achieved a spectacular score of 95+ points." />
                <div className="container color-white" style={{ paddingBottom: 200 }}>
                    <div className="row  gy-5 gy-md-1">
                        {dataDiamond.map((eachData) => (
                            <div className="col-6 col-md-4" style={{ padding: isMobileAndSmaller ? 5 : 50 }}>
                                <ProfileToYoutube data={eachData} noImage={true} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <GoldSection />
        </div>
    )
}

export default SapphireWinnerSection;