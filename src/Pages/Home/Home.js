import React from "react";
import PillButton from "../../components/atom/PillButton";
import goldenLine from "../../assets/images/goldenLine.png"
import LetUsGuideTo from "./LetUsGuideTo";
import pianoKeys from '../../assets/images/pianoKeys.svg';
import musicForEveryone from "../../assets/images/musicForEveryone.svg"
import jury1noText from "../../assets/images/jurySlider/jury1noText.svg"
import jury2noText from "../../assets/images/jurySlider/jury2noText.png"
import experienceHomeCropped from "../../assets/images/experienceHomeCropped.jpg"
import Carousel from "../../components/molecules/CarouselCustom";
import apcLogoBold from "../../assets/images/apc_logo_bold.svg"
import homeScreen from "../../assets/images/homeScreenImage.jpg"
import homeScreenImageCropped from "../../assets/images/homeScreenImageCropped.png"
import homeScreenImageGradient from "../../assets/images/homeScreenImageGradient.png"
import CoverImageHome from "../../components/molecules/CoverImageHome";
import AnimatedComponent from "../../components/atom/AnimatedComponent";
import { AnimationClass } from "../../constant/AnimationClass";
import { useTranslation } from "react-i18next";
import JuryCarousel from "../../components/molecules/JuryCarousel";
import { useNavigate } from "react-router-dom";
import { PathName } from "../../constant/PathName";

const Home = (props) => {
    const { homeImagehero } = props
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const handleDirectToWhatsApp = () => {
        window.open("https://api.whatsapp.com/send/?phone=6285811192228", '_blank');
    }

    const handleMovePage = (path) => {
        window.scrollTo(0, 0);
        navigate(path);
    }

    return (
        <>
            <CoverImageHome background={homeImagehero}
                logo={apcLogoBold}
            />

            <div className="backgroundBlack homeContentContainer">
                <div className="container">
                    <div className="row justify-center">
                        <div className="col-md-auto ">
                            <img loading="lazy" src={goldenLine} alt={`goldenLine`} style={{ width: "100%" }} />
                        </div>
                    </div>
                    <div style={{ margin: "15px 0px" }}>
                        <AnimatedComponent animationClass={AnimationClass.fadeIn}>
                            <div className="row justify-center">
                                <div className="col-md-6">
                                    <div className="goldenText mangolaineFont" style={{ fontSize: 40 }}>
                                        A PIANO CONCERTO SERIES
                                    </div>
                                </div>
                            </div>
                            <div className="row justify-center">
                                <div className="col-md-6">
                                    <div style={{ color: "white" }}>
                                        An annual music series that presents the beauty of piano concertos through a thematic project. Led by the conductor and orchestra, we <span className="goldenTextColor">produce</span> the finest piano concerto featuring talented pianists performances.
                                    </div>
                                </div>
                            </div>
                        </AnimatedComponent>
                    </div>
                    <div className="row justify-center">
                        <div className="col-md-auto">
                            <img loading="lazy" src={goldenLine} alt={`goldenLine`} style={{ width: "100%" }} />
                        </div>
                    </div>
                </div>
            </div>

            <LetUsGuideTo />

            <div className="image-container-fadedTopBottom autoHeight">
                <img loading="lazy" src={pianoKeys} alt={`pianoKeys`} style={{ width: "100%" }} />
                <div className="musicForEveryone">
                    <img loading="lazy" src={musicForEveryone} alt="apcsLogo" style={{ width: "35%" }} />
                    <div className="weOfferContainer" style={{ color: 'white' }}>
                        <AnimatedComponent animationClass={AnimationClass.fadeIn}>
                            A Piano Concerto Series (APCS) <span className="goldenTextColor">introduces</span>  the orchestra to new audiences in a fresh and modern way. We present a prestigious stage for musicians of all ages, levels, and nationalities <span className="goldenTextColor">to express their deep passion for music.</span>
                            <div style={{ marginTop: "2vmin" }}>
                                <PillButton text={"see our story"} onClick={() => handleMovePage(PathName.about)} />
                            </div>
                        </AnimatedComponent>
                    </div>
                </div>
            </div>

            <div className="image-container-fadedTopBottom autoHeight">
                <img loading="lazy" src={experienceHomeCropped} alt={`experienceHomeCropped`} style={{ width: "100%" }} />

                <div className="experienceDesc">
                    <AnimatedComponent animationClass={AnimationClass.fadeIn}>
                        <div style={{ color: 'white' }}>
                            <div className="mangolaineFont experinceText" style={{ color: "#FFF2DB" }}>
                                EXPERIENCE APCS
                            </div>
                            <div className="experienceContentText">
                                Each series, we bring different experiences to give every musician unforgettable live
                            </div>
                            <div className="experienceContentText">
                                performances. <span className="">Grow and show your talent on our next musical journey.</span>
                            </div>
                            <div className="flex justify-center" style={{ marginTop: 24 }}>
                                <PillButton text={"JOIN US"} />
                            </div>
                        </div>
                    </AnimatedComponent>
                </div>
            </div>

            {/* <div className="image-container-fadedTopBottom autoHeight">
                <img loading="lazy" src={jury1noText} alt={`jury1noText`} style={{ width: "100%" }} />

                <div className="musicForEveryone">
                    <img loading="lazy"
                        className="d-none d-xl-block"
                        src={musicForEveryone}
                        alt="apcsLogo"
                        style={{ width: "35%", visibility: "hidden" }}
                    />
                    <div className="testimonyContainer" style={{ color: 'white', textAlign: "center" }}>
                        <div className="mangolaineFont" style={{ color: "#FFD990", fontSize: 36 }}>
                            {t("theseAreNotJustYoung")}
                        </div>
                        <div style={{ fontSize: 20, marginTop: 40 }}>
                            {t("withSuchStrong")}
                        </div>
                        <div style={{ marginTop: 24 }}>
                            - Firdy Salim -
                            <div>
                                jury & conductor
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}

            <JuryCarousel />




            <div class="container-fluid" style={{ background: "black" }}>
                <div class="row">
                    <div class="col  mangolaineFont goldenTextColor text-align-center" style={{ fontSize: '9vmin' }}>
                        Venture our events
                    </div>
                </div>
            </div>
            <Carousel />

            {/* <Content
                audio={audio}
            /> */}
            {/* <Galery /> 
            <GalerySlider /> 
            <Pagination />
                     <Accordion /> 

            <div className="container" style={{ background: "grey", width: 300, margin: 25, cursor: "pointer" }} onClick={handleDirectToWhatsApp}>
                         Contact Admin Here
                     </div> 

            <AvatarIcon />  */}
        </>
    )
}

export default Home;