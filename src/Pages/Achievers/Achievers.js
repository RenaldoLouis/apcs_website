import React from "react";
import SapphireWinnerSection from "./SapphireWinnerSection";
import CoverImage from "../../components/molecules/CoverImage";
import achieverBackground from "../../assets/images/achieverBackground.png"
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
import CoverImageHome from "../../components/molecules/CoverImageHome";
import { ContentPosition } from "../../constant/ContentPosition";
import AnimatedComponent from "../../components/atom/AnimatedComponent";

const sapphireWinners = [
    {
        name: "Sydney Mikaela Tan",
        image: saphireAchievers1,
        "country": "Tangerang",
        "YoutubeLink": "https://www.youtube.com/watch?v=gItdcXGQqSM&ab_channel=APIANOCONCERTOSERIES",
        "event": ["2023 Christmas Wonderland", "2023 Classical Festival Surabaya", "2023 Classical Festival Jakarta"]
    },
    {
        name: "Darius Tairisya",
        image: saphireAchievers3,
        "country": "Tangerang",
        "event": ["2023 Christmas Wonderland"]
    },
    {
        name: "Ashton Micah Poh",
        image: saphireAchievers2,
        "country": "Tangerang",
        "YoutubeLink": "https://www.youtube.com/watch?v=UH8J4olztEo&ab_channel=APIANOCONCERTOSERIES",
        "event": ["2023 Classical Festival Jakarta", "2023 Christmas Wonderland"]
    },
    {
        name: "Katherine Natalie M.",
        image: saphireAchievers5,
        "country": "Bogor",
        "event": ["2023 Christmas Wonderland", "2023 Classical Festival Jakarta"]
    },
    {
        name: "Chindy Anastasya",
        image: saphireAchievers4,
        "country": "Tangerang",
        "event": ["2023 Christmas Wonderland"]
    },
    {
        name: "Fairlyn Dharmawan",
        image: saphireAchievers6,
        "country": "Tangerang",
        "event": ["2023 Christmas Wonderland"]
    },
    {
        name: "Mikhayla Sofilia W.",
        image: saphireAchievers8,
        "country": "Tangerang",
        "event": ["2023 Christmas Wonderland"]
    },
    {
        name: "Nadya Adeline H.",
        image: saphireAchievers7,
        "country": "Tangerang",
        "event": ["2023 Christmas Wonderland"]
    },
    {
        name: "Liselle Fendbee S.",
        image: saphireAchievers9,
        "country": "Batam",
        "event": ["2023 Christmas Wonderland"]
    },
    {
        name: "Pakpahan Aminan Shantlerine A.R",
        image: saphireAchievers10,
        "country": "Bekasi",
        "event": ["2023 Christmas Wonderland"]
    },
    {
        name: "Gregorius Reinhardt",
        image: saphireAchievers12,
        "country": "Palembang",
        "YoutubeLink": "https://www.youtube.com/watch?v=TntCfGmzFSU&ab_channel=APIANOCONCERTOSERIES",
        "event": ["2022 Magical Music Soundtrack", "2023 Classical Festival Jakarta"]
    },
    {
        name: "Issac Mulya Putra",
        image: saphireAchievers11,
        "country": "Tangerang",
        "event": ["2023 Christmas Wonderland"]
    },
    {
        name: "Jaden William Tang",
        image: saphireAchievers13,
        "country": "Surabaya",
        "YoutubeLink": "https://www.youtube.com/watch?v=U4ewR5bJwKA&ab_channel=APIANOCONCERTOSERIES",
        "event": ["2022 Magical Music Soundtrack"]
    },
    {
        name: "Jeffren Leliga",
        image: saphireAchievers14,
        "country": "Surabaya",
        "YoutubeLink": "https://www.youtube.com/watch?v=9PKinsw17Oc&ab_channel=APIANOCONCERTOSERIES",
        "event": ["2022 Magical Music Soundtrack", "2023 Classical Festival Surabaya"]
    },
    {
        name: "Charice Elleanore K. B.",
        image: saphireAchievers15,
        "country": "Surabaya",
        "YoutubeLink": "https://www.youtube.com/watch?v=NewtKsNhs_4&ab_channel=APIANOCONCERTOSERIES",
        "event": ["2022 Magical Music Soundtrack"]
    },
    {
        name: "Ann Shereen Yao",
        image: saphireAchievers16,
        "country": "Jakarta",
        "YoutubeLink": "https://www.youtube.com/watch?v=779gXnPTs-0&ab_channel=APIANOCONCERTOSERIES",
        "event": ["2022 Magical Music Soundtrack", "2023 Classical Festival Jakarta", "2023 Christmas Wonderland"]
    },
    {
        name: "Cathleen Scarlett H.",
        image: saphireAchievers17,
        "country": "Jakarta",
        "YoutubeLink": "https://www.youtube.com/watch?v=D1ct_m0XJtY&ab_channel=APIANOCONCERTOSERIES",
        "event": [
            "2022 Magical Music Soundtrack",
            "2023 Classical Festival Jakarta",
            "2023 Christmas Wonderland"
        ]
    },
    {
        name: "Alf Elijah Beloved S.",
        image: saphireAchievers18,
        "country": "Jakarta",
        "YoutubeLink": "https://www.youtube.com/watch?v=9iMrg1T1p_w&ab_channel=APIANOCONCERTOSERIES",
        "event": [
            "2022 Magical Music Soundtrack",
            "2023 Classical Festival Jakarta"
        ]
    },
    {
        name: "Keenan Kwok",
        image: saphireAchievers19,
        "country": "Jakarta",
        "YoutubeLink": "https://www.youtube.com/watch?v=MRbkf3Jlm9I&ab_channel=APIANOCONCERTOSERIES",
        "event": [
            "2023 Classical Festival Surabaya",
            "2023 Christmas Wonderland"
        ]
    },
    {
        name: "Edward Nathaniel H.",
        image: saphireAchievers20,
        "YoutubeLink": "https://www.youtube.com/watch?v=twdiVI7WYNA&ab_channel=APIANOCONCERTOSERIES",
        "event": [
            "2023 Classical Festival Surabaya",
            "2023 Christmas Wonderland"
        ]
    },
    {
        name: "Michael Phillipe A.",
        image: saphireAchievers21,
        "country": "Surabaya",
        "YoutubeLink": "https://www.youtube.com/watch?v=9Xgu6PLNNg0&ab_channel=APIANOCONCERTOSERIES",
        "event": [
            "2023 Classical Festival Surabaya"
        ]
    },
    {
        name: "Cheryl Pandora",
        image: saphireAchievers22,
        "country": "Medan",
        "YoutubeLink": "https://www.youtube.com/watch?v=XFvWVT0Wroc&ab_channel=APIANOCONCERTOSERIES",
        "event": [
            "2023 Classical Festival Surabaya"
        ]
    },
    {
        name: "Joshua Kevin H.",
        image: saphireAchievers23,
        "country": "Surabaya",
        "YoutubeLink": "https://www.youtube.com/watch?v=JDU_q_ZjfW0&ab_channel=APIANOCONCERTOSERIES",
        "event": ["Classical Festival Surabaya"]
    },
    {
        name: "Clarissa Stefanny",
        image: saphireAchievers24,
        country: "Pontianak",
        "YoutubeLink": "https://www.youtube.com/watch?v=XR8yYVUsBzo&ab_channel=APIANOCONCERTOSERIES",
        "event": ["Classical Festival Jakarta", "Christmas Wonderland"]
    },
];

const handleOpenYoutube = () => {
    window.open("https://www.youtube.com/@apcsmusic", '_blank');
}

const Achievers = () => {

    return (
        <div>
            <CoverImageHome background={achieverBackground}
                logo={saphireAchieverText}
                position={ContentPosition.MIDDLE50}
                content={
                    <>
                        <AnimatedComponent animationClass="animate__fadeIn">
                            <div style={{ marginLeft: "8vw", color: "white" }}>
                                <div style={{ fontSize: 24 }}>
                                    2023 HIGHLIGHTS
                                </div>
                                <div style={{ fontSize: 40, lineHeight: "40px", marginBottom: 36, fontStyle: "italic" }}>
                                    Christmas<br />
                                    Wonderland
                                </div>
                                <div>
                                    <PillButton text={"Watch Performance"} onClick={handleOpenYoutube} />
                                </div>
                            </div>
                            <div />
                        </AnimatedComponent>
                    </>
                }
            />
            {/* <CoverImage background={achieverBackground} logo={saphireAchieverText} isMiddleLeft={false} content={
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
            } /> */}
            <SapphireWinnerSection dataSaphire={sapphireWinners} dataDiamond={dataDiamond} />
        </div>
    )
}

export default Achievers;