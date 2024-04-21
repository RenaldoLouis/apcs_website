import React from "react";
import CoverImage from "../../components/molecules/CoverImage";
import Founder from "./Founder";
import NotableConductors from "./NotableConductors";
import AchieversSection from "./AchieversSection";

const About = () => {

    return (
        <div>
            <CoverImage />
            <Founder />
            <NotableConductors />
            <AchieversSection />
        </div>
    )
}

export default About;