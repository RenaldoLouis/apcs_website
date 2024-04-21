import React from "react";
import Navbar from "../../components/atom/navbar";
import Content from "./Content";
import Galery from "../Galery/Galery";
import GalerySlider from "../Galery/GalerySlider";
import Pagination from "../../components/molecules/Pagination";
import Accordion from "../../components/molecules/Accordion";
import AvatarIcon from "../../components/molecules/AvatarIcon";
import Footer from "../../components/molecules/Footer";

const Home = (props) => {
    const handleDirectToWhatsApp = () => {
        window.open("https://api.whatsapp.com/send/?phone=6285811192228", '_blank');
    }

    const { audio } = props
    return (
        <div>
            <Content
                audio={audio}
            />
            {/* <Galery /> */}
            {/* <GalerySlider /> */}
            {/* <Pagination />
            <Accordion /> */}

            {/* <div className="container" style={{ background: "grey", width: 300, margin: 25, cursor: "pointer" }} onClick={handleDirectToWhatsApp}>
                Contact Admin Here
            </div> */}

            {/* <AvatarIcon /> */}
        </div>
    )
}

export default Home;