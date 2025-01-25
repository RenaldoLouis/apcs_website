import React from "react";
import SapphireWinnerSection from "./SapphireWinnerSection";
import achieverBackground from "../../assets/images/achieverBackground.jpg"
import saphireAchieverText from "../../assets/images/saphireAchieverText.svg"
import PillButton from "../../components/atom/PillButton";
import { dataDiamond } from "../../constant/datas/DiamondAchieverData";
import CoverImageHome from "../../components/molecules/CoverImageHome";
import { ContentPosition } from "../../constant/ContentPosition";
import AnimatedComponent from "../../components/atom/AnimatedComponent";
import { useTranslation } from "react-i18next";
import { SapphireWinners } from "../../constant/datas/SaphireAchieverData";

const handleOpenYoutube = () => {
    window.open("https://www.youtube.com/@apcsmusic", '_blank');
}

const Achievers = () => {
    const { t } = useTranslation();
    return (
        <div>
            <CoverImageHome background={achieverBackground}
                logo={saphireAchieverText}
                position={ContentPosition.MIDDLE50}
                content={
                    <>
                        <AnimatedComponent animationClass="animate__fadeIn">
                            <div style={{ marginLeft: "8vw", color: "white" }}>
                                <div style={{ fontSize: "2vmin" }}>
                                    2023 HIGHLIGHTS
                                </div>
                                <div style={{ fontSize: "4vmin", lineHeight: "5vmin", marginBottom: "3vmin", fontStyle: "italic" }}>
                                    Christmas<br />
                                    Wonderland
                                </div>
                                <div>
                                    <PillButton text={t("watchPerform")} onClick={handleOpenYoutube} />
                                </div>
                            </div>
                            <div />
                        </AnimatedComponent>
                    </>
                }
            />
            <SapphireWinnerSection dataSaphire={SapphireWinners} dataDiamond={dataDiamond} />
        </div>
    )
}

export default Achievers;