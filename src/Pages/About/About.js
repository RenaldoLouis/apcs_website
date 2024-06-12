import React, { useState } from "react";
import Founder from "./Founder";
import NotableConductors from "./NotableConductors";
import AchieversSection from "./AchieversSection";
import AnimationWWScroll from "../../components/molecules/Animation3dScroll/AnimationWWScroll";
import CoverImage from "../../components/molecules/CoverImage";
import musiciswhatapcs from "../../assets/images/musiciswhatapcs.svg"
import aboutCover from "../../assets/images/AboutCover.svg"
import apcLogo from "../../assets/images/apc_logo.svg"
import goldenLine from "../../assets/images/goldenLine.png"
import michaelaAbout from "../../assets/images/michaelaAbout.svg"
import saphireAbout from "../../assets/images/saphireAbout.svg"
import saphireAchiever from "../../assets/images/saphireAchiever.svg"
import PillButton from "../../components/atom/PillButton";
import { useTranslation } from "react-i18next";


const About = () => {
    const { t, i18n } = useTranslation();

    const [isScrollDownAvailable, setIsScrollDownAvailable] = useState(false)

    return (
        <div>
            {/* <AnimationWWScroll setIsScrollDownAvailable={setIsScrollDownAvailable} /> */}
            <CoverImage background={aboutCover} logo={musiciswhatapcs} isMiddleLeft={true} />
            <div style={{ background: "black", color: "white" }}>
                <div class="container">
                    <div class="row justify-content-md-center text-align-center">
                        <div class="col ">
                            <img src={apcLogo} alt="apcsLogo" style={{ width: 360 }} />

                        </div>
                        <div class="col ">
                            <img src={goldenLine} alt={`goldenLine`} style={{ width: "100%" }} />
                            <div class="boxed-text">
                                A Piano Concerto Series (APCS) is the first musical platform in Indonesia that offers musicians the opportunity to share their music and talents on a prestigious stage. We unite pianists with orchestras and conductors to experience unforgettable performances. APCS aims to be an inclusive platform where musicians of all ages, from all cities, and in all genres are welcome.
                            </div>
                            <img src={goldenLine} alt={`goldenLine`} style={{ width: "100%" }} />
                        </div>
                    </div>


                    <div className="mangolaineFont text-align-center" style={{ color: "#FFCA68", marginTop: 100, fontSize: 64 }}>
                        HERE’S HOW<br />
                        {t("ourStoriesBegin")}
                    </div>
                </div>
            </div>


            <img src={michaelaAbout} alt={`michaelaAbout`} style={{ width: "100%" }} />

            <div style={{ background: "black", color: "white" }}>
                <div class="container">
                    <div class="row justify-content-md-center text-align-center">
                        <div class="col" style={{ fontSize: 40 }}>
                            MICHAELA SUTEJO
                        </div>
                    </div>
                    <div class="row justify-content-md-center text-align-center">
                        <div class="col" style={{ fontSize: 40 }}>
                            Founder of APCS
                        </div>
                    </div>
                    <div class="row justify-content-md-center text-align-center">
                        <div class="col col-lg-8">
                            <img src={goldenLine} alt={`goldenLine`} style={{ width: "60%" }} />
                            <div class="boxed-text">
                                Born in Indonesia, Michaella Sutejo began her musical journey at the age of 9. She achieved Cum Laude honors from Universitas Pelita Harapan in 2017 under the mentorship of Firdy Salim, Ong Seng Choo, and Elaine Waworuntu. Michaella's passion for music was fostered through her participation in national and international competitions, festivals, and masterclasses, including a music camp in Europe.
                            </div>
                            <div class="boxed-text">
                                These experiences and her passion inspired her to create the A Piano Concerto Series Music (APCS) in 2022. Her vision is to grow the potential and set a new benchmark in the music industry, not just locally but globally.
                            </div>
                            <img src={goldenLine} alt={`goldenLine`} style={{ width: "60%" }} />
                        </div>
                    </div>


                    <div className="mangolaineFont text-align-center" style={{ color: "#FFCA68", marginTop: 100, fontSize: 64 }}>
                        WE BRING MUSICIAN TOGETHER
                        <br />
                        TO SHARE THE EXPERIENCE
                    </div>
                </div>
            </div>

            <div style={{ position: "relative" }}>
                <img src={saphireAbout} alt={`saphireAbout`} style={{ width: "100%" }} />
                <div className="registerButtonContainer-bottom" style={{ color: "white" }}>
                    <div>
                        <img src={saphireAchiever} alt={`saphireAchiever`} style={{ width: "100%" }} />
                    </div>
                    <div className="container">
                        <div className="row justify-content-md-center text-align-center">
                            <div className="col col-lg-8">
                                APCS is more than a Piano Concert, it’s an open platform to provide greater access to all musicians. We curated our performers by audition, every participant will be auditioned by notable juries, and contestants who achieve Sapphire Awards are entitled to play with the APCS orchestra.
                            </div>
                        </div>
                    </div>
                    <div>
                        <PillButton text={"View More"} />
                    </div>
                </div>
            </div>


            <Founder />
            <NotableConductors />
            <AchieversSection />
        </div>
    )
}

export default About;