import React from "react";
import goldenLine from "../../assets/images/goldenLine.png"
import textureBackground from "../../assets/images/textureBackground.png"
import lineAchievers from "../../assets/images/lineAchievers.png"
import apcLogoBold from "../../assets/images/apc_logo_bold.svg"
import ProfileToYoutube from "../../components/molecules/ProfileToYoutube";
import saphire1 from "../../assets/images/saphire1.png"
import saphire2 from "../../assets/images/saphire2.png"

const sapphireWinners = [
    {
        name: "Sydney Mikaela Tan",
        image: saphire1,
        country: "Tangerang",
        event: ["2022 Christmas Wonderland"]
    },
    {
        name: "Ashton Micah Poh",
        image: saphire2,
        country: "Tangerang",
        event: ["2022 Christmas Wonderland"]
    },
    {
        name: "Sydney Mikaela Tan",
        image: saphire1,
        country: "Tangerang",
        event: ["2022 Christmas Wonderland"]
    },
    {
        name: "Sydney Mikaela Tan",
        image: saphire2,
        country: "Tangerang",
        event: ["2022 Christmas Wonderland"]
    },
    {
        name: "Sydney Mikaela Tan",
        image: saphire2,
        country: "Tangerang",
        event: ["2022 Christmas Wonderland"]
    },
    {
        name: "Sydney Mikaela Tan",
        image: saphire2,
        country: "Tangerang",
        event: ["2022 Christmas Wonderland"]
    },
]

const SapphireWinnerSection = () => {

    return (
        <div style={{ paddingTop: 150, backgroundImage: `url(${textureBackground})`, }}>
            <div className="container" style={{ marginBottom: 150 }}>
                <div className="row justify-center">
                    <div className="col-md-auto ">
                        <img loading="lazy" src={lineAchievers} alt={`lineAchievers`} style={{ width: "100%" }} />
                    </div>
                </div>
                <div className="row justify-center place-items-center gx-5" style={{ margin: "47px 0px 47px 0px" }}>
                    <div className="col-md-6 text-align-last-end">
                        <img loading="lazy" src={apcLogoBold} alt="apcsLogo" style={{ width: 400 }} />
                    </div>
                    <div className="col-md-6">
                        <div className="goldenText">
                            A PIANO CONCERTO SERIES
                        </div>
                        <div style={{ color: "white" }}>
                            A Piano Concerto Series is an annual music series, designed in a thematic project, shaped in a piano concerto format where the pianist is accompanied by orchestra and conductor.
                        </div>
                    </div>
                </div>
                <div className="row justify-center">
                    <div className="col-md-auto">
                        <img loading="lazy" src={lineAchievers} alt={`lineAchievers`} style={{ width: "100%" }} />
                    </div>
                </div>
            </div>
            <div className="container color-white">
                <div className="row gx-5 gy-5">
                    {sapphireWinners.map((eachData) => (
                        <div className="col-12 col-md-4" style={{ padding: 50 }}>
                            <ProfileToYoutube data={eachData} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="container" style={{ marginBottom: 150, marginTop: 150 }}>
                <div className="row justify-center">
                    <div className="col-md-auto ">
                        <img loading="lazy" src={lineAchievers} alt={`lineAchievers`} style={{ width: "100%" }} />
                    </div>
                </div>
                <div className="row justify-center place-items-center gx-5" style={{ margin: "47px 0px 47px 0px" }}>
                    <div className="col-md-6 text-align-last-end">
                        <img loading="lazy" src={apcLogoBold} alt="apcsLogo" style={{ width: 400 }} />
                    </div>
                    <div className="col-md-6">
                        <div className="goldenText">
                            A PIANO CONCERTO SERIES
                        </div>
                        <div style={{ color: "white" }}>
                            A Piano Concerto Series is an annual music series, designed in a thematic project, shaped in a piano concerto format where the pianist is accompanied by orchestra and conductor.
                        </div>
                    </div>
                </div>
                <div className="row justify-center">
                    <div className="col-md-auto">
                        <img loading="lazy" src={lineAchievers} alt={`lineAchievers`} style={{ width: "100%" }} />
                    </div>
                </div>
            </div>
            <div className="container color-white" style={{ paddingBottom: 200 }}>
                <div className="row">
                    {sapphireWinners.map((eachData) => (
                        <div className="col-12 col-md-4" style={{ padding: 50 }}>
                            <ProfileToYoutube data={eachData} noImage={true} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default SapphireWinnerSection;