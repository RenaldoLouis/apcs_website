import React from "react";
import SapphireWinnerSection from "./SapphireWinnerSection";
import CoverImage from "../../components/molecules/CoverImage";
import aboutCover from "../../assets/images/AboutCover.jpg"
import DiamondAchievers from "./DiamondAchievers";
import saphireAchievers1 from "../../assets/images/saphireAchiever/saphireAchievers1.png";
import saphireAchievers2 from "../../assets/images/saphireAchiever/saphireAchievers2.png";
import saphireAchievers3 from "../../assets/images/saphireAchiever/saphireAchievers3.png";
import saphireAchievers4 from "../../assets/images/saphireAchiever/saphireAchievers4.png";
import saphireAchievers5 from "../../assets/images/saphireAchiever/saphireAchievers5.png";
import saphireAchievers6 from "../../assets/images/saphireAchiever/saphireAchievers6.png";
import saphireAchievers7 from "../../assets/images/saphireAchiever/saphireAchievers7.png";
import saphireAchievers8 from "../../assets/images/saphireAchiever/saphireAchievers8.png";
import saphireAchievers9 from "../../assets/images/saphireAchiever/saphireAchievers9.png";
import saphireAchievers10 from "../../assets/images/saphireAchiever/saphireAchievers10.png";
import saphireAchievers11 from "../../assets/images/saphireAchiever/saphireAchievers11.png";
import saphireAchievers12 from "../../assets/images/saphireAchiever/saphireAchievers12.png";
import saphireAchievers13 from "../../assets/images/saphireAchiever/saphireAchievers13.png";
import saphireAchievers14 from "../../assets/images/saphireAchiever/saphireAchievers14.png";
import saphireAchievers15 from "../../assets/images/saphireAchiever/saphireAchievers15.png";
import saphireAchievers16 from "../../assets/images/saphireAchiever/saphireAchievers16.png";
import saphireAchievers17 from "../../assets/images/saphireAchiever/saphireAchievers17.png";
import saphireAchievers18 from "../../assets/images/saphireAchiever/saphireAchievers18.png";
import saphireAchievers19 from "../../assets/images/saphireAchiever/saphireAchievers19.png";
import saphireAchievers20 from "../../assets/images/saphireAchiever/saphireAchievers20.png";
import saphireAchievers21 from "../../assets/images/saphireAchiever/saphireAchievers21.png";
import saphireAchievers22 from "../../assets/images/saphireAchiever/saphireAchievers22.png";
import saphireAchievers23 from "../../assets/images/saphireAchiever/saphireAchievers23.png";
import saphireAchievers24 from "../../assets/images/saphireAchiever/saphireAchievers24.png";
import saphireAchieverText from "../../assets/images/saphireAchieverText.svg"
import PillButton from "../../components/atom/PillButton";
import { dataDiamond } from "../../constant/datas/DiamondAchieverData";

