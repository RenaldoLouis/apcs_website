import React from "react";
import PillButton from "../../components/atom/PillButton";
import goldenLine from "../../assets/images/goldenLine.png"
import LetUsGuideTo from "./LetUsGuideTo";
import pianoKeys from '../../assets/images/pianoKeys.svg';
import musicForEveryone from "../../assets/images/musicForEveryone.svg"
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
import sponsor1 from "../../assets/images/sponsors/sponsor1.png";
import sponsor2 from "../../assets/images/sponsors/sponsor2.png";
import sponsor3 from "../../assets/images/sponsors/sponsor3.png";
import sponsor4 from "../../assets/images/sponsors/sponsor4.png";
import sponsor5 from "../../assets/images/sponsors/sponsor5.png";
import sponsor6 from "../../assets/images/sponsors/sponsor6.png";
import sponsor7 from "../../assets/images/sponsors/sponsor7.png";
import sponsor8 from "../../assets/images/sponsors/sponsor8.png";
import sponsor9 from "../../assets/images/sponsors/sponsor9.png";

const listOfSponsor = [
    sponsor1, sponsor2, sponsor3, sponsor4
]
const listOfSponsor2 = [
    sponsor5, sponsor6, sponsor7, sponsor8, sponsor9
]

const Home = (props) => {
    const { homeImagehero } = props
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const handleDirectToWhatsApp = () => {
        window.open("https://api.whatsapp.com/send/?phone=6282213002686", '_blank');
    }

    const handleMovePage = (path) => {
        window.scrollTo(0, 0);
        navigate(path);
    }

    return (
        <div style={{ background: "black" }}>
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
                                        An annual music series that presents the beauty of piano concertos through a thematic project. Led by the conductor and orchestra, we produce the finest piano concerto featuring talented pianists performances.
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
                            <div className="textWithShadow">
                                A Piano Concerto Series (APCS) introduces the orchestra to new audiences in a fresh and modern way. We present a prestigious stage for musicians of all ages, levels, and nationalities to express their deep passion for music.
                            </div>
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
                            <div className="experienceContentText textWithShadow">
                                Each series, we bring different experiences to give every musician unforgettable live
                            </div>
                            <div className="experienceContentText textWithShadow">
                                performances. <span className="">Grow and show your talent on our next musical journey.</span>
                            </div>
                            <div className="flex justify-center" style={{ marginTop: 24 }}>
                                <PillButton text={"JOIN US"} onClick={() => handleMovePage(PathName.contactUs)} />
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
                        OUR LATEST EVENTS
                    </div>
                </div>
            </div>
            <Carousel />

            <div className="container" style={{ background: "black" }}>
                <div className="row text-align-center">
                    <div className="col">
                        {listOfSponsor.map((eachSponsor) => (
                            <img src={eachSponsor} alt={"eachSponsor"} className=" me-5" style={{ width: "15vmin" }} />
                        ))}
                    </div>
                </div>
                <div className="row text-align-center">
                    <div className="col">
                        {listOfSponsor2.map((eachSponsor, index) => (
                            <img src={eachSponsor} alt={"eachSponsor"} className=" me-5" style={{ width: index === 2 ? "8vmin" : "15vmin" }} />
                        ))}
                    </div>
                </div>
            </div>

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
        </div>
    )
}

export default Home;