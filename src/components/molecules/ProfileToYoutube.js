import React from "react";
import indFlag from "../../assets/images/indFlag.jpg"
import playButton from "../../assets/icons/playButton.svg"

const ProfileToYoutube = (props) => {
    const { data, noImage = false } = props
    const { name, image, country, event, YoutubeLink } = data;

    const handleOpenLink = () => {
        window.open(YoutubeLink, "_blank");
    }

    return (
        <>
            {!noImage && (
                <img loading="lazy" src={image} alt='saphire2' style={{ width: "100%" }} />
            )}
            <div>
                <div className="flex justify-spaceBetween" style={{ marginTop: 40, fontSize: 24, fontWeight: "bold" }}>
                    {name}
                    <img className="cursorPointer" src={playButton} alt='playButton' onClick={handleOpenLink} />
                </div>
                <div style={{ marginTop: 8 }}>
                    <img src={indFlag} alt={indFlag} style={{ marginRight: 13 }} />
                    IDN | {country}
                </div>
                <div style={{ marginTop: 16, fontSize: 20, fontWeight: "semi-bold" }}>
                    Sapphire Winner
                </div>
                {event?.map((eachEvent) => (
                    <div style={{ fontSize: 16 }}>
                        {eachEvent}
                    </div>
                ))}
            </div>
        </>
    )
}

export default ProfileToYoutube;