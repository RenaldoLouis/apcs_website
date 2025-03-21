import React, { useEffect, useState } from "react";
import NotableConductors from "./NotableConductors";
import AnimationWWScroll from "../../components/molecules/Animation3dScroll/AnimationWWScroll";
import CoverImage from "../../components/molecules/CoverImage";
import musiciswhatapcs from "../../assets/images/musiciswhatapcs.svg"
import aboutCover from "../../assets/images/AboutCover.jpg"
import aboutCover2 from "../../assets/images/aboutCover2.jpg"
import apcLogo from "../../assets/images/apc_logo.svg"
import goldenLine from "../../assets/images/goldenLine.png"
import michaelaAbout from "../../assets/images/michaelaAbout.png"
import saphireAbout from "../../assets/images/saphireAbout.png"
import contactUsPicture from "../../assets/images/contactUsPicture.png"
import saphireAchiever from "../../assets/images/saphireAchiever.svg"
import { useTranslation } from "react-i18next";
import i18n from '../../i18n';
import NotableJurist from "./NotableJurist";
import GuestArtist from "./GuestArtist";
import BackgroundWithText from "../../components/molecules/BacgkroundWithText";
import { ContentPosition } from "../../constant/ContentPosition";
import CoverImageHome from "../../components/molecules/CoverImageHome";
import { useNavigate } from "react-router-dom";
import { PathName } from "../../constant/PathName";

const About = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

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

    const handleDirectToWhatsApp = () => {
        window.open("https://api.whatsapp.com/send/?phone=6282213002686", '_blank');
    }

    const handleMovePage = (path) => {
        window.scrollTo(0, 0);
        navigate(path);
    }

    return (
        <div>
            {/* <AnimationWWScroll setIsScrollDownAvailable={setIsScrollDownAvailable} /> */}
            <CoverImageHome background={aboutCover2}
                logo={musiciswhatapcs}
                position={ContentPosition.MIDDLELEFT40}
                bigLogo={true}
            />
            {/* <CoverImage background={aboutCover} logo={musiciswhatapcs} position={ContentPosition.MIDDLELEFT} /> */}
            <div style={{ background: "black", color: "white" }}>
                <div className="container">
                    <div className="row justify-content-md-center text-align-center">
                        <div className="col ">
                            <img className="apcsLogoAbout" loading="lazy" src={apcLogo} alt="apcsLogo" />

                        </div>
                        <div className="col ">
                            <img loading="lazy" src={goldenLine} alt={`goldenLine`} style={{ width: "100%" }} />
                            <div className="boxed-text">
                                {t("about1")}
                            </div>
                            <img loading="lazy" src={goldenLine} alt={`goldenLine`} style={{ width: "100%" }} />
                        </div>
                    </div>


                    <div className="mangolaineFont text-align-center" style={{ color: "#FFCA68", marginTop: 100, fontSize: 64 }}>
                        Here’s How<br />
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
                                {t("about2")}
                            </div>
                            <div className="boxed-text">
                                {t("about2A")}
                            </div>
                            <div className="boxed-text">
                                {t("about3")}
                            </div>
                            <img loading="lazy" src={goldenLine} alt={`goldenLine`} style={{ width: "60%" }} />
                        </div>
                    </div>


                    <div className="mangolaineFont text-align-center webringMusicianText" style={{ color: "#FFCA68", marginTop: 100 }}>
                        Unveiling The Stars
                        <br />
                        We Discovered  The Musical Gems
                    </div>
                </div>
            </div>

            <BackgroundWithText
                image={saphireAbout}
                logo={saphireAchiever}
                text={<>{t("about4")}</>}
                buttonText={t("viewMore")}
                contentPosition={ContentPosition.MIDDLEBOTTOM}
                buttonOnclick={() => handleMovePage(PathName.achievers)}
            />

            <NotableConductors />
            <NotableJurist />
            <GuestArtist />
            <BackgroundWithText
                image={contactUsPicture}
                text={
                    <div className="mangolaineFont goldenTextColor" style={{ fontSize: "5vmin", marginBottom: 16, whiteSpace: "break-spaces", letterSpacing: 3 }}>
                        BE A PART OF OUR MUSICAL JOURNEY!
                    </div>
                }
                buttonText={t("CONTACT_US")}
                contentPosition={ContentPosition.MIDDLE}
                buttonOnclick={() => handleMovePage(PathName.contactUs)}
            />
        </div>
    )
}

export default About;