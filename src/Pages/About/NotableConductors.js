import React from "react";
// import textureBackground from "../../assets/images/textureBackground.png"
import notableConductorBackground from "../../assets/images/notableConductorBackground.png"
import wishnuProfile from "../../assets/images/wishnuProfile.svg"
import chikita from "../../assets/images/chikita.svg"
import nadyaAdvisor from "../../assets/images/nadyaAdvisor.svg"
import HeaderTitle from "../../components/atom/HeaderTitle";
import ConductorProfile from "../../components/molecules/ConductorProfile";
import AnimatedComponent from "../../components/atom/AnimatedComponent";
import HeaderAbout from "../../components/atom/HeaderAbout";
import { CountryConst } from "../../constant/CountryConst";
import { useAuth } from "../../context/DataContext";
import { useTranslation } from "react-i18next";

const NotableConductors = () => {
    const { isMobileAndSmaller } = useAuth();
    const { t } = useTranslation();
    return (
        <div style={{ position: "relative" }}>
            <div className="NotableConductorContainer" style={{ backgroundImage: `url(${notableConductorBackground})`, backgroundSize: "cover" }}>
                <div className="container" style={{ zIndex: 2, position: "relative" }}>
                    <div style={{ paddingTop: 153 }}>
                        <HeaderTitle>
                            <HeaderAbout title={"CONDUCTORS"} />
                        </HeaderTitle>
                    </div>
                    <div className="text-align-center align-items-center row row-cols-1 row-cols-md-2" style={{ paddingTop: 10 }}>
                        {isMobileAndSmaller ? (
                            <>
                                <div className="col" style={{ color: "white" }}>
                                    <AnimatedComponent animationClass="animate__fadeInDown">
                                        <img loading="lazy" src={wishnuProfile} style={{ width: "100%", height: "100%" }} alt="" />
                                    </AnimatedComponent>
                                </div>

                                <ConductorProfile
                                    title={"WISHNU DEWANTA"}
                                    desc={t("about6")}
                                    eventYear={'APCS 2019 '}
                                    eventName={"The Initial Turning Point"}
                                    country={CountryConst.IDN}
                                />
                            </>
                        ) : (
                            <>

                                <ConductorProfile
                                    title={"WISHNU DEWANTA"}
                                    desc={t("about6")}
                                    eventYear={'APCS 2019 '}
                                    eventName={"The Initial Turning Point"}
                                    country={CountryConst.IDN}
                                />
                                <div className="col" style={{ color: "white" }}>
                                    <AnimatedComponent animationClass="animate__fadeInDown">
                                        <img loading="lazy" src={wishnuProfile} style={{ width: "100%", height: "100%" }} alt="" />
                                    </AnimatedComponent>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="text-align-center align-items-center row row-cols-1 row-cols-md-2" style={{ paddingTop: 60, paddingBottom: 60 }}>
                        <div className="col" style={{ color: "white" }}>
                            <AnimatedComponent animationClass="animate__fadeInDown">
                                <img loading="lazy" src={chikita} style={{ width: "100%", height: "100%" }} alt="" />
                            </AnimatedComponent>
                        </div>
                        <div className="col" style={{ color: "white" }}>
                            <ConductorProfile
                                title={"CHIKITA AMANDA"}
                                desc={t("about7")}
                                eventYear={'APCS 2020, 2022, 2023'}
                                eventName={"Autumn In Korea, Magical Music Soundtrack, Christmas Wonderland"}
                                country={CountryConst.IDN}
                            />
                        </div>
                    </div>

                    <div>
                        <HeaderTitle>
                            <HeaderAbout title={"ACADEMIC ADVISOR"} />
                        </HeaderTitle>
                    </div>

                    <div className="text-align-center align-items-center row row-cols-1 row-cols-md-2" style={{ paddingTop: 10 }}>
                        {isMobileAndSmaller ? (
                            <>
                                <div className="col" style={{ color: "white" }}>
                                    <AnimatedComponent animationClass="animate__fadeInDown">
                                        <img loading="lazy" src={nadyaAdvisor} style={{ width: "100%", height: "100%" }} alt="" />
                                    </AnimatedComponent>
                                </div>
                                <ConductorProfile
                                    title={"NADYA JANITRA"}
                                    titleUser="Academic Advisor"
                                    desc={t("about8")}
                                    eventYear={'Jurist 2023'}
                                    eventName={""}
                                    country={CountryConst.IDN}
                                    withSeeMore={true}
                                    link={"https://www.instagram.com/p/CvEvFaOSOPl/?igsh=NGY1OXdlNDMwZnBw&img_index=2"}
                                />
                            </>
                        ) : (
                            <>
                                <ConductorProfile
                                    title={"NADYA JANITRA"}
                                    titleUser="Academic Advisor"
                                    desc={t("about8")}
                                    eventYear={'Jurist 2023'}
                                    eventName={""}
                                    country={CountryConst.IDN}
                                    withSeeMore={true}
                                    link={"https://www.instagram.com/p/CvEvFaOSOPl/?igsh=NGY1OXdlNDMwZnBw&img_index=2"}
                                />
                                <div className="col" style={{ color: "white" }}>
                                    <AnimatedComponent animationClass="animate__fadeInDown">
                                        <img loading="lazy" src={nadyaAdvisor} style={{ width: "100%", height: "100%" }} alt="" />
                                    </AnimatedComponent>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div >
    )
}
export default NotableConductors