import { logEvent } from "firebase/analytics";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import apis from "../../apis";
import apcLogoBold from "../../assets/images/apc_logo_bold.svg";
import experienceHomeCropped from "../../assets/images/experienceHomeCropped.jpg";
import goldenLine from "../../assets/images/goldenLine.png";
import musicForEveryone from "../../assets/images/musicForEveryone.svg";
import musicForEveryoneID from "../../assets/images/musicForEveryoneID.svg";
import pianoKeys from '../../assets/images/pianoKeys.jpg';
import AnimatedComponent from "../../components/atom/AnimatedComponent";
import PillButton from "../../components/atom/PillButton";
import Carousel from "../../components/molecules/CarouselCustom";
import CoverImageHome from "../../components/molecules/CoverImageHome";
import JuryCarousel from "../../components/molecules/JuryCarousel";
import { AnimationClass } from "../../constant/AnimationClass";
import { PathName } from "../../constant/PathName";
import { useAuth } from "../../context/DataContext";
import { analytics } from "../../firebase";
import HomeMobile from './HomeMobile';
import LetUsGuideTo from "./LetUsGuideTo";

import { Spin, message } from "antd";
import ModalEvent from "./ModalEvent";


const Home = (props) => {
    const { homeImagehero } = props

    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const { isMobileAndSmaller, isSmallMobileAndSmaller } = useAuth();

    const [loadingSponsors, setLoadingSponsors] = useState(true);
    const [sponsorList, setSponsorList] = useState();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        logEvent(analytics, 'visit_Home');
    }, [])

    useEffect(() => {
        handleOpen()
    }, [])

    useEffect(() => {
        fetchSponsors();
    }, []);

    const fetchSponsors = async () => {
        try {
            setLoadingSponsors(true);
            const res = await apis.home.getSponsors();

            if (res.status === 200 && res.data) {
                setSponsorList(res.data);
            }
        } catch (error) {
            console.error("Error fetching sponsors:", error);
            message.error("Failed to load sponsors");
        } finally {
            setLoadingSponsors(false);
        }
    };

    const handleMovePage = (path) => {
        window.scrollTo(0, 0);
        navigate(path);
    }
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (

        isSmallMobileAndSmaller ? (
            <HomeMobile homeImagehero={homeImagehero} />
        ) : (
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

                <div className="container-fluid" style={{ background: "black" }}>
                    <div className="row">
                        <div className="col  mangolaineFont goldenTextColor text-align-center" style={{ fontSize: '9vmin' }}>
                            OUR LATEST EVENTS
                        </div>
                    </div>
                </div>

                <Carousel />

                <div className="container" style={{ background: "black", marginTop: 32, marginBottom: 32 }}>
                    {loadingSponsors ? (
                        <div className="row">
                            <div className="col text-align-center" style={{ padding: "40px 0" }}>
                                <Spin size="large" />
                            </div>
                        </div>
                    ) : sponsorList?.length > 0 ? (
                        <div className="row justify-content-center align-items-center g-4">
                            {sponsorList.map((sponsorUrl, index) => (
                                <div
                                    key={`sponsor-${index}`}
                                    className={`col-auto`}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <img
                                        src={sponsorUrl}
                                        alt={`Sponsor ${index + 1}`}
                                        loading="lazy"
                                        style={{
                                            maxWidth: isMobileAndSmaller ? '120px' : '180px',
                                            maxHeight: isMobileAndSmaller ? '80px' : '120px',
                                            width: 'auto',
                                            height: 'auto',
                                            objectFit: 'contain',
                                            filter: 'brightness(0.95)',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.filter = 'brightness(1.1)';
                                            e.target.style.transform = 'scale(1.05)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.filter = 'brightness(0.95)';
                                            e.target.style.transform = 'scale(1)';
                                        }}
                                        onError={(e) => {
                                            console.error(`Failed to load sponsor image: ${sponsorUrl}`);
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="row">
                            <div className="col text-align-center" style={{ color: '#999', padding: '40px 0' }}>
                                No sponsors available
                            </div>
                        </div>
                    )}
                </div>
                <ModalEvent
                    open={open}
                    handleClose={handleClose}
                />
            </div >
        )


    )
}

export default Home;