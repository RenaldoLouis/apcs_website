import React from "react";
import indFlag from "../../assets/images/indFlag.jpg"
import russiaflag from "../../assets/images/russiaflag.jpg" //estonia
import denmarkflag from "../../assets/images/denmarkflag.jpg" // fidland
import koreaflag from "../../assets/images/koreaflag.jpg"
import chinaflag from "../../assets/images/chinaflag.jpg"
import { CountryConst } from "../../constant/CountryConst";

const GuestArtistCard = (props) => {
    const { data } = props

    const { name, image, country, title } = data;

    const flagIcon = () => {
        switch (country) {
            case CountryConst.DNMRK:
                return denmarkflag;

            case CountryConst.IDN:
                return indFlag;

            case CountryConst.KR:
                return koreaflag;

            case CountryConst.RSA:
                return russiaflag;

            case CountryConst.CHI:
                return chinaflag;

            default:
                return indFlag;

        }
    }

    return (
        <>
            <img loading="lazy" src={image} alt='saphire2' style={{ width: "100%" }} />
            <div>
                <div className="flex justify-spaceBetween" style={{ marginTop: 40, fontSize: 24, fontWeight: "bold" }}>
                    {name}
                </div>
                <div style={{ marginTop: 8 }}>
                    <img src={flagIcon()} alt={country} style={{ marginRight: 13 }} />
                    {title}
                </div>
            </div>
        </>
    )
}

export default GuestArtistCard;