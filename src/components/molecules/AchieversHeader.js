import React, { useContext } from "react";
import lineAchievers from "../../assets/images/lineAchievers.png"
import { useAuth } from "../../context/DataContext";
import { ResponsiveText } from "../atom/ResponsiveText";
import { useTranslation } from "react-i18next";
import { Box } from '@mui/material';

const AchieversHeader = (props) => {
    const { title, subTitle, description, description2, description3, image } = props

    const { isMobileAndSmaller } = useAuth()

    const { t, i18n } = useTranslation();

    return (
        <Box className="container" sx={{ mb: { xs: 3, sm: 6, md: 10, lg: 15 } }}>
            <div className="row justify-center">
                <div className="col-md-auto ">
                    <img loading="lazy" src={lineAchievers} alt={`lineAchievers`} style={{ width: "100%" }} />
                </div>
            </div>
            <div className="row justify-center place-items-center gx-5" style={{ margin: "47px 0px 47px 0px" }}>
                <div className={`col-md-6 ${isMobileAndSmaller ? "text-align-last-center" : "text-align-last-end"}`}>
                    <img loading="lazy" src={image} alt="apcsLogo" style={{ width: isMobileAndSmaller ? "100%" : "65%" }} />
                </div>
                <div className="col-md-6">
                    <ResponsiveText className="goldenText mangolaineFont" style={{ textAlign: isMobileAndSmaller ? "center" : "justify" }}>
                        {title} <span className={i18n.language === "en" ? "" : "italicText"}> {subTitle}</span>
                    </ResponsiveText>
                    <div style={{ color: "white", fontSize: 18, textAlign: isMobileAndSmaller ? "center" : "justify", marginTop: isMobileAndSmaller ? 15 : 0 }}>
                        {description} <span className={i18n.language === "en" ? "" : "italicText"}> {description2}</span> {description3}
                    </div>
                </div>
            </div>
            <div className="row justify-center">
                <div className="col-md-auto">
                    <img loading="lazy" src={lineAchievers} alt={`lineAchievers`} style={{ width: "100%" }} />
                </div>
            </div>
        </Box>
    )
}

export default AchieversHeader;