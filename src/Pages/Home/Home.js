import React from "react";
import Navbar from "../../components/atom/navbar";
import Content from "./Content";
import Galery from "../Galery/Galery";
import GalerySlider from "../Galery/GalerySlider";
import Pagination from "../../components/molecules/Pagination";
import Accordion from "../../components/molecules/Accordion";
import AvatarIcon from "../../components/molecules/AvatarIcon";
import Footer from "../../components/molecules/Footer";
import PillButton from "../../components/atom/PillButton";
import CoverImage from "../../components/molecules/CoverImage";
import goldenLine from "../../assets/images/goldenLine.png"
import PeopleReviews from "./PeopleReviews";
import pianoKeys from '../../assets/images/pianoKeys.svg';
import musicForEveryone from "../../assets/images/musicForEveryone.svg"
import firdyHomeScreen from "../../assets/images/firdyHomeScreen.svg"
import experienceHomeCropped from "../../assets/images/experienceHomeCropped.jpg"
import Carousel from "../../components/molecules/CarouselCustom";

const Home = (props) => {
    const handleDirectToWhatsApp = () => {
        window.open("https://api.whatsapp.com/send/?phone=6285811192228", '_blank');
    }

    const { audio } = props
    return (
        <>
            <CoverImage />

            <div className="backgroundBlack homeContentContainer">
                <div className="container">
                    <div className="row justify-center">
                        <div className="col-md-auto ">
                            <img src={goldenLine} alt={`goldenLine`} style={{ width: "100%" }} />
                        </div>
                    </div>
                    <div style={{ margin: "15px 0px" }}>
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
                                    An annual music series, designed in a thematic project and constructed in a piano concerto format where the pianist as the central maestro complemented by the orchestra and conductor.
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-center">
                        <div className="col-md-auto">
                            <img src={goldenLine} alt={`goldenLine`} style={{ width: "100%" }} />
                        </div>
                    </div>
                </div>
            </div>

            <PeopleReviews />

            <div className="image-container-fadedTopBottom autoHeight">
                <img src={pianoKeys} alt={`pianoKeys`} style={{ width: "100%" }} />

                <div className="musicForEveryone">
                    <img src={musicForEveryone} alt="apcsLogo" style={{ width: "35%" }} />
                    <div style={{ color: 'white', width: 370 }}>
                        We offer a prestigious stage for musicians of all ages and levels to share their deep passion for music with audiences

                        <div style={{ marginTop: 24 }}>
                            <PillButton text={"see our story"} />
                        </div>
                    </div>

                </div>
            </div>

            <div className="image-container-fadedTopBottom autoHeight">
                <img src={experienceHomeCropped} alt={`experienceHomeCropped`} style={{ width: "100%" }} />

                <div className="experienceDesc">
                    <div style={{ color: 'white' }}>
                        <div className="mangolaineFont" style={{ fontSize: 96, color: "#FFF2DB" }}>
                            Expereience APCS
                        </div>
                        <div >
                            We bring different experience on each series to give every musicians unforgettable live
                        </div>
                        <div >
                            performances. We can’t wait to welcome you to our next musical Journey.
                        </div>
                        <div className="flex justify-center" style={{ marginTop: 24 }}>
                            <PillButton text={"JOIN US"} />
                        </div>
                    </div>

                </div>
            </div>

            <div className="image-container-fadedTopBottom autoHeight">
                <img src={firdyHomeScreen} alt={`firdyHomeScreen`} style={{ width: "100%" }} />

                <div className="musicForEveryone">
                    <img
                        src={musicForEveryone}
                        alt="apcsLogo"
                        style={{ width: "35%", visibility: "hidden" }}
                    />
                    <div style={{ color: 'white', width: 370, textAlign: "center" }}>
                        <div className="mangolaineFont" style={{ color: "#FFD990" }}>
                            “SAYA YAKIN ANAK-ANAK MUDA INI
                            AKAN MENJADI BINTANG DI MASA YANG MENDATANG.”
                        </div>
                        <div>
                            "Selain itu, persiapannya sangat baik, penampilannya seperti kualitas profesional, fondasinya kuat, terlihat langsung kualitas pesertanya yang sudah lebih siap (yang telah melewati audisi dan memenangkan Diamond / Sapphire).
                            Menurut saya, APCS berkesan sekali"
                        </div>
                        <div style={{ marginTop: 24 }}>
                            - Firdy Salim -
                            <div>
                                jury & conductor
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <Carousel />

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
        </>
    )
}

export default Home;