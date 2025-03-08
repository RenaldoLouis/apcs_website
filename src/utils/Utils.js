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

export const splitIntoFour = (arr, totalGroup) => {
    const chunks = [];
    const chunkSize = Math.ceil(arr.length / totalGroup); // Calculate chunk size (round up)

    for (let i = 0; i < arr.length; i += chunkSize) {
        chunks.push(arr.slice(i, i + chunkSize));
    }
    return chunks;
};

export const splitEvenlyBetweenTwo = (array) => {
    const midpoint = Math.ceil(array.length / 2);
    const firstHalf = array.slice(0, midpoint);
    const secondHalf = array.slice(midpoint);
    return [firstHalf, secondHalf];
};

// Utility function to shuffle an array
export const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
};

export const convertExcelTimeToDuration = (excelTime) => {
    const totalSeconds = Math.floor(excelTime * 24 * 60 * 60); // Convert fraction of a day to total seconds
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    // Format the time as HH:MM:SS
    const formattedDuration = [
        String(hours).padStart(2, '0'),
        String(minutes).padStart(2, '0'),
        String(seconds).padStart(2, '0')
    ].join(':');

    return formattedDuration;
};