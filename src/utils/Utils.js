import { CountryConst } from "../constant/CountryConst";
import indFlag from "../assets/images/indFlag.jpg"
import russiaflag from "../assets/images/russiaflag.jpg" //estonia
import denmarkflag from "../assets/images/denmarkflag.jpg" // fidland
import koreaflag from "../assets/images/koreaflag.jpg"
import chinaflag from "../assets/images/chinaflag.jpg"

export const flagIcon = (countryLocal) => {
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