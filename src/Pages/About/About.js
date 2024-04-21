import React from "react";
import CoverImage from "../../components/molecules/CoverImage";
import Founder from "./Founder";
import NotableConductors from "./NotableConductors";

const About = () => {

    return (
        <div>
            <CoverImage />
            <Founder />
            <NotableConductors />
        </div>
    )
}

export default About;