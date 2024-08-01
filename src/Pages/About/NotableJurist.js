import React from "react";
import HeaderTitle from "../../components/atom/HeaderTitle";
import jurist0 from "../../assets/images/jurists/jurist0.png"
import jurist1 from "../../assets/images/jurists/jurist1.png"
import jurist2 from "../../assets/images/jurists/jurist2.png"
import jurist3 from "../../assets/images/jurists/jurist3.png"
import jurist4 from "../../assets/images/jurists/jurist4.png"
import jurist5 from "../../assets/images/jurists/jurist5.png"
import jurist6 from "../../assets/images/jurists/jurist6.png"
import jurist7 from "../../assets/images/jurists/jurist7.png"
import jurist8 from "../../assets/images/jurists/jurist8.png"
import jurist9 from "../../assets/images/jurists/jurist9.png"
import jurist10 from "../../assets/images/jurists/jurist10.png"
import ConductorProfile from "../../components/molecules/ConductorProfile";
import AnimatedComponent from "../../components/atom/AnimatedComponent";
import EllipsisText from "../../components/atom/EllipsisText";
import { CountryConst } from "../../constant/CountryConst";
import indFlag from "../../assets/images/indFlag.jpg"
import russiaflag from "../../assets/images/russiaflag.jpg" //estonia
import denmarkflag from "../../assets/images/denmarkflag.jpg" // fidland
import koreaflag from "../../assets/images/koreaflag.jpg"
import chinaflag from "../../assets/images/chinaflag.jpg"
import amrFlag from "../../assets/images/amrFlag.jpg"
import HeaderAbout from "../../components/atom/HeaderAbout";
import { useAuth } from "../../context/DataContext";
import { flagIcon } from "../../utils/Utils";
import { useTranslation } from "react-i18next";

