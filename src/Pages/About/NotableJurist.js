import { useTranslation } from "react-i18next";
import amrFlag from "../../assets/images/amrFlag.jpg";
import chinaflag from "../../assets/images/chinaflag.jpg";
import denmarkflag from "../../assets/images/denmarkflag.jpg"; // fidland
import estoniaFlag from "../../assets/images/estoniaFlag.png";
import finlandFlag from "../../assets/images/finlandFlag.png";
import japanFlag from "../../assets/images/Flag_of_Japan.png";
import hongkongFLag from "../../assets/images/hongkongFlag.png";
import hungaryFlag from "../../assets/images/hungaryFlag.png";
import indFlag from "../../assets/images/indFlag.jpg";
import italyFlag from "../../assets/images/italyFlag.png";
import jurist0 from "../../assets/images/jurists/jurist0.png";
import jurist1 from "../../assets/images/jurists/jurist1.png";
import jurist10 from "../../assets/images/jurists/jurist10.png";
import jurist11 from "../../assets/images/jurists/jurist11.png";
import jurist12 from "../../assets/images/jurists/jurist12.png";
import jurist13 from "../../assets/images/jurists/jurist13.png";
import jurist14 from "../../assets/images/jurists/jurist14.png";
import jurist15 from "../../assets/images/jurists/jurist15.png";
import jurist16 from "../../assets/images/jurists/jurist16.png";
import jurist17 from "../../assets/images/jurists/jurist17.png";
import jurist18 from "../../assets/images/jurists/jurist18.png";
import jurist19 from "../../assets/images/jurists/jurist19.png";
import jurist2 from "../../assets/images/jurists/jurist2.png";
import jurist20 from "../../assets/images/jurists/jurist20.png";
import jurist21 from "../../assets/images/jurists/jurist21.png";
import jurist22 from "../../assets/images/jurists/jurist22.png";
import jurist23 from "../../assets/images/jurists/jurist23.png";
import jurist24 from "../../assets/images/jurists/Jurist24.png";
import jurist25 from "../../assets/images/jurists/Jurist25.png";
import jurist3 from "../../assets/images/jurists/jurist3.png";
import jurist4 from "../../assets/images/jurists/jurist4.png";
import jurist6 from "../../assets/images/jurists/jurist6.png";
import jurist7 from "../../assets/images/jurists/jurist7.png";
import jurist8 from "../../assets/images/jurists/jurist8.png";
import jurist9 from "../../assets/images/jurists/jurist9.png";
import koreaflag from "../../assets/images/koreaflag.jpg";
import russiaflag from "../../assets/images/russiaflag.jpg"; //estonia
import singaporeFlag from "../../assets/images/singaporeFlag.png";
import turkeyFlag from "../../assets/images/turkeyFlag.png";
import AnimatedComponent from "../../components/atom/AnimatedComponent";
import EllipsisText from "../../components/atom/EllipsisText";
import HeaderAbout from "../../components/atom/HeaderAbout";
import HeaderTitle from "../../components/atom/HeaderTitle";
import { CountryConst } from "../../constant/CountryConst";
import { useAuth } from "../../context/DataContext";
import { flagIcon } from "../../utils/Utils";

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
            title: "Jurist 2024 & 2025",
            quote: t("about15"),
            country: [CountryConst.IDN, CountryConst.AMR],
            link: "https://www.instagram.com/p/C4pZ41uvxCp/?igsh=MW1pd2tuYWpsN29haw%3D%3D&img_index=5"
        },
        {
            image: jurist6,
            name: "CARLA SUHARTO",
            title: "Jurist 2024",
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
        {
            image: jurist11,
            name: "NOZOMI HIWATASHI",
            title: "Jurist 2025",
            quote: t("about19"),
            country: [CountryConst.JP],
            link: "https://www.instagram.com/p/DJtLrHZBUOo/?img_index=3&igsh=MXJ3NXdncTA3c3pqdQ%3D%3D"
        },
        {
            image: jurist12,
            name: "AARON KURZ",
            title: "Jurist 2025",
            quote: t("about20"),
            country: [CountryConst.AMR],
            link: "https://www.instagram.com/p/DJW1yq4Bj34/?img_index=2&igsh=MTlrcWpjNW53cjdxMQ%3D%3D"
        },
        {
            image: jurist13,
            name: "DR. JIN YUN",
            title: "Jurist 2025",
            quote: t("about21"),
            country: [CountryConst.KR],
            link: "https://www.instagram.com/p/DJqT3uUBAP-/?igsh=MW1mYmsyZjg2cTR5NA%3D%3D&img_index=3"
        },
        {
            image: jurist14,
            name: "LIVIA SCHWEIZER",
            title: "Jurist 2025",
            quote: t("about22"),
            country: [CountryConst.ITL, CountryConst.FIN],
            link: "https://www.instagram.com/p/DJqT3uUBAP-/?igsh=MW1mYmsyZjg2cTR5NA%3D%3D&img_index=3"
        },
        {
            image: jurist15,
            name: "HSIEH MENG FU",
            title: "Jurist 2025",
            quote: t("about23"),
            country: [CountryConst.CHI],
            link: "https://www.instagram.com/p/DJqT3uUBAP-/?igsh=MW1mYmsyZjg2cTR5NA%3D%3D&img_index=3"
        },
        {
            image: jurist16,
            name: "András Dénes",
            title: "Jurist 2025",
            quote: t("about24"),
            country: [CountryConst.HUN],
            link: "https://www.instagram.com/p/DKgWHIhhL-E/?img_index=2"
        },
        {
            image: jurist17,
            name: "Bálint Képiró",
            title: "Jurist 2025",
            quote: t("about25"),
            country: [CountryConst.HUN],
            link: "https://www.instagram.com/p/DKgWHIhhL-E/?img_index=3"
        },
        {
            image: jurist18,
            name: "Theduardo Prasetyo",
            title: "Jurist 2025",
            quote: t("about26"),
            country: [CountryConst.IDN],
            link: "https://www.instagram.com/p/DKgRu_KBOGO/?img_index=2"
        },
        {
            image: jurist19,
            name: "YIFEI PEI",
            title: "Jurist 2025",
            quote: t("about27"),
            country: [CountryConst.CHI],
            link: "https://www.instagram.com/p/DKgRu_KBOGO/?img_index=3"
        },
        {
            image: jurist20,
            name: "KAREN TAY",
            title: "Jurist 2025",
            quote: t("about29"),
            country: [CountryConst.SR],
            link: "https://www.instagram.com/p/DJ_bzFdhHr2/?img_index=2"
        },
        {
            image: jurist21,
            name: "NATALIE LO",
            title: "Jurist 2025",
            quote: t("about28"),
            country: [CountryConst.HK],
            link: "https://www.instagram.com/p/DJ_bzFdhHr2/?img_index=3"
        },
        {
            image: jurist23,
            name: "Vahur Luhtsalu",
            title: "Jurist 2025",
            quote: t("about30"),
            country: [CountryConst.EST],
            link: "https://www.instagram.com/p/DKyvVwTBS-h/?img_index=3"
        },
        {
            image: jurist22,
            name: "Öykü Melis Şahin",
            title: "Jurist 2025",
            quote: t("about31"),
            country: [CountryConst.TRK],
            link: "https://www.instagram.com/p/DKyvVwTBS-h/?img_index=2"
        },
        {
            image: jurist24,
            name: "Jennifer Tan",
            title: "Jurist 2025",
            quote: t("about32"),
            country: [CountryConst.IDN],
            link: "https://www.instagram.com/p/DKr4wOFB4_O/?img_index=2"
        },
        {
            image: jurist25,
            name: "Jessica januar",
            title: "Jurist 2025",
            quote: t("about33"),
            country: [CountryConst.IDN],
            link: "https://www.instagram.com/p/DKr4wOFB4_O/?img_index=3"
        },
    ]

    const handleOpenFirdy = () => {
        window.open("https://www.instagram.com/p/C4pZ41uvxCp/?igsh=MW1pd2tuYWpsN29haw%3D%3D&img_index=2", '_blank');
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
                                Head Adjudicator & Principal Advisor
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

                            <div className="text-align-justify mangolaineFont italicText goldenTextColor" style={{ fontSize: 29, marginTop: 20, width: "100%" }}>
                                "Join us at the music festival to showcase your talent, connect with others, and make lasting memories."
                            </div>

                            <div className="text-align-justify mt-2">
                                Jurist 2022, 2023, 2024
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

                                case CountryConst.JP:
                                    return japanFlag;

                                case CountryConst.ITL:
                                    return italyFlag;

                                case CountryConst.FIN:
                                    return finlandFlag;

                                case CountryConst.HUN:
                                    return hungaryFlag;

                                case CountryConst.HK:
                                    return hongkongFLag;

                                case CountryConst.SR:
                                    return singaporeFlag;

                                case CountryConst.TRK:
                                    return turkeyFlag;

                                case CountryConst.EST:
                                    return estoniaFlag;

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
                                    {eachData.name.toUpperCase()}
                                </div>
                                <div style={{ marginBottom: 20 }}>
                                    {eachData.title}
                                </div>
                                <div className="d-flex" style={{ marginBottom: 40 }}>
                                    {eachData.country.map((eachCountry, index) => (
                                        <img key={`country-${index}`} src={flagIcon(eachCountry)} alt={eachCountry} style={{ height: 26, marginRight: 13, width: isMobileAndSmaller ? 35 : 50 }} />
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