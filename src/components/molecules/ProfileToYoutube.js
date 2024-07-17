import React from "react";
import indFlag from "../../assets/images/indFlag.jpg"
import playButton from "../../assets/icons/playButton.svg"
import AnimatedComponent from "../atom/AnimatedComponent";
import { useAuth } from "../../context/DataContext";
import EllipsisText from "../atom/EllipsisText";

const ProfileToYoutube = (props) => {
    const { data, noImage = false } = props
    const { name, image, country, event, YoutubeLink } = data;
    const { isMobileAndSmaller } = useAuth();

    const handleOpenLink = () => {
        window.open(YoutubeLink, "_blank");
    }

    return (
        <>
            <AnimatedComponent animationClass="animate__fadeIn">
                {!noImage && (
                    <img loading="lazy" src={image} alt='saphire2' style={{ width: "100%" }} />
                )}
                <div>
                    <div className="flex justify-spaceBetween" style={{ marginTop: 40, fontSize: 24, fontWeight: "bold" }}>
                        {name.length >= 100 ? (
                            // <span className="fontSizeSubHeader">
                            //     {name}
                            // </span>
                            <EllipsisText quote={name} seeMore={true} />
                        ) : (
                            <span className="fontSizeSubHeader">
                                {name}
                            </span>
                        )}
                        {YoutubeLink && (
                            <div className="playButtonContainer">
                                <img className="cursorPointer" src={playButton} alt='playButton' onClick={handleOpenLink} />
                            </div>
                        )}
                    </div>
                    <div style={{ marginTop: 8 }}>
                        <img src={indFlag} alt={indFlag} style={{ marginRight: 13, width: isMobileAndSmaller ? 35 : 50 }} />
                        IDN | {country}
                    </div>
                    <div style={{ marginTop: 16, fontSize: isMobileAndSmaller ? "5vmin" : 20, fontWeight: "semi-bold" }}>
                        {noImage ? "Diamond Winner" : "Sapphire Winner"}
                    </div>
                    {event?.map((eachEvent) => (
                        <div className="fontSizeBody" style={{}}>
                            {eachEvent}
                        </div>
                    ))}
                </div>
            </AnimatedComponent>
        </>
    )
}

export default ProfileToYoutube;