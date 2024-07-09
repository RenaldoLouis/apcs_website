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

const NotableJurist = () => {

    const { isLaptopAndSmaller, isMobileAndSmaller } = useAuth();

    const juristList = [
        {
            image: jurist1,
            name: "CHRISTINE UTOMO",
            title: "Jurist 2023",
            quote: "Praised by Chinese Weibo Weekly Broadcast as the pianist who enthralled her audience with her performance that they willingly immersed themselves into her realm of musical wonder, and that she has truly breathed new life into the classical masterpiece of Rachmaninoff's second piano concerto in C minor*, Dr. Christine Utomo has established her career as soloist and collaborative pianist, and is an active music educator, piano masterclass clinician, and an adjudicator.",
            country: [CountryConst.IDN, CountryConst.CHI],
            link: "https://www.instagram.com/p/CpcHUoUPkeM/?igsh=MXV6ZXl0cG5jNXR4aw%3D%3D&img_index=6"
        },
        {
            image: jurist2,
            name: "ISWARGIA SUDARNO",
            title: "Jurist 2023",
            quote: "Iswargia Renardi Sudarno was born in Bandung, Indonesia, and started his piano lesson there at the age of eleven, with Mrs. Wibanu, Partosiswojo, John Gobée and Oerip S. Santoso. After finishing his bachelor degree in architecture at the Bandung Institute of Technology, he continued his musical education at the Manhattan School of Music in New York, USA, and completed his study with a Master of Music degree, under the tutelage of renowned pianist and pedagog, the late Karl Ulrich Schnabel.",
            country: [CountryConst.IDN],
            link: "https://www.instagram.com/p/CpcHUoUPkeM/?igsh=MXV6ZXl0cG5jNXR4aw%3D%3D&img_index=8"
        },
        {
            image: jurist3,
            name: "MYRA K PRANAJAYA",
            title: "Jurist 2023",
            quote: "Myra Karlina Pranajaya began her piano studies'at the agé of four. A few years later, she began performing in concerts at Symphony Musical Art Center, Lembaga Musik Murni, and Irama Music Studio in Medan, Indonesia. She also performed, for example, at the Indonesian Young Musician Performance Concert, Euro Music Festival and Academy (2019), International Piano Academy Freiburg (2017), MusicAlp International Music Academy in France (2021), and the 13th Summer Academy of Music in Uelzen, Germany (2022), where she performed with the Wratislavia Chamber Orchestra.",
            country: [CountryConst.IDN, CountryConst.DNMRK],
            link: "https://www.instagram.com/p/CpcHUoUPkeM/?igsh=MXV6ZXl0cG5jNXR4aw%3D%3D&img_index=10"
        },
        {
            image: jurist4,
            name: "AMELIA SANTOSO",
            title: "Jurist 2022",
            quote: "Ms. Amelia Santoso is an Indonesian pianist, graduated her Bachelor's degree from Codarts Hogeschool voor de Kunsten (formerly Rotterdam Conservatorium) majoring in classical piano performance (2009), Master's Degree with Nuffic Huygens scholarship full tuition (2011) and her second Master degree at Institut Supérieur de Musique et de Pédagogie in Namur, Belgium (2013). During her musical journey in Europe as soloist and chamber musician, She has performed in Belgium, Malta, Switzerland, South Korea, Japan, Vietnam, and the Netherlands",
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
            quote: "Dr. Martin Kesuma is an award-winning pianist praised for his heartfelt flexibility and harmonic sensitivity (Fanfare Magazine) and clearly articulated playing of the highest order (The Art Music Lounge). He has extensively performed as a solo pianist and chamber musician throughout Asia, Europe and North America. He has been recognized with major prizes in competitions including the San Jose International Piano Competition, Vancouver International Music Competition, PianoHouse International Piano Competition, Betty Dickinson Piano Competition, New York International Music Concours, Canadian International Music Competition, ASEAN International Concerto Competition, Petroff College Level Piano Com-petition, and Texas State International Piano Festival Concerto Competition.",
            country: [CountryConst.IDN, CountryConst.AMR],
            link: "https://www.instagram.com/p/C4pZ41uvxCp/?igsh=MW1pd2tuYWpsN29haw%3D%3D&img_index=5"
        },
        {
            image: jurist6,
            name: "CARLA SUHARTO",
            title: "Jurist 2023",
            quote: "As a solo pianist, chamber musician, and edu-cator. Carla Suharto combines the best of technicality and showmanship. On the piano, she possesses the emotional range and passionate force required to communicate the universality of music for the modern audience.Indonesian by birth. Carla received a full scholarship to study under Iswargia Sudarno at Pelita Harapan University. After graduating summa cum laude in 2014, she continued her studies at Folkwang Universität der Künste in Germany. Under the guidance of Professor Thomas Günther and Yannick Rafalimanana.",
            country: [CountryConst.IDN],
            link: "https://www.instagram.com/p/C4pZ41uvxCp/?igsh=MW1pd2tuYWpsN29haw%3D%3D&img_index=3"
        },
        {
            image: jurist10,
            name: "CHIKITA AMANDA",
            title: "Jurist 2023",
            quote: "Chikita Amanda is a talented Indonesian composer, arranger, and conductor known for her orchestral scores reminiscent of Hollywood and Disney. She has collaborated with prominent musicians such as Topati, Ariel Noah, and Miriam Eka. Her talents have also been recognized internationally through contributions to the music scoring team of the UK's SKY TV series “Gangs of London.”",
            country: [CountryConst.IDN],
            link: "https://www.instagram.com/p/CvRD0tYhJI8/?igsh=eTZsd21ieXd3eGJ0&img_index=2"
        },
        {
            image: jurist8,
            name: "MICHELLE K BAHARI",
            title: "Jurist 2023",
            quote: "Classical pianist and music educator, Michelle Bahari, received her undergraduate degree in Piano Performance at University Pelita Harapan Conservatory of Music. Furthermore, she completed her Master of Music and Performance Diploma at the Jacobs School of Music, Indiana University to deepen her study both in solo and collaborative performances. During her study at Jacobs School of Music, she was awarded the Artistic Excellence Award and Graduate Associate Instructor Fellowship, which gave her the opportunity to serve as a piano instructor in a secondary piano program for undergraduate level.",
            country: [CountryConst.IDN],
            link: "https://www.instagram.com/p/CpcHUoUPkeM/?igsh=MXV6ZXl0cG5jNXR4aw%3D%3D&img_index=5"
        },
        {
            image: jurist9,
            name: "RM CONDRO KASMOYO",
            title: "Jurist 2023",
            quote: "RM Condro Kasmoyo is an Indonesian violinist, graduated from Institut Kesenian Jakarta majoring in Musicology (2020). During his musical journey, he has been actively participated in Masterclass with Robert Brown (USA), Tjeerd Top (Netherlands), Bagus Wiswakarma (Indonesia), Grace Soedargo (Jakarta), Jean-Paul Minali-Bella (France) and Tatjana Kolchanova (Russia). Starting from 2010 until today, he has been chosen to be the Concertmaster & Assistant Conductor for Erwin Gutawa Orchestra",
            country: [CountryConst.IDN],
            link: "https://www.instagram.com/p/CvRD0tYhJI8/?igsh=eTZsd21ieXd3eGJ0&img_index=3"
        },
    ]

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
                                Head of Jurist
                            </div>

                            <div className="text-align-justify" style={{ fontSize: 20, marginTop: 30 }}>
                                Firdy Salim is an alumnus of the Koninklijk Conservatorium at Den Haag and the Head of Piano at one of the Conservatories of Music in Indonesia, where he teaches piano performance and piano pedagogy. His extensive pedagogical endeavors include fostering growth in both students and fellow educators within the music education community.
                            </div>

                            <div className="text-align-justify mangolaineFont italicText goldenTextColor" style={{ fontSize: 24, marginTop: 20, width: "100%" }}>
                                "Join us at the music festival to showcase your talent, connect with others, and make lasting memories."
                            </div>
                        </AnimatedComponent>
                    </div>
                </div>

                <div style={{ color: "white" }}>
                    <div className="text-align-justify align-items-start row g-5" style={{}}>
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
                            const colClass = "col-12 col-md-4";

                            return (
                                <div className={colClass} style={{ marginBottom: 60 }}>
                                    <div className="jurist-image-container">
                                        <AnimatedComponent animationClass="animate__fadeIn">
                                            <img loading="lazy" src={eachData.image} alt={eachData.name} className="jurist-image" />
                                        </AnimatedComponent>
                                    </div>
                                    <div className="mangolaineFont text-align-center" style={{ fontSize: isMobileAndSmaller ? "7vmin" : isLaptopAndSmaller ? "5vmin" : "3.5vmin", marginBottom: 20 }}>
                                        {eachData.name}
                                    </div>
                                    <div style={{ marginBottom: 20 }}>
                                        {eachData.title}
                                    </div>
                                    <div className="d-flex" style={{ marginBottom: 40 }}>
                                        {eachData.country.map((eachCountry) => (
                                            <img src={flagIcon(eachCountry)} alt={eachCountry} style={{ marginRight: 13 }} />
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
            </div>
        </div >
    )
}
export default NotableJurist