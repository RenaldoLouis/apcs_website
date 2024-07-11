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

const NotableConductors = () => {

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
                        <ConductorProfile
                            title={"WISHNU DEWANTA"}
                            desc={"Wishnu Dewanta is a dynamic force in musical theatre, known for his exceptional talent and dedication as a music director. With a passion for storytelling through music, he captivates audiences with innovative arrangements and impeccable musical direction."}
                            eventYear={'APCS 2019 '}
                            eventName={"The Initial Turning Point"}
                            country={CountryConst.IDN}
                        />
                        <div className="col" style={{ color: "white" }}>
                            <AnimatedComponent animationClass="animate__fadeInDown">
                                <img loading="lazy" src={wishnuProfile} style={{ width: "100%", height: "100%" }} alt="" />
                            </AnimatedComponent>
                        </div>
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
                                desc={"Chikita Amanda is a talented Indonesian composer, arranger, and conductor known for her orchestral scores reminiscent of Hollywood and Disney. She has collaborated with prominent musicians such as Tohpati, Ariel Noah, and Mirriam Eka. Her talents have also been recognized internationally through contributions to the music scoring team of the UK's SKY TV series “Gangs of London”."}
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
                        <ConductorProfile
                            title={"NADYA JANITRA"}
                            titleUser="Academic Advisor"
                            desc={"Nadya Janitra is a distinguished pianist who completed both her Bachelor’s (2011) and Master’s (2013) degrees at the Royal Conservatoire in Den Haag under Ellen Corver's guidance.  After graduating from the Netherlands, she performed many solo recitals in various cities and countries, such as Jakarta, Bali, Surabaya, Yogyakarta, Makassar, Medan, Macau and Den Haag."}
                            eventYear={'JURIST 2023'}
                            eventName={""}
                            country={CountryConst.IDN}
                        />
                        <div className="col" style={{ color: "white" }}>
                            <AnimatedComponent animationClass="animate__fadeInDown">
                                <img loading="lazy" src={nadyaAdvisor} style={{ width: "100%", height: "100%" }} alt="" />
                            </AnimatedComponent>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}
export default NotableConductors