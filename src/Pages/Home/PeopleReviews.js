import React from "react";
import background2 from '../../assets/images/Background2.svg';
import taleMusicalJourney from "../../assets/images/TaleMusicalJourney.svg"
import letUsGuideYou from "../../assets/images/LetUsGuideYou.svg"


const PeopleReviews = () => {

    return (
        <div className="image-container-fadedTopBottom autoHeight">
            <img loading="lazy" src={background2} alt={`background2`} style={{ width: "100%", marginBottom: "-3px" }} />


            <div className="letUsGuideYou">
                <img loading="lazy" src={letUsGuideYou} alt="apcsLogo" style={{ width: 360 }} />
            </div>

            <div className="taleMusical">
                <img loading="lazy" src={taleMusicalJourney} alt="apcsLogo" style={{ width: 995 }} />
            </div>
        </div>
    )
}

export default PeopleReviews;