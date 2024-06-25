import React, { useState } from "react";
import NotableConductors from "./NotableConductors";
import AnimationWWScroll from "../../components/molecules/Animation3dScroll/AnimationWWScroll";
import CoverImage from "../../components/molecules/CoverImage";
import musiciswhatapcs from "../../assets/images/musiciswhatapcs.svg"
import aboutCover from "../../assets/images/AboutCover.jpg"
import apcLogo from "../../assets/images/apc_logo.svg"
import goldenLine from "../../assets/images/goldenLine.png"
import michaelaAbout from "../../assets/images/michaelaAbout.png"
import saphireAbout from "../../assets/images/saphireAbout.png"
import contactUsPicture from "../../assets/images/contactUsPicture.png"
import saphireAchiever from "../../assets/images/saphireAchiever.svg"
import PillButton from "../../components/atom/PillButton";
import { useTranslation } from "react-i18next";
import i18n from '../../i18n';
import NotableJurist from "./NotableJurist";
import GuestArtist from "./GuestArtist";
import BackgroundWithText from "../../components/molecules/BacgkroundWithText";
import { ContentPosition } from "../../constant/ContentPosition";

const About = () => {
    const { t, i18n } = useTranslation();

    const [isScrollDownAvailable, setIsScrollDownAvailable] = useState(false)

    return (
        <div>
            {/* <AnimationWWScroll setIsScrollDownAvailable={setIsScrollDownAvailable} /> */}
            <CoverImage background={aboutCover} logo={musiciswhatapcs} isMiddleLeft={true} />
            <div style={{ background: "black", color: "white" }}>
                <div className="container">
                    <div className="row justify-content-md-center text-align-center">
                        <div className="col ">
                            <img loading="lazy" src={apcLogo} alt="apcsLogo" style={{ width: 360 }} />

                        </div>
                        <div className="col ">
                            <img loading="lazy" src={goldenLine} alt={`goldenLine`} style={{ width: "100%" }} />
                            <div className="boxed-text">
                                A Piano Concerto Series (APCS) is the first musical platform in Indonesia that offers musicians the opportunity to share their music and talents on a prestigious stage. We unite pianists with orchestras and conductors to experience unforgettable performances. APCS aims to be an inclusive platform where musicians of all ages, from all cities, and in all genres are welcome.
                            </div>
                            <img loading="lazy" src={goldenLine} alt={`goldenLine`} style={{ width: "100%" }} />
                        </div>
                    </div>


                    <div className="mangolaineFont text-align-center" style={{ color: "#FFCA68", marginTop: 100, fontSize: 64 }}>
                        HERE’S HOW<br />
                        {t("ourStoriesBegin")}
                    </div>
                </div>
            </div>


            <img loading="lazy" src={michaelaAbout} alt={`michaelaAbout`} style={{ width: "100%" }} />

            <div style={{ background: "black", color: "white" }}>
                <div className="container">
                    <div className="row justify-content-md-center text-align-center">
                        <div className="col" style={{ fontSize: 40 }}>
                            MICHAELA SUTEJO
                        </div>
                    </div>
                    <div className="row justify-content-md-center text-align-center">
                        <div className="col" style={{ fontSize: 40 }}>
                            Founder of APCS
                        </div>
                    </div>
                    <div className="row justify-content-md-center text-align-center">
                        <div className="col col-lg-8">
                            <img loading="lazy" src={goldenLine} alt={`goldenLine`} style={{ width: "60%" }} />
                            <div className="boxed-text">
                                Born in Indonesia, Michaella Sutejo began her musical journey at the age of 9. She achieved Cum Laude honors from Universitas Pelita Harapan in 2017 under the mentorship of Firdy Salim, Ong Seng Choo, and Elaine Waworuntu. Michaella's passion for music was fostered through her participation in national and international competitions, festivals, and masterclasses, including a music camp in Europe.
                            </div>
                            <div className="boxed-text">
                                These experiences and her passion inspired her to create the A Piano Concerto Series Music (APCS) in 2022. Her vision is to grow the potential and set a new benchmark in the music industry, not just locally but globally.
                            </div>
                            <img loading="lazy" src={goldenLine} alt={`goldenLine`} style={{ width: "60%" }} />
                        </div>
                    </div>


                    <div className="mangolaineFont text-align-center" style={{ color: "#FFCA68", marginTop: 100, fontSize: 64 }}>
                        WE BRING MUSICIAN TOGETHER
                        <br />
                        TO SHARE THE EXPERIENCE
                    </div>
                </div>
            </div>

            <BackgroundWithText
                image={saphireAbout}
                logo={saphireAchiever}
                text={"APCS is more than a Piano Concert, it’s an open platform to provide greater access to all musicians. We curated our performers by audition, every participant will be auditioned by notable juries, and contestants who achieve Sapphire Awards are entitled to play with the APCS orchestra."}
                buttonText={"View More"}
                contentPosition={ContentPosition.MIDDLEBOTTOM}
            />

            <NotableConductors />
            <NotableJurist />
            <GuestArtist />
            <BackgroundWithText
                image={contactUsPicture}
                text={
                    <div className="mangolaineFont goldenTextColor" style={{ fontSize: 48 }}>
                        WE BRING MUSICIAN TOGETHER TO SHARE EXPERIENCE
                    </div>
                }
                buttonText={"CONTACT US"}
                contentPosition={ContentPosition.MIDDLE}
            />
        </div>
    )
}

export default About;