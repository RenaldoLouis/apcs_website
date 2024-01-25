import React from "react";
import Navbar from "../../components/atom/navbar";
import Content from "./Content";
import Galery from "../Galery/Galery";
import GalerySlider from "../Galery/GalerySlider";
import Pagination from "../../components/molecules/Pagination";
import Accordion from "../../components/molecules/Accordion";

const Home = () => {
    return (
        <div>
            <Navbar />
            <Content />
            <Galery />
            <GalerySlider />
            <Pagination />
            <Accordion />
            <div className="footer">
                <p>Footer</p>
            </div>
        </div>
    )
}

export default Home;