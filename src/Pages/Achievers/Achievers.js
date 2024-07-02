import React from "react";
import SapphireWinnerSection from "./SapphireWinnerSection";
import CoverImage from "../../components/molecules/CoverImage";
import aboutCover from "../../assets/images/AboutCover.jpg"
import DiamondAchievers from "./DiamondAchievers";
import saphire1 from "../../assets/images/saphire1.png"
import saphire2 from "../../assets/images/saphire2.png"
import saphireAchieverText from "../../assets/images/saphireAchieverText.svg"
import PillButton from "../../components/atom/PillButton";

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
        event: ["2022 Christmas Wonderland", "2022 Classical Festival Surabaya"]
    },
    {
        name: "Sydney Mikaela Tan",
        image: saphire2,
        country: "Tangerang",
        event: ["2022 Christmas Wonderland"]
    },
]

const Achievers = () => {

    return (
        <div>
            <CoverImage background={aboutCover} logo={saphireAchieverText} isMiddleLeft={false} content={
                <>
                    <div style={{ marginLeft: "8vw", color: "white" }}>
                        <div style={{ fontSize: 24 }}>
                            Testting
                        </div>
                        <div style={{ fontSize: 40 }}>
                            button
                        </div>
                        <div>
                            <PillButton text={"Watch Performance"} />
                        </div>
                    </div>
                    <div />
                </>
            } />
            <SapphireWinnerSection dataDiamond={sapphireWinners} dataSaphire={sapphireWinners} />
            {/* <DiamondAchievers data={sapphireWinners} /> */}
        </div>
    )
}

export default Achievers;