const sapphireWinners = [
    {
        name: "Sydney Mikaela Tan",
        image: saphireAchievers1,
        country: "Tangerang",
        event: ["2022 Christmas Wonderland"]
    },
    {
        name: "Ashton Micah Poh",
        image: saphireAchievers2,
        country: "Tangerang",
        event: ["2022 Christmas Wonderland"]
    },
    {
        name: "Darius Tairisya",
        image: saphireAchievers3,
        country: "Tangerang",
        event: ["2022 Christmas Wonderland"]
    },
    {
        name: "Chindy Anastasya",
        image: saphireAchievers4,
        country: "Tangerang",
        event: ["2022 Christmas Wonderland"]
    },
    {
        name: "Katherine Natalie M.",
        image: saphireAchievers5,
        country: "Tangerang",
        event: ["2022 Christmas Wonderland", "2022 Classical Festival Surabaya"]
    },
    {
        name: "Fairlyn Dharmawan",
        image: saphireAchievers6,
        country: "Tangerang",
        event: ["2022 Christmas Wonderland"]
    },
    {
        name: "Nadya Adeline H.",
        image: saphireAchievers7,
        country: "Tangerang",
        event: ["2022 Christmas Wonderland"]
    },
    {
        name: "Mikhayla Sofilia W.",
        image: saphireAchievers8,
        country: "Tangerang",
        event: ["2022 Christmas Wonderland"]
    },
    {
        name: "Liselle Fendbee S.",
        image: saphireAchievers9,
        country: "Tangerang",
        event: ["2022 Christmas Wonderland"]
    },
    {
        name: "Pakpahan Aminan Shantlerine A.R",
        image: saphireAchievers10,
        country: "Tangerang",
        event: ["2022 Christmas Wonderland"]
    },
    {
        name: "Issac Mulya Putra",
        image: saphireAchievers11,
        country: "Tangerang",
        event: ["2022 Christmas Wonderland"]
    },
    {
        name: "Gregorius Reinhardt",
        image: saphireAchievers12,
        country: "Tangerang",
        event: ["2022 Christmas Wonderland"]
    },
    {
        name: "Jaden William Tang",
        image: saphireAchievers13,
        country: "Tangerang",
        event: ["2022 Christmas Wonderland"]
    },
    {
        name: "Jeffren Leliga",
        image: saphireAchievers14,
        country: "Tangerang",
        event: ["2022 Christmas Wonderland"]
    },
    {
        name: "Charice Elleanore K. B.",
        image: saphireAchievers15,
        country: "Tangerang",
        event: ["2022 Christmas Wonderland"]
    },
    {
        name: "Ann Shereen Yao",
        image: saphireAchievers16,
        country: "Tangerang",
        event: ["2022 Christmas Wonderland"]
    },
    {
        name: "Cathleen Scarlett H.",
        image: saphireAchievers17,
        country: "Tangerang",
        event: ["2022 Christmas Wonderland"]
    },
    {
        name: "Alf Elijah Beloved S.",
        image: saphireAchievers18,
        country: "Tangerang",
        event: ["2022 Christmas Wonderland"]
    },
    {
        name: "Keenan Kwok",
        image: saphireAchievers19,
        country: "Tangerang",
        event: ["2022 Christmas Wonderland"]
    },
    {
        name: "Edward Nathaniel H.",
        image: saphireAchievers20,
        country: "Tangerang",
        event: ["2022 Christmas Wonderland"]
    },
    {
        name: "Michael Phillipe A.",
        image: saphireAchievers21,
        country: "Tangerang",
        event: ["2022 Christmas Wonderland"]
    },
    {
        name: "Cheryl Pandora",
        image: saphireAchievers22,
        country: "Tangerang",
        event: ["2022 Christmas Wonderland"]
    },
    {
        name: "Joshua Kevin H.",
        image: saphireAchievers23,
        country: "Tangerang",
        event: ["2022 Christmas Wonderland"]
    },
    {
        name: "Clarissa Stefanny",
        image: saphireAchievers24,
        country: "Tangerang",
        event: ["2022 Christmas Wonderland"]
    },
];


const Achievers = () => {

    return (
        <div>
            <CoverImage background={aboutCover} logo={saphireAchieverText} isMiddleLeft={false} content={
                <>
                    <div style={{ marginLeft: "8vw", color: "white" }}>
                        <div style={{ fontSize: 24 }}>
                            2023 HIGHLIGHTS
                        </div>
                        <div style={{ fontSize: 40, lineHeight: "40px", marginBottom: 36, fontStyle: "italic" }}>
                            Christmas<br />
                            Wonderland
                        </div>
                        <div>
                            <PillButton text={"Watch Performance"} />
                        </div>
                    </div>
                    <div />
                </>
            } />
            <SapphireWinnerSection dataSaphire={sapphireWinners} dataDiamond={dataDiamond} />
            {/* <DiamondAchievers data={sapphireWinners} /> */}
        </div>
    )
}

export default Achievers;