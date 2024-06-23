import React from "react";
import textureBackground from "../../assets/images/textureBackground.png"
import saphireAchieverText from "../../assets/images/saphireAchieverText.svg"
import ProfileToYoutube from "../../components/molecules/ProfileToYoutube";
import AchieversHeader from "../../components/molecules/AchieversHeader";

const SapphireWinnerSection = (props) => {
    const { data } = props
    return (
        <div style={{ paddingTop: 150, backgroundImage: `url(${textureBackground})` }}>
            <AchieversHeader
                title="THOSE WHO HAD BRILLIANT PERFORMANCE"
                image={saphireAchieverText}
                description="Contestants who achieved a score of 100 points deserve to play with the orchestra of the respective festival / events." />
            <div className="container color-white">
                <div className="row gx-5 gy-5">
                    {data.map((eachData) => (
                        <div className="col-12 col-md-4" style={{ padding: 50 }}>
                            <ProfileToYoutube data={eachData} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default SapphireWinnerSection;