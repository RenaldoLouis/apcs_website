import React, { useState } from "react";
import CoverImage from "../../components/molecules/CoverImage";
import Founder from "./Founder";
import NotableConductors from "./NotableConductors";
import AchieversSection from "./AchieversSection";
import AnimationWWScroll from "../../components/molecules/Animation3dScroll/AnimationWWScroll";

const About = () => {
    const [isScrollDownAvailable, setIsScrollDownAvailable] = useState(false)

    return (
        <div>
            {/* <CoverImage /> */}
            <AnimationWWScroll setIsScrollDownAvailable={setIsScrollDownAvailable} />
            <Founder />
            <NotableConductors />
            <AchieversSection />
        </div>
    )
}

export default About;