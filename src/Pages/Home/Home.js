import React from "react";
import PillButton from "../../components/atom/PillButton";
import goldenLine from "../../assets/images/goldenLine.png"
import LetUsGuideTo from "./LetUsGuideTo";
import pianoKeys from '../../assets/images/pianoKeys.svg';
import musicForEveryone from "../../assets/images/musicForEveryone.svg"
import firdyHomeScreen from "../../assets/images/firdyHomeScreen.svg"
import experienceHomeCropped from "../../assets/images/experienceHomeCropped.jpg"
import christmasBanner from "../../assets/images/homeBanner/christmasBanner.jpg"
import Carousel from "../../components/molecules/CarouselCustom";
import apcLogoBold from "../../assets/images/apc_logo_bold.svg"
import homeScreen from "../../assets/images/homeScreenImage.jpg"
import CoverImageHome from "../../components/molecules/CoverImageHome";
import AnimatedComponent from "../../components/atom/AnimatedComponent";
import { AnimationClass } from "../../constant/AnimationClass";
import { useTranslation } from "react-i18next";

const Home = (props) => {
    const { t, i18n } = useTranslation();
    const handleDirectToWhatsApp = () => {
        window.open("https://api.whatsapp.com/send/?phone=6285811192228", '_blank');
    }

    const { audio } = props
    return (
        <>
            <CoverImageHome background={homeScreen} logo={apcLogoBold} />

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
                                        An annual music series, designed in a thematic project and constructed in a piano concerto format where the pianist as the central maestro complemented by the orchestra and conductor.
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
                    <div style={{ color: 'white', width: 370 }}>
                        We offer a prestigious stage for musicians of all ages and levels to share their deep passion for music with audiences

                        <div style={{ marginTop: 24 }}>
                            <PillButton text={"see our story"} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="image-container-fadedTopBottom autoHeight">
                <img loading="lazy" src={experienceHomeCropped} alt={`experienceHomeCropped`} style={{ width: "100%" }} />

                <div className="experienceDesc">
                    <AnimatedComponent animationClass={AnimationClass.fadeIn}>
                        <div style={{ color: 'white' }}>
                            <div className="mangolaineFont" style={{ fontSize: 96, color: "#FFF2DB" }}>
                                Expereience APCS
                            </div>
                            <div >
                                We bring different experience on each series to give every musicians unforgettable live
                            </div>
                            <div >
                                performances. We can’t wait to welcome you to our next musical Journey.
                            </div>
                            <div className="flex justify-center" style={{ marginTop: 24 }}>
                                <PillButton text={"JOIN US"} />
                            </div>
                        </div>
                    </AnimatedComponent>
                </div>
            </div>

            <div className="image-container-fadedTopBottom autoHeight">
                <img loading="lazy" src={firdyHomeScreen} alt={`firdyHomeScreen`} style={{ width: "100%" }} />

                <div className="musicForEveryone">
                    <img loading="lazy"
                        src={musicForEveryone}
                        alt="apcsLogo"
                        style={{ width: "35%", visibility: "hidden" }}
                    />
                    <div style={{ color: 'white', width: "35vw", textAlign: "center" }}>
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