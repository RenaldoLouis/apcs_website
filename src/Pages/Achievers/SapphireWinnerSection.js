import React, { useEffect, useState } from "react";
import textureBackground from "../../assets/images/textureBackground.png"
import textureBackgroundLong from "../../assets/images/textureBackgroundLong.png"
import saphireAchieverText from "../../assets/images/saphireAchieverText.svg"
import ProfileToYoutube from "../../components/molecules/ProfileToYoutube";
import AchieversHeader from "../../components/molecules/AchieversHeader";
import diamondAchieversText from "../../assets/images/diamondAchieversText.svg"
import AnimatedComponent from "../../components/atom/AnimatedComponent";
import GoldSection from "./GoldSection";
import { useAuth } from "../../context/DataContext";
import { useTranslation } from "react-i18next";
import { ListOfEventAchiever } from "../../constant/ListOfEventAchiever";

const SapphireWinnerSection = (props) => {
    const { dataSaphire, dataDiamond } = props
    const { isMobileAndSmaller } = useAuth();
    const { t } = useTranslation();

    const [diamondDataSorted, setDiamondDataSorted] = useState([])
    const eventOrder = Object.values(ListOfEventAchiever);

    useEffect(() => {
        let clonedData = [...dataDiamond]
        let tempData = clonedData.sort((a, b) => {
            if (a.name < b.name) {
                return -1;
            }
            if (a.name > b.name) {
                return 1;
            }
            return 0;
        });

        //to sort the event list
        tempData.forEach(person => {
            person.event.sort((a, b) => {
                return eventOrder.indexOf(a) - eventOrder.indexOf(b);
            });
        });
        setDiamondDataSorted(tempData)
    }, [dataDiamond])

    return (
        <div style={{ paddingTop: 150, backgroundImage: `url(${textureBackgroundLong})`, backgroundSize: "contain" }}>
            <AchieversHeader
                title={`${t("Acv1")}`}
                subTitle={t("Acv1A")}
                image={saphireAchieverText}
                description={t("Acv2")}
                description2={t("Acv2A")}
                description3={t("Acv2B")} />
            <div className="container color-white">
                <div className="row gy-5 gy-md-1">
                    {dataSaphire.map((eachData, index) => {
                        // const colClass = index === 24 ? "col-12 col-md-5 offset-md-4" : "col-12 col-md-4";
                        return (
                            <div className={"col-6 col-md-4"} style={{ padding: isMobileAndSmaller ? 5 : 35 }}>
                                <ProfileToYoutube data={eachData} />
                            </div>
                        )
                    })}
                </div>
            </div>

            <div style={{ paddingTop: 150 }}>
                <AchieversHeader
                    title={`${t("Acv3")}`}
                    subTitle={t("Acv3A")}
                    image={diamondAchieversText}
                    description={t("Acv4")}
                    description2={t("Acv4A")}
                    description3={t("Acv4B")} />
                {diamondDataSorted.length > 0 && (
                    <div className="container color-white" style={{ paddingBottom: 200 }}>
                        <div className="row  gy-5 gy-md-1">
                            {diamondDataSorted.map((eachData, index) => {
                                const colClass = index + 1 === dataDiamond.length ? "col-6 offset-3 col-md-4 offset-md-4" : "col-6 col-md-4"
                                return (
                                    <div className={"col-6 col-md-4"} style={{ padding: isMobileAndSmaller ? 5 : 35 }}>
                                        <ProfileToYoutube data={eachData} noImage={true} />
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>

            <GoldSection />
        </div>
    )
}

export default SapphireWinnerSection;