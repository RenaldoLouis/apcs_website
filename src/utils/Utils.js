import { format, isValid, parse, parseISO } from 'date-fns';
import chinaflag from "../assets/images/chinaflag.jpg";
import denmarkflag from "../assets/images/denmarkflag.jpg"; // fidland
import indFlag from "../assets/images/indFlag.jpg";
import koreaflag from "../assets/images/koreaflag.jpg";
import russiaflag from "../assets/images/russiaflag.jpg"; //estonia
import { CountryConst } from "../constant/CountryConst";

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

export const formatDuration = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, "0");
    const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, "0");
    const seconds = Math.floor(totalSeconds % 60).toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
}

export const parseDateString = (dateInput) => {
    // Return empty if the input is null or undefined
    if (!dateInput) return '';

    let parsedDate;

    // Case 1: Input is already a JavaScript Date object (from cellDates: true)
    if (dateInput instanceof Date) {
        parsedDate = dateInput;
    }

    // Case 2: Input is a string
    if (typeof dateInput === 'string') {
        // First, try to parse it as a standard ISO string (like "2013-11-19T...")
        parsedDate = parseISO(dateInput);

        // If ISO parsing fails, fallback to your custom formats
        if (!isValid(parsedDate)) {
            const dateFormats = [
                'dd/MM/yyyy', // For "15/08/2012"
                'dd-MMM-yy',  // For "20-Nov-13"
            ];
            for (const fmt of dateFormats) {
                const customParsedDate = parse(dateInput, fmt, new Date());
                if (isValid(customParsedDate)) {
                    parsedDate = customParsedDate;
                    break; // Stop on the first successful parse
                }
            }
        }
    }

    // If we have a valid date from any of the above methods, format and return it
    if (isValid(parsedDate)) {
        return format(parsedDate, 'dd/MM/yyyy');
    }

    // If all parsing fails, return an empty string
    return '';
};