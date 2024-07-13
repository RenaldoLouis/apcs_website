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
import saphireAchievers25 from "../../assets/images/saphireAchiever/saphireAchievers25.png";
import saphireAchievers26 from "../../assets/images/saphireAchiever/saphireAchievers26.png";
import saphireAchievers27 from "../../assets/images/saphireAchiever/saphireAchievers27.png";
import saphireAchieverText from "../../assets/images/saphireAchieverText.svg"
import PillButton from "../../components/atom/PillButton";
import { dataDiamond } from "../../constant/datas/DiamondAchieverData";
import CoverImageHome from "../../components/molecules/CoverImageHome";
import { ContentPosition } from "../../constant/ContentPosition";
import AnimatedComponent from "../../components/atom/AnimatedComponent";
import { ListOfCity } from "../../constant/ListOfCity";
import { ListOfEventAchiever } from "../../constant/ListOfEventAchiever";

const sapphireWinners = [
    {
        name: "Ann Sheren Yao",
        image: saphireAchievers1,
        country: ListOfCity.JKT,
        YoutubeLink: "https://www.youtube.com/watch?v=is5ie02NnyA&ab_channel=APIANOCONCERTOSERIES",
        event: [ListOfEventAchiever["2025UPCOMING"], ListOfEventAchiever["2023CLASSICJKT"]]
    },
    {
        name: "Clarissa Stefanny",
        image: saphireAchievers2,
        country: ListOfCity.PNT,
        YoutubeLink: "https://www.youtube.com/watch?v=XR8yYVUsBzo&ab_channel=APIANOCONCERTOSERIES",
        event: [ListOfEventAchiever["2025UPCOMING"]]
    },
    {
        name: "Cathleen Scarlett Hayasi",
        image: saphireAchievers3,
        country: ListOfCity.JKT,
        YoutubeLink: "https://www.youtube.com/watch?v=D1ct_m0XJtY&ab_channel=APIANOCONCERTOSERIES",
        event: [ListOfEventAchiever["2025UPCOMING"]]
    },
    {
        name: "Edward Nathaniel Handoko",
        image: saphireAchievers4,
        country: ListOfCity.SRB,
        YoutubeLink: "https://www.youtube.com/watch?v=twdiVI7WYNA&ab_channel=APIANOCONCERTOSERIES",
        event: [ListOfEventAchiever["2025UPCOMING"]]
    },
    {
        name: "Jaden William Tang",
        image: saphireAchievers5,
        country: ListOfCity.SRB,
        YoutubeLink: "https://www.youtube.com/watch?v=P43e51OVkWQ&ab_channel=APIANOCONCERTOSERIES",
        event: [ListOfEventAchiever["2023CHRISTMAS"]]
    },
    {
        name: "Keenan Kwok",
        image: saphireAchievers6,
        country: ListOfCity.JKT,
        YoutubeLink: "https://www.youtube.com/watch?v=MRbkf3Jlm9I&ab_channel=APIANOCONCERTOSERIES",
        event: [ListOfEventAchiever["2025UPCOMING"]]
    },
    {
        name: "jeffren Leliga",
        image: saphireAchievers7,
        country: ListOfCity.SRB,
        YoutubeLink: "https://www.youtube.com/watch?v=bMBKgEL4x3w&ab_channel=APIANOCONCERTOSERIES",
        event: [ListOfEventAchiever["2023CHRISTMAS"], ListOfEventAchiever["2023CLASSICSRBY"]]
    },
    {
        name: "Charice Elleanore Konggo Budiman",
        image: saphireAchievers8,
        country: ListOfCity.SRB,
        YoutubeLink: "https://www.youtube.com/watch?v=__sIBAeIqCE&ab_channel=APIANOCONCERTOSERIES",
        event: [ListOfEventAchiever["2023CHRISTMAS"]]
    },
    {
        name: "Alf Elijah Beloved Sigarlaki",
        image: saphireAchievers9,
        country: ListOfCity.JKT,
        YoutubeLink: "https://www.youtube.com/watch?v=1sqUiE7SP30&ab_channel=APIANOCONCERTOSERIES",
        event: [ListOfEventAchiever["2023CHRISTMAS"], ListOfEventAchiever["2023CLASSICJKT"]]
    },
    {
        name: "Sydney Mikaela Tan",
        image: saphireAchievers10,
        country: ListOfCity.TNG,
        YoutubeLink: " https://www.youtube.com/watch?v=woQYPaBtJqM&ab_channel=APIANOCONCERTOSERIES",
        event: [ListOfEventAchiever["2022MAGICMUSIC"]]
    },
    {
        name: "Gregorius Reinhardt",
        image: saphireAchievers11,
        country: ListOfCity.PLB,
        // YoutubeLink: "https://www.youtube.com/watch?v=XR8yYVUsBzo&ab_channel=APIANOCONCERTOSERIES",
        event: [ListOfEventAchiever["2023CHRISTMAS"]]
    },
    {
        name: "Ashton Micah Poh",
        image: saphireAchievers12,
        country: ListOfCity.TNG,
        YoutubeLink: "https://youtu.be/Fv7SkBb-EKo?t=113",
        event: [ListOfEventAchiever["2022MAGICMUSIC"]]
    },
    {
        name: "Darius Tairisya",
        image: saphireAchievers13,
        country: ListOfCity.TNG,
        YoutubeLink: "https://youtu.be/mSfGrHZK4Ww?t=130",
        event: [ListOfEventAchiever["2022MAGICMUSIC"]]
    },
    {
        name: "Katherine Natalie Mulyadi",
        image: saphireAchievers14,
        country: ListOfCity.BGR,
        YoutubeLink: "https://youtu.be/apgUhkXAIVs",
        event: [ListOfEventAchiever["2022MAGICMUSIC"]]
    },
    {
        name: "Fairlyn Dharmawan",
        image: saphireAchievers15,
        country: ListOfCity.TNG,
        YoutubeLink: " https://www.youtube.com/watch?v=apgUhkXAIVs&ab_channel=APIANOCONCERTOSERIES",
        event: [ListOfEventAchiever["2022MAGICMUSIC"]]
    },
    {
        name: "Mikhayla Sofilia Widjaja",
        image: saphireAchievers16,
        country: ListOfCity.TNG,
        YoutubeLink: " https://www.youtube.com/watch?v=8pCkvjzr8RE&ab_channel=APIANOCONCERTOSERIES",
        event: [ListOfEventAchiever["2022MAGICMUSIC"]]
    },
    {
        name: "Chindy Anastasya",
        image: saphireAchievers17,
        country: ListOfCity.TNG,
        YoutubeLink: "https://www.youtube.com/watch?v=Fv7SkBb-EKo&ab_channel=APIANOCONCERTOSERIES",
        event: [ListOfEventAchiever["2022MAGICMUSIC"]]
    },
    {
        name: "Liselle Fendbee Soe",
        image: saphireAchievers18,
        country: ListOfCity.BTM,
        YoutubeLink: "https://youtu.be/8pCkvjzr8RE?t=59",
        event: [ListOfEventAchiever["2022MAGICMUSIC"]]
    },
    {
        name: "Issac Mulya Putra",
        image: saphireAchievers19,
        country: ListOfCity.TNG,
        YoutubeLink: "https://www.youtube.com/watch?v=J55IRPHgsjw&ab_channel=APIANOCONCERTOSERIES",
        event: [ListOfEventAchiever["2022MAGICMUSIC"]]
    },
    {
        name: "Pakpahan Aminan Shantlerine A.R",
        image: saphireAchievers20,
        country: ListOfCity.BKS,
        YoutubeLink: "https://www.youtube.com/watch?v=mSfGrHZK4Ww&ab_channel=APIANOCONCERTOSERIES",
        event: [ListOfEventAchiever["2022MAGICMUSIC"]]
    },
    {
        name: "Nadya Adeline Hermanto",
        image: saphireAchievers21,
        country: ListOfCity.TNG,
        YoutubeLink: ":https://www.youtube.com/watch?v=4WdAL9usTK8&ab_channel=APIANOCONCERTOSERIES",
        event: [ListOfEventAchiever["2022MAGICMUSIC"]]
    },
    {
        name: "Cheryl Pandora",
        image: saphireAchievers22,
        country: ListOfCity.MD,
        YoutubeLink: "https://www.youtube.com/watch?v=XFvWVT0Wroc&ab_channel=APIANOCONCERTOSERIES",
        event: [ListOfEventAchiever["2023CLASSICSRBY"]]
    },
    {
        name: "Ann Shereen Yao & Adrianne Shanelle Yao",
        image: saphireAchievers23,
        country: ListOfCity.JKT,
        YoutubeLink: "https://www.youtube.com/watch?v=779gXnPTs-0&ab_channel=APIANOCONCERTOSERIES",
        event: [ListOfEventAchiever["2023CLASSICJKT"]]
    },
    {
        name: "Joshua Kevin Hudyana",
        image: saphireAchievers24,
        country: ListOfCity.SRB,
        YoutubeLink: "https://www.youtube.com/watch?v=JDU_q_ZjfW0&ab_channel=APIANOCONCERTOSERIES",
        event: [ListOfEventAchiever["2023CLASSICSRBY"]]
    },
    {
        name: "Clayton Oliver Hayasi",
        image: saphireAchievers26,
        country: ListOfCity.JKT,
        YoutubeLink: "https://www.youtube.com/watch?v=Fke-4LVyGno&ab_channel=APIANOCONCERTOSERIES",
        event: [ListOfEventAchiever["2023CLASSICJKT"]]
    },
    {
        name: "Michael Phillipe Andree",
        image: saphireAchievers25,
        country: ListOfCity.SRB,
        YoutubeLink: "https://www.youtube.com/watch?v=9Xgu6PLNNg0&ab_channel=APIANOCONCERTOSERIES",
        event: [ListOfEventAchiever["2023CLASSICSRBY"]]
    },
    {
        name: "Kaleb Yuseli",
        image: saphireAchievers27,
        country: ListOfCity.SLT,
        YoutubeLink: "https://www.youtube.com/watch?v=OrQ2tsXxe6o&ab_channel=APIANOCONCERTOSERIES",
        event: [ListOfEventAchiever["2023CLASSICJKT"]]
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
                                <div style={{ fontSize: "3vmin" }}>
                                    2023 HIGHLIGHTS
                                </div>
                                <div style={{ fontSize: "5vmin", lineHeight: "5vmin", marginBottom: "3vmin", fontStyle: "italic" }}>
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