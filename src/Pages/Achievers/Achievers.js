import React from "react";
import CoverVideo from "../../components/molecules/CoverVideo";
import SapphireWinnerSection from "./SapphireWinnerSection";
import CoverImage from "../../components/molecules/CoverImage";
import aboutCover from "../../assets/images/AboutCover.jpg"
import musiciswhatapcs from "../../assets/images/musiciswhatapcs.svg"

const Achievers = () => {

    return (
        <div>
            {/* <CoverVideo isVideo={true} /> */}
            <CoverImage background={aboutCover} logo={musiciswhatapcs} isMiddleLeft={false} />
            <SapphireWinnerSection />
        </div>
    )
}

export default Achievers;