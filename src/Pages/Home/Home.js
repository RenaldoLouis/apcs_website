import React, { useEffect } from "react";
import PillButton from "../../components/atom/PillButton";
import goldenLine from "../../assets/images/goldenLine.png"
import LetUsGuideTo from "./LetUsGuideTo";
import pianoKeys from '../../assets/images/pianoKeys.svg';
import musicForEveryone from "../../assets/images/musicForEveryone.svg"
import musicForEveryoneID from "../../assets/images/musicForEveryoneID.svg"
import experienceHomeCropped from "../../assets/images/experienceHomeCropped.jpg"
import Carousel from "../../components/molecules/CarouselCustom";
import apcLogoBold from "../../assets/images/apc_logo_bold.svg"
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
import { useAuth } from "../../context/DataContext";
import { logEvent } from "firebase/analytics";
import { analytics } from "../../firebase";

const listOfSponsor = [
    sponsor1, sponsor6, sponsor8, sponsor4
]
const listOfSponsor2 = [
    sponsor5, sponsor2, sponsor7, sponsor9, sponsor3
]

const completeListOfSponsor = [
    sponsor1, sponsor6, sponsor8, sponsor4, sponsor5, sponsor2, sponsor7, sponsor9, sponsor3
]

const Home = (props) => {
    const { homeImagehero } = props
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    const { isMobileAndSmaller } = useAuth();

    const handleMovePage = (path) => {
        window.scrollTo(0, 0);
        navigate(path);
    }

    useEffect(() => {
        logEvent(analytics, 'visit_Home');
    }, [])

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
                                    <div className="fontSizeDesktopOnlyHeader" style={{ color: "white" }}>
                                        {t("home1")}
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
                    <img loading="lazy" src={i18n.language === "en" ? musicForEveryone : musicForEveryoneID} alt="apcsLogo" style={{ width: "35%" }} />
                    <div className="weOfferContainer" style={{ color: 'white' }}>
                        <AnimatedComponent animationClass={AnimationClass.fadeIn}>
                            <div className="textWithShadow text-align-justify">
                                {t("home3")}
                            </div>
                            <div style={{ marginTop: "2vmin" }}>
                                <PillButton text={t("home4")} onClick={() => handleMovePage(PathName.about)} />
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
                                {t("home5")}
                            </div>
                            <div className="experienceContentText textWithShadow">
                                {t('home5A')}
                            </div>
                            <div className="flex justify-center" style={{ marginTop: 24 }}>
                                <PillButton text={t("home6")} onClick={() => handleMovePage(PathName.contactUs)} />
                            </div>
                        </div>
                    </AnimatedComponent>
                </div>
            </div>

            <JuryCarousel />




            <div class="container-fluid" style={{ background: "black" }}>
                <div class="row">
                    <div class="col  mangolaineFont goldenTextColor text-align-center" style={{ fontSize: '9vmin' }}>
                        OUR LATEST EVENTS
                    </div>
                </div>
            </div>
            <Carousel />

            {isMobileAndSmaller ? (
                <div className="container" style={{ background: "black" }}>
                    <div className="row text-align-center ">
                        <div className="col gx-5 gy-3">
                            {completeListOfSponsor.map((eachSponsor, index) => (
                                <img className="mb-2" src={eachSponsor} alt={"eachSponsor"} style={{ marginRight: 12, width: index === 1 ? "18vmin" : index === 3 ? "13vmin" : index === 6 ? "10vmin" : "12vmin" }} />
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="container" style={{ background: "black" }}>
                        <div className="row text-align-center">
                            <div className="col">
                                {listOfSponsor.map((eachSponsor, index) => (
                                    <img src={eachSponsor} alt={"eachSponsor"} className=" me-5" style={{ width: index === 1 ? "18vmin" : index === 3 ? "13vmin" : "15vmin" }} />
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
                </>
            )}

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
        </div >
    )
}

export default Home;