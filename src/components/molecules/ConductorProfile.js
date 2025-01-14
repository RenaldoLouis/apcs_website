import React from "react";
import AnimatedComponent from "../atom/AnimatedComponent";
import { flagIcon } from "../../utils/Utils";
import { useTranslation } from "react-i18next";

const ConductorProfile = (props) => {
    const { title, desc, eventYear, eventName, titleUser = null, country = null, withSeeMore = false, link } = props

    const handleOpenLink = () => {
        window.open(link, '_blank');
    }

    const { t } = useTranslation();

    return (
        <div className="col" style={{ color: "white" }}>
            <AnimatedComponent animationClass="animate__fadeInDown">
                <div className="mangolaineFont lineHeightNormal text-align-justify" style={{ fontSize: 40 }}>
                    {title}
                </div>

                {titleUser && (
                    <div className="text-align-justify" style={{ fontSize: 20 }}>
                        {titleUser}
                    </div>
                )}

                {country && (
                    <div className="d-flex" style={{ marginTop: 16 }}>
                        <img src={flagIcon(country)} alt={"country"} />
                    </div>
                )}

                <div className="text-align-justify" style={{ marginTop: 30 }}>
                    {desc}
                </div>

                {withSeeMore && (
                    <div onClick={handleOpenLink} className="see-more-btn" style={{ display: 'flex', width: "fit-content" }}>
                        ... {t("seeMore")}
                    </div>
                )}

                <div className="text-align-justify" style={{ marginTop: 30 }}>
                    {eventYear}<br />
                    <span className="italicText">   {eventName}</span>
                </div>
            </AnimatedComponent>
        </div>

    )
}

export default ConductorProfile;