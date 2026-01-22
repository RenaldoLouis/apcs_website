import chinaflag from "../../assets/images/chinaflag.jpg";
import denmarkflag from "../../assets/images/denmarkflag.jpg"; // fidland
import indFlag from "../../assets/images/indFlag.jpg";
import koreaflag from "../../assets/images/koreaflag.jpg";
import russiaflag from "../../assets/images/russiaflag.jpg"; //estonia
import { CountryConst } from "../../constant/CountryConst";
import { useAuth } from "../../context/DataContext";
import AnimatedComponent from "../atom/AnimatedComponent";

const GuestArtistCard = (props) => {
    const { data } = props

    const { name, image, country, title } = data;
    const { isMobileAndSmaller } = useAuth();

    const flagIcon = (countryLocal) => {
        switch (countryLocal) {
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
        <AnimatedComponent animationClass="animate__fadeIn">
            <img loading="lazy" src={image} alt='saphire2'
                style={{
                    width: "100%",
                    height: isMobileAndSmaller ? "250px" : "330px", // 1. Set a fixed height
                    objectFit: "cover", // 2. Crop image to fit without stretching
                    objectPosition: "top" // 3. Focus on the top/face of the artist
                }}
            />
            <div>
                <div className="flex justify-spaceBetween" style={{ marginTop: 40, fontSize: 24, fontWeight: "bold" }}>
                    {name}
                </div>
                <div style={{ marginTop: 8 }}>
                    {country.map((eachCountry, index) => (
                        <img key={`${eachCountry}-${index}`} src={flagIcon(eachCountry)} alt={eachCountry}
                            style={{ marginRight: 13, width: isMobileAndSmaller ? 35 : 50 }}
                        />
                    ))}
                    {title}
                </div>
            </div>
        </AnimatedComponent>
    )
}

export default GuestArtistCard;