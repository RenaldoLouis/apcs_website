import React, { useState } from "react";
import Founder from "./Founder";
import NotableConductors from "./NotableConductors";
import AchieversSection from "./AchieversSection";
import AnimationWWScroll from "../../components/molecules/Animation3dScroll/AnimationWWScroll";
import CoverImage from "../../components/molecules/CoverImage";
import musiciswhatapcs from "../../assets/images/musiciswhatapcs.svg"
import aboutCover from "../../assets/images/AboutCover.svg"

const About = () => {
    const [isScrollDownAvailable, setIsScrollDownAvailable] = useState(false)

    return (
        <div>
            {/* <AnimationWWScroll setIsScrollDownAvailable={setIsScrollDownAvailable} /> */}
            <CoverImage background={aboutCover} logo={musiciswhatapcs} isMiddleLeft={true} />
            <Founder />
            <NotableConductors />
            <AchieversSection />
        </div>
    )
}

export default About;