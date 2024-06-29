import React, { useEffect, useState } from "react";
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
    const [windowDimensions, setWindowDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        const handleResize = () => {
            setWindowDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div>
            {/* <AnimationWWScroll setIsScrollDownAvailable={setIsScrollDownAvailable} /> */}
            <CoverImage background={aboutCover} logo={musiciswhatapcs} isMiddleLeft={true} />
            <div style={{ background: "black", color: "white" }}>
                <div className="container">
                    <div className="row justify-content-md-center text-align-center">
                        <div className="col ">
                            <img className="apcsLogoAbout" loading="lazy" src={apcLogo} alt="apcsLogo" />

                        </div>
                        <div className="col ">
                            <img loading="lazy" src={goldenLine} alt={`goldenLine`} style={{ width: "100%" }} />
                            <div className="boxed-text">
                                A Piano Concerto Series (APCS) is the pioneer of Indonesian musical platforms that offer musicians the opportunity to share their music and talents on a prestigious stage.  APCS is designed for everyone, regardless of the age, nationality, or musical style. We bring pianists, orchestras, and conductors together to create memorable performances. Our passion goes beyond the stage, we are optimists to grow and build a positive impact  for the music industry in  Indonesia and the world beyond.

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
                                Born and raised in Indonesia, Michaela Sutejo started her musical journey at the early age of 9 under Junia. Throughout her development as a musician, she participated in national and international musical competitions, festivals, and masterclasses. In 2017, Michaela graduated with Cum Laude honors from Universitas Pelita Harapan, earning her Bachelor of Arts in Music Education under the tutelage of Firdy Salim, Ong Seng Choo, and Elaine Waworuntu
                            </div>
                            <div className="boxed-text">
                                Drawing on her experiences and passion, Michaela founded A Piano Concerto Series Music (APCS) in 2022. She believes APCS could be a platform that bring musicians together and develops their talents. Today, APCS provides a distinctive opportunity for all musicians to learn and grow their musical journey.
                            </div>
                            <img loading="lazy" src={goldenLine} alt={`goldenLine`} style={{ width: "60%" }} />
                        </div>
                    </div>


                    <div className="mangolaineFont text-align-center webringMusicianText" style={{ color: "#FFCA68", marginTop: 100 }}>
                        WE BRING MUSICIAN TOGETHER
                        <br />
                        TO SHARE THE EXPERIENCE
                    </div>
                </div>
            </div>

            <BackgroundWithText
                image={saphireAbout}
                logo={saphireAchiever}
                text={"We curated our performers by audition, every participant will be preliminary by notable juries, and contestants who achieve Sapphire Awards are entitled to perform with the APCS orchestra."}
                buttonText={"View More"}
                contentPosition={windowDimensions.width <= 768 ? ContentPosition.MIDDLE : ContentPosition.MIDDLEBOTTOM}
            />

            <NotableConductors />
            <NotableJurist />
            <GuestArtist />
            <BackgroundWithText
                image={contactUsPicture}
                text={
                    <div className="mangolaineFont goldenTextColor" style={{ fontSize: 48 }}>
                        BE A PART OF OUR MUSICAL JOURNEY!
                    </div>
                }
                buttonText={"CONTACT US"}
                contentPosition={ContentPosition.MIDDLE}
            />
        </div>
    )
}

export default About;