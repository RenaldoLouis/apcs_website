import { logEvent } from "firebase/analytics";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import apcLogoBold from "../../assets/images/apc_logo_bold.svg";
import experienceHomeMobile from "../../assets/images/experienceHomeMobile.jpg";
import sponsor13 from "../../assets/images/sponsors/arumii.png";
import sponsor10 from "../../assets/images/sponsors/elevee.png";
import sponsor11 from "../../assets/images/sponsors/saturdays.png";
import sponsor1 from "../../assets/images/sponsors/sponsor1.png";
import sponsor4 from "../../assets/images/sponsors/sponsor4.png";
import sponsor5 from "../../assets/images/sponsors/sponsor5.png";
import sponsor6 from "../../assets/images/sponsors/sponsor6.png";
import sponsor7 from "../../assets/images/sponsors/sponsor7.png";
import sponsor8 from "../../assets/images/sponsors/sponsor8.png";
import sponsor12 from "../../assets/images/sponsors/zojirushi.png";
import webelieveBackground from '../../assets/images/webelieveBackground.jpg';
import AnimatedComponent from "../../components/atom/AnimatedComponent";
import PillButton from "../../components/atom/PillButton";
import Carousel from "../../components/molecules/CarouselCustom";
import CoverImageHomeMobile from '../../components/molecules/CoverImageHomeMobile';
import JuryCarousel from "../../components/molecules/JuryCarousel";
import { AnimationClass } from "../../constant/AnimationClass";
import { PathName } from "../../constant/PathName";
import { useAuth } from "../../context/DataContext";
import { analytics } from "../../firebase";
import LetUsGuideToMobile from './LetUsGuideToMobile';
import ModalEvent from "./ModalEvent";

const listOfSponsor = [
    sponsor1, sponsor10, sponsor6, sponsor11,
]
const listOfSponsor2 = [
    sponsor13, sponsor12, sponsor8, sponsor4, sponsor5, sponsor7
]

const completeListOfSponsor = [
    sponsor1, sponsor10, sponsor6, sponsor11, sponsor13, sponsor12, sponsor8, sponsor4, sponsor5, sponsor7
]

const HomeMobile = (props) => {
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

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
        handleOpen()
    }, [])

    return (
        <div style={{ background: "black" }}>
            <CoverImageHomeMobile background={homeImagehero}
                logo={apcLogoBold}
            />

            <LetUsGuideToMobile />

            <div className="image-container-fadedTopBottom autoHeight" style={{ position: "relative" }}>
                <img loading="lazy" src={webelieveBackground} alt={`webelieveBackground`} style={{ width: "100%" }} />
                <div className="musicForEveryone" style={{ zIndex: 1000 }}>
                    <div className="weOfferContainer" style={{ color: 'white', justifyItems: "center", textAlign: "center" }}>
                        <AnimatedComponent animationClass={AnimationClass.fadeIn}>
                            <div className="font-size-b-mob creamText mangolaineFont textWithShadow" style={{ width: 350, letterSpacing: 3 }}>
                                {t("home3M")}
                            </div>
                        </AnimatedComponent>
                        <AnimatedComponent animationClass={AnimationClass.fadeIn}>
                            <div className="flex justify-center"
                                style={{
                                    color: "#FFF2DB",
                                    position: 'absolute',
                                    transform: 'translate(-50%, 50%)',
                                    width: "350px",
                                    zIndex: 1000
                                }}
                            >
                                <PillButton text={t("home4")} onClick={() => handleMovePage(PathName.about)} />
                            </div>
                        </AnimatedComponent>
                    </div>
                </div>
            </div>

            <div className="image-container-fadedTopBottom autoHeight">
                <img loading="lazy" src={experienceHomeMobile} alt={`experienceHomeMobile`} style={{ width: "100%" }} />

                <div style={{
                    color: "#FFF2DB",
                    position: 'absolute',
                    top: '47%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: "350px",
                    zIndex: 1000
                }}>
                    <AnimatedComponent animationClass={AnimationClass.fadeIn}>
                        <div className="font-size-b-mob mangolaineFont text-align-center textWithShadow" style={{ letterSpacing: 8 }} >
                            EXPERIENCE<br />APCS
                        </div>
                    </AnimatedComponent>
                </div>

                <div
                    className='font-size-m-mob'
                    style={{
                        color: "#FFF2DB",
                        position: 'absolute',
                        top: '77%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: "350px",
                        zIndex: 1000
                    }}>
                    <AnimatedComponent animationClass={AnimationClass.fadeIn}>
                        <div className="textWithShadow" style={{ textAlign: "center" }}>
                            {t("home5")}
                        </div>
                    </AnimatedComponent>
                </div>

                <div
                    className='font-size-m-mob'
                    style={{
                        color: "#FFF2DB",
                        position: 'absolute',
                        top: '84%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: "350px",
                        justifySelf: 'center',
                        zIndex: 1000
                    }}>
                    <AnimatedComponent animationClass={AnimationClass.fadeIn}>
                        <div className="textWithShadow" style={{ justifySelf: "center" }}>
                            {t('home5A')}
                        </div>
                    </AnimatedComponent>
                </div>

                <div style={{
                    color: "#FFF2DB",
                    position: 'absolute',
                    top: '92%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: "350px",
                    zIndex: 1000
                }}>
                    <AnimatedComponent animationClass={AnimationClass.fadeIn}>
                        <div className="flex justify-center">
                            <PillButton text={t("home6")} onClick={() => handleMovePage(PathName.contactUs)} />
                        </div>
                    </AnimatedComponent>
                </div>

            </div>

            <JuryCarousel />

            <div className="container-fluid" style={{ background: "black" }}>
                <div className="row">
                    <div className="col  mangolaineFont goldenTextColor text-align-center" style={{ fontSize: '9vmin' }}>
                        OUR LATEST EVENTS
                    </div>
                </div>
            </div>

            <Carousel />

            {isMobileAndSmaller ? (
                <div className="container" style={{ background: "black", marginTop: 32 }}>
                    <div className="row text-align-center ">
                        <div className="col gx-5 gy-3">
                            {completeListOfSponsor.map((eachSponsor, index) => (
                                <img key={`completeListOfSponsor1-${index}`} className="mb-2" src={eachSponsor} alt={"eachSponsor"} style={{ marginRight: 12, width: index === 1 ? "18vmin" : index === 3 ? "13vmin" : index === 6 ? "10vmin" : "12vmin" }} />
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="container" style={{ background: "black", marginTop: 32 }}>
                        <div className="row text-align-center">
                            <div className="col">
                                {listOfSponsor.map((eachSponsor, index) => (
                                    <img key={`eachSponsor1-${index}`} src={eachSponsor} alt={"eachSponsor"} className=" me-5" style={{ width: index === 1 ? "18vmin" : index === 3 ? "13vmin" : "15vmin" }} />
                                ))}
                            </div>
                        </div>
                        <div className="row text-align-center">
                            <div className="col">
                                {listOfSponsor2.map((eachSponsor, index) => (
                                    <img key={`eachSponsor2-${index}`} src={eachSponsor} alt={"eachSponsor"} className=" me-5" style={{ width: index === 2 ? "8vmin" : "15vmin" }} />
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
            {/* TO DO update View */}
            {/* <ModalEvent
                open={open}
                handleClose={handleClose}
            /> */}
        </div >
    )
}

export default HomeMobile;