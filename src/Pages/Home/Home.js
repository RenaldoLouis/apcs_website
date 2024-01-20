import React from "react";
import Navbar from "../../components/atom/navbar";
import Content from "./Content";
import Galery from "../Galery/Galery";
import GalerySlider from "../Galery/GalerySlider";

const Home = () => {
    return (
        <div>
            <Navbar />
            <Content />
            <Galery />
            <GalerySlider />
            <div className="footer">
                <p>Footer</p>
            </div>
        </div>
    )
}

export default Home;