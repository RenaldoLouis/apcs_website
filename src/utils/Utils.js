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
    if (!dateInput) return '';

    let parsedDate;

    // Case 1: Input is already a JavaScript Date object
    if (dateInput instanceof Date && isValid(dateInput)) {
        return format(dateInput, 'dd/MM/yyyy');
    }

    // Case 2: Input is a string
    if (typeof dateInput === 'string') {
        // Try parsing as a standard ISO string first
        parsedDate = parseISO(dateInput);

        // If ISO parsing fails, fallback to custom formats
        if (!isValid(parsedDate)) {
            const dateFormats = [
                'dd/MM/yyyy', // Handles "20/11/2016"
                'dd-MMM-yy',  // Handles "20-Nov-13"
                'dd/MMM/yy',  // NEW: Handles "20/Nov/13"
            ];
            for (const fmt of dateFormats) {
                const customParsedDate = parse(dateInput, fmt, new Date());
                if (isValid(customParsedDate)) {
                    parsedDate = customParsedDate;
                    break; // Stop on the first successful format match
                }
            }
        }
    }

    // If we have a valid date, format and return it
    if (isValid(parsedDate)) {
        return format(parsedDate, 'dd/MM/yyyy');
    }

    // If all parsing fails, return an empty string
    return '';
};

export const getAge = (isoDateString) => {
    const today = new Date();
    const birthDate = new Date(isoDateString);

    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDifference = today.getMonth() - birthDate.getMonth();

    // Check if the birthday has not yet occurred this year.
    // If the month is earlier, or if it's the same month but an earlier day, subtract one year.
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
}

export const isAgeInCategory = (age, descriptionString) => {
    // Make sure we have a valid age and description
    if (typeof age !== 'number' || !descriptionString) {
        return false;
    }

    // 1. Find all numbers in the string (e.g., "Poco (4-5)" -> ["4", "5"])
    const numbers = descriptionString.match(/\d+/g);

    if (!numbers) {
        return false; // No age range found in the string
    }

    const minAge = parseInt(numbers[0], 10);

    // 2. Check for an open-ended range (e.g., "4+ years old")
    if (descriptionString.includes('+')) {
        return age >= minAge;
    }

    // 3. Check for a defined range (e.g., "12-15 years old")
    if (numbers.length === 2) {
        const maxAge = parseInt(numbers[1], 10);
        return age >= minAge && age <= maxAge;
    }

    // 4. Fallback for a single number (e.g. "(12 years old)")
    if (numbers.length === 1) {
        return age === minAge;
    }

    return false;
};