// import { I18nManager } from 'react-native';
// import RNRestart from 'react-native-restart';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// import { USER_LANG, getDeviceLang } from '@utils/helper';

/** Localization */
import en from './constant/translations/en.json';
import id from './constant/translations/id.json';
/** Localization */

/*---------------------------------
          LANGUAGE DETECTOR
---------------------------------*/
// const languageDetector = {
//     init: Function.prototype,
//     type: 'languageDetector',
//     async: true, // flags below detection to be async
//     detect: async callback => {
//         const userLang = await AsyncStorage.getItem(USER_LANG);
//         const deviceLang = userLang || getDeviceLang();
//         const isLangRTL = deviceLang === 'ar';
//         if (isLangRTL !== I18nManager.isRTL) {
//             await I18nManager.allowRTL(isLangRTL);
//             await I18nManager.forceRTL(isLangRTL);
//             RNRestart.Restart();
//         }
//         callback(deviceLang);
//     },
//     cacheUserLanguage: () => { },
// };
const resources = {
    en: {
        translation: en,
    },
    id: {
        translation: id,
    },
};
/*---------------------------------
            I18N CONFIG
---------------------------------*/
i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "en", //default language
        keySeparator: false,
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
