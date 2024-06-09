import React from "react";
import Navbar from "../../components/atom/navbar";
import Content from "./Content";
import Galery from "../Galery/Galery";
import GalerySlider from "../Galery/GalerySlider";
import Pagination from "../../components/molecules/Pagination";
import Accordion from "../../components/molecules/Accordion";
import AvatarIcon from "../../components/molecules/AvatarIcon";
import Footer from "../../components/molecules/Footer";
import CoverImage from "../../components/molecules/CoverImage";
import goldenLine from "../../assets/images/goldenLine.png"
import PeopleReviews from "./PeopleReviews";

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

            <Content
                audio={audio}
            />
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