const NotableJurist = () => {

    const { isMobileAndSmaller, isSmallMobileAndSmaller } = useAuth();

    const { t } = useTranslation();

    const juristList = [
        {
            image: jurist1,
            name: "CHRISTINE UTOMO",
            title: "Jurist 2023",
            quote: t("about10"),
            country: [CountryConst.IDN, CountryConst.CHI],
            link: "https://www.instagram.com/p/CpcHUoUPkeM/?igsh=MXV6ZXl0cG5jNXR4aw%3D%3D&img_index=6"
        },
        {
            image: jurist2,
            name: "ISWARGIA SUDARNO",
            title: "Jurist 2023",
            quote: t("about11"),
            country: [CountryConst.IDN],
            link: "https://www.instagram.com/p/CpcHUoUPkeM/?igsh=MXV6ZXl0cG5jNXR4aw%3D%3D&img_index=8"
        },
        {
            image: jurist3,
            name: "MYRA K PRANAJAYA",
            title: "Jurist 2023",
            quote: t("about12"),
            country: [CountryConst.IDN, CountryConst.DNMRK],
            link: "https://www.instagram.com/p/CpcHUoUPkeM/?igsh=MXV6ZXl0cG5jNXR4aw%3D%3D&img_index=10"
        },
        {
            image: jurist4,
            name: "AMELIA SANTOSO",
            title: "Jurist 2022",
            quote: t("about13"),
            country: [CountryConst.IDN],
            link: "https://www.instagram.com/p/Cb4RXpGL4Gf/?igsh=MTIweG85aG83ejFqcw%3D%3D"
        },
        // {
        //     image: jurist5,
        //     name: "NADYA JANITRA",
        //     title: "Jurist 2023",
        //     quote: "Nadya Janitra has both her Bachelor (2011) and Master Degree (2013) from Den Haag Royal Conservatoire, under the guidance of Ellen Corver. Before pursuing her studies in the Netherlands, Nadya debuted her first piano solo recital at 16 years old in Erasmus Huis Jakarta. Known for her musical talent, Nadya had always got the highest mark on each examination she did for 11 consecutive years in Yayasan Pendidikan Musik (YPM). She then graduated with “YPM Artist Award” in 2004 under the guidance of Aisha Adriana Pletscher. After graduating from the Netherlands, she performed many solo recitals in various cities and countries, such as Jakarta, Bali, Surabaya, Yogyakarta, Makassar, Medan, Macau and Den Haag.",
        //     country: [CountryConst.IDN],
        //     link: "https://www.instagram.com/p/CvEvFaOSOPl/?igsh=MW41bzh6cmp4NDl0&img_index=2"
        // },
        {
            image: jurist7,
            name: "MARTIN KESUMA",
            title: "Jurist 2023",
            quote: t("about15"),
            country: [CountryConst.IDN, CountryConst.AMR],
            link: "https://www.instagram.com/p/C4pZ41uvxCp/?igsh=MW1pd2tuYWpsN29haw%3D%3D&img_index=5"
        },
        {
            image: jurist6,
            name: "CARLA SUHARTO",
            title: "Jurist 2023",
            quote: t("about14"),
            country: [CountryConst.IDN],
            link: "https://www.instagram.com/p/C4pZ41uvxCp/?igsh=MW1pd2tuYWpsN29haw%3D%3D&img_index=3"
        },
        {
            image: jurist10,
            name: "CHIKITA AMANDA",
            title: "Jurist 2023",
            quote: t("about7"),
            country: [CountryConst.IDN],
            link: "https://www.instagram.com/p/CvRD0tYhJI8/?igsh=eTZsd21ieXd3eGJ0&img_index=2"
        },
        {
            image: jurist8,
            name: "MICHELLE K BAHARI",
            title: "Jurist 2023",
            quote: t("about16"),
            country: [CountryConst.IDN],
            link: "https://www.instagram.com/p/CpcHUoUPkeM/?igsh=MXV6ZXl0cG5jNXR4aw%3D%3D&img_index=5"
        },
        {
            image: jurist9,
            name: "RM CONDRO KASMOYO",
            title: "Jurist 2023",
            quote: t("about17"),
            country: [CountryConst.IDN],
            link: "https://www.instagram.com/p/CvRD0tYhJI8/?igsh=eTZsd21ieXd3eGJ0&img_index=3"
        },
    ]

    const handleOpenFirdy = () => {
        window.open("https://www.instagram.com/p/CvEvFaOSOPl/?igsh=NGY1OXdlNDMwZnBw&img_index=3", '_blank');
    }


    return (
        <div style={{ background: "black", paddingTop: 70 }} >
            <div className="container" >
                <HeaderTitle>
                    <HeaderAbout title={"JURISTS"} />
                </HeaderTitle>
                <div className="text-align-center align-items-center row row-cols-1 row-cols-md-2" style={{ paddingTop: 10, paddingBottom: 120, margin: 0 }}>
                    <div className="col" style={{ color: "white" }}>
                        <AnimatedComponent animationClass="animate__fadeInDown">
                            <img loading="lazy" src={jurist0} style={{ width: "100%", height: "100%" }} alt="" />
                        </AnimatedComponent>
                    </div>
                    <div className="col" style={{ color: "white" }}>
                        <AnimatedComponent animationClass="animate__fadeInDown">
                            <div className="mangolaineFont lineHeightNormal text-align-justify" style={{ fontSize: 40 }}>
                                FIRDY SALIM
                            </div>
                            <div className="text-align-justify" style={{ fontSize: 20 }}>
                                Head of Jurist & Principal Advisor
                            </div>
                            <div className="d-flex" style={{ marginTop: 16 }}>
                                <img src={flagIcon(CountryConst.IDN)} alt={"country"} />
                            </div>

                            <div className="text-align-justify" style={{ marginTop: 30 }}>
                                {t("about9")}
                            </div>

                            <div onClick={handleOpenFirdy} className="see-more-btn" style={{ display: 'flex', width: "fit-content" }}>
                                ... {t("seeMore")}
                            </div>

                            <div className="text-align-justify mangolaineFont italicText goldenTextColor" style={{ fontSize: 24, marginTop: 20, width: "100%" }}>
                                "Join us at the music festival to showcase your talent, connect with others, and make lasting memories."
                            </div>

                            <div className="text-align-justify mt-2">
                                JURIST 2022, 2023, 2024
                            </div>
                        </AnimatedComponent>
                    </div>
                </div>

                <div className="text-align-justify align-items-start row" style={{ color: "white" }}>
                    {juristList.map((eachData, index, array) => {
                        const flagIcon = (country) => {
                            switch (country) {
                                case CountryConst.DNMRK:
                                    return denmarkflag;

                                case CountryConst.IDN:
                                    return indFlag;

                                case CountryConst.KR:
                                    return koreaflag;

                                case CountryConst.RSA:
                                    return russiaflag;

                                case CountryConst.CHI:
                                    return chinaflag;

                                case CountryConst.AMR:
                                    return amrFlag;

                                default:
                                    return indFlag;

                            }
                        }

                        // Calculate if this is part of the last row
                        const isLastRow = index >= array.length - (array.length % 3 || 3);

                        // Determine the column class based on whether it's the last row
                        // const colClass = isLastRow
                        //     ? `col-12 col-md-4 ${array.length % 3 === 1 ? 'offset-md-4' : array.length % 3 === 2 ? 'offset-md-2' : ''}`
                        //     : "col-12 col-md-4";
                        // const colClass = index === 6 ? "col-12 col-md-4 offset-md-2" : "col-12 col-md-4";
                        const colClass = "col-6 col-md-4";

                        return (
                            <div className={colClass} style={{ marginBottom: 60 }}>
                                <div className="jurist-image-container">
                                    <AnimatedComponent animationClass="animate__fadeIn">
                                        <img loading="lazy" src={eachData.image} alt={eachData.name} className="jurist-image" />
                                    </AnimatedComponent>
                                </div>
                                <div className="mangolaineFont text-align-center" style={{ fontSize: isMobileAndSmaller ? "6vmin" : "3.5vmin", marginBottom: 20 }}>
                                    {eachData.name}
                                </div>
                                <div style={{ marginBottom: 20 }}>
                                    {eachData.title}
                                </div>
                                <div className="d-flex" style={{ marginBottom: 40 }}>
                                    {eachData.country.map((eachCountry) => (
                                        <img src={flagIcon(eachCountry)} alt={eachCountry} style={{ marginRight: 13, width: isMobileAndSmaller ? 35 : 50 }} />
                                    ))}

                                </div>
                                <div>
                                    <EllipsisText quote={eachData.quote} link={eachData.link} />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div >
    )
}
export default NotableJurist