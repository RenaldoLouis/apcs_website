import { Spin, message } from "antd";
import { logEvent } from "firebase/analytics";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import apis from "../../apis";
import apcLogoBold from "../../assets/images/apc_logo_bold.svg";
import experienceHomeMobile from "../../assets/images/experienceHomeMobile.jpg";
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

const HomeMobile = (props) => {
    const { homeImagehero } = props;
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { isMobileAndSmaller } = useAuth();

    const [sponsorList, setSponsorList] = useState([]);
    const [loadingSponsors, setLoadingSponsors] = useState(true);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        logEvent(analytics, 'visit_Home_Mobile');
    }, []);

    useEffect(() => {
        handleOpen();
    }, []);

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
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div style={{ background: "black" }}>
            <CoverImageHomeMobile
                background={homeImagehero}
                logo={apcLogoBold}
            />

            <LetUsGuideToMobile />

            {/* We Believe Section */}
            <div className="image-container-fadedTopBottom autoHeight" style={{ position: "relative" }}>
                <img
                    loading="lazy"
                    src={webelieveBackground}
                    alt="We Believe Background"
                    style={{ width: "100%" }}
                />
                <div className="musicForEveryone" style={{ zIndex: 1000 }}>
                    <div className="weOfferContainer" style={{ color: 'white', justifyItems: "center", textAlign: "center" }}>
                        <AnimatedComponent animationClass={AnimationClass.fadeIn}>
                            <div
                                className="font-size-b-mob creamText mangolaineFont textWithShadow"
                                style={{
                                    width: '100%',
                                    maxWidth: 350,
                                    letterSpacing: 3,
                                    padding: '0 20px'
                                }}
                            >
                                {t("home3M")}
                            </div>
                        </AnimatedComponent>
                        <AnimatedComponent animationClass={AnimationClass.fadeIn}>
                            <div
                                className="flex justify-center"
                                style={{
                                    color: "#FFF2DB",
                                    position: 'absolute',
                                    left: '50%',
                                    transform: 'translate(-50%, 50%)',
                                    width: "100%",
                                    maxWidth: 350,
                                    zIndex: 1000,
                                    padding: '0 20px'
                                }}
                            >
                                <PillButton
                                    text={t("home4")}
                                    onClick={() => handleMovePage(PathName.about)}
                                />
                            </div>
                        </AnimatedComponent>
                    </div>
                </div>
            </div>

            {/* Experience APCS Section */}
            <div className="image-container-fadedTopBottom autoHeight" style={{ position: 'relative' }}>
                <img
                    loading="lazy"
                    src={experienceHomeMobile}
                    alt="Experience APCS"
                    style={{ width: "100%" }}
                />

                {/* Title */}
                <div style={{
                    color: "#FFF2DB",
                    position: 'absolute',
                    top: '47%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: "100%",
                    maxWidth: 350,
                    zIndex: 1000,
                    padding: '0 20px'
                }}>
                    <AnimatedComponent animationClass={AnimationClass.fadeIn}>
                        <div
                            className="font-size-b-mob mangolaineFont text-align-center textWithShadow"
                            style={{ letterSpacing: 8 }}
                        >
                            EXPERIENCE<br />APCS
                        </div>
                    </AnimatedComponent>
                </div>

                {/* Description 1 */}
                <div
                    className='font-size-m-mob'
                    style={{
                        color: "#FFF2DB",
                        position: 'absolute',
                        top: '77%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: "100%",
                        maxWidth: 350,
                        zIndex: 1000,
                        padding: '0 20px'
                    }}
                >
                    <AnimatedComponent animationClass={AnimationClass.fadeIn}>
                        <div className="textWithShadow" style={{ textAlign: "center" }}>
                            {t("home5")}
                        </div>
                    </AnimatedComponent>
                </div>

                {/* Description 2 */}
                <div
                    className='font-size-m-mob'
                    style={{
                        color: "#FFF2DB",
                        position: 'absolute',
                        top: '84%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: "100%",
                        maxWidth: 350,
                        zIndex: 1000,
                        padding: '0 20px'
                    }}
                >
                    <AnimatedComponent animationClass={AnimationClass.fadeIn}>
                        <div className="textWithShadow" style={{ textAlign: 'center' }}>
                            {t('home5A')}
                        </div>
                    </AnimatedComponent>
                </div>

                {/* CTA Button */}
                <div style={{
                    color: "#FFF2DB",
                    position: 'absolute',
                    top: '92%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: "100%",
                    maxWidth: 350,
                    zIndex: 1000,
                    padding: '0 20px'
                }}>
                    <AnimatedComponent animationClass={AnimationClass.fadeIn}>
                        <div className="flex justify-center">
                            <PillButton
                                text={t("home6")}
                                onClick={() => handleMovePage(PathName.contactUs)}
                            />
                        </div>
                    </AnimatedComponent>
                </div>
            </div>

            <JuryCarousel />

            {/* Our Latest Events */}
            <div className="container-fluid" style={{ background: "black" }}>
                <div className="row">
                    <div
                        className="col mangolaineFont goldenTextColor text-align-center"
                        style={{ fontSize: '9vmin' }}
                    >
                        OUR LATEST EVENTS
                    </div>
                </div>
            </div>

            <Carousel />

            {/* Dynamic Sponsors Section - Mobile Optimized */}
            <div className="container" style={{ background: "black", marginTop: 32, marginBottom: 32, padding: "20px" }}>
                {loadingSponsors ? (
                    <div className="row">
                        <div className="col text-align-center" style={{ padding: "40px 0" }}>
                            <Spin size="large" />
                        </div>
                    </div>
                ) : sponsorList.length > 0 ? (
                    <div
                        style={{
                            display: "grid",
                            // This creates dynamic columns: Minimum 120px wide, expanding to fill space
                            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                            gap: "24px",
                            alignItems: "center",
                            justifyItems: "center",
                            width: "100%"
                        }}
                    >
                        {sponsorList.map((sponsorUrl, index) => (
                            <div
                                key={`sponsor-mobile-${index}`}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '100%',
                                    height: '100px', // Fixed container height for alignment
                                }}
                            >
                                <img
                                    src={sponsorUrl}
                                    alt={`Sponsor ${index + 1}`}
                                    loading="lazy"
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '100%',
                                        width: 'auto',
                                        height: 'auto',
                                        objectFit: 'contain',
                                        filter: 'brightness(0.95)',
                                        transition: 'transform 0.3s ease',
                                        cursor: 'pointer'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                                    onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                                    onError={(e) => {
                                        console.error(`Failed to load sponsor image: ${sponsorUrl}`);
                                        e.target.parentElement.style.display = 'none'; // Hide the parent div if image fails
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="row">
                        <div
                            className="col text-align-center"
                            style={{
                                color: '#999',
                                padding: '40px 0',
                                fontSize: '14px'
                            }}
                        >
                            No sponsors available
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomeMobile;