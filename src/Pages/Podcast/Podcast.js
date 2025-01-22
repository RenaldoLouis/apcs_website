import React from "react";
import podcastBacgkorund from "../../assets/images/podcastBacgkorund.jpg"
import stayTuned from "../../assets/images/stayTuned.png"
import { ContentPosition } from "../../constant/ContentPosition";
import CoverImageHome from "../../components/molecules/CoverImageHome";

const Podcast = () => {

    return (
        <div>
            <CoverImageHome background={podcastBacgkorund} logo={stayTuned}
                position={ContentPosition.MIDDLELEFT}
            />
        </div>
    )
}

export default Podcast;