import { message } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import achieverBackground from "../../assets/images/achieverBackground.jpg";
import saphireAchieverText from "../../assets/images/saphireAchieverText.svg";
import AnimatedComponent from "../../components/atom/AnimatedComponent";
import PillButton from "../../components/atom/PillButton";
import CoverImageHome from "../../components/molecules/CoverImageHome";
import { ContentPosition } from "../../constant/ContentPosition";
import { SapphireWinners } from "../../constant/datas/SaphireAchieverData";
import { fetchAchieversFromFirestore } from "../../utils/AchieversMigration";
import ContentAchievers from "./ContentAchievers";

const handleOpenYoutube = () => {
    window.open("https://www.youtube.com/@apcsmusic", '_blank');
}

const Achievers = () => {
    const { t } = useTranslation();

    const [dataDiamond, setDataDiamond] = useState([])

    useEffect(() => {
        loadAchievers();
    }, []);

    const loadAchievers = async () => {
        // setLoading(true);
        try {
            const data = await fetchAchieversFromFirestore();
            setDataDiamond(data);
        } catch (error) {
            console.error('Error loading achievers:', error);
            message.error('Failed to load achievers');
        } finally {
            // setLoading(false);
        }
    };

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
            <ContentAchievers dataSaphire={SapphireWinners} dataDiamond={dataDiamond} />
        </div>
    )
}

export default Achievers;