import React from "react";
import SapphireWinnerSection from "./SapphireWinnerSection";
import CoverImage from "../../components/molecules/CoverImage";
import aboutCover from "../../assets/images/AboutCover.jpg"
import musiciswhatapcs from "../../assets/images/musiciswhatapcs.svg"
import DiamondAchievers from "./DiamondAchievers";
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
            {/* <CoverVideo isVideo={true} /> */}
            <CoverImage background={aboutCover} logo={musiciswhatapcs} isMiddleLeft={false} />
            <SapphireWinnerSection data={sapphireWinners} />
            <DiamondAchievers data={sapphireWinners} />
        </div>
    )
}

export default Achievers;