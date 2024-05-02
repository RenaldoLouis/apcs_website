import React from "react";
import CoverImage from "../../components/molecules/CoverImage";
import Founder from "./Founder";
import NotableConductors from "./NotableConductors";
import AchieversSection from "./AchieversSection";
import AnimationWWScroll from "../../components/molecules/Animation3dScroll/AnimationWWScroll";

const About = () => {

    return (
        <div>
            {/* <CoverImage /> */}
            <AnimationWWScroll />
            <Founder />
            <NotableConductors />
            <AchieversSection />
        </div>
    )
}

export default About;