import React from "react";
import Navbar from "../../components/atom/navbar";
import Content from "./Content";
import Galery from "../Galery/Galery";
import GalerySlider from "../Galery/GalerySlider";
import Pagination from "../../components/molecules/Pagination";
import Accordion from "../../components/molecules/Accordion";

const Home = (props) => {
    const { audio } = props
    return (
        <div>
            <Navbar />
            <Content
                audio={audio}
            />
            <Galery />
            <GalerySlider />
            <Pagination />
            <Accordion />
            <footer className="footer">
                <p>Footer</p>
            </footer>
        </div>
    )
}

export default Home;