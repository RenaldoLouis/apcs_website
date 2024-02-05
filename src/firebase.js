// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBOTI4bdDlZVOS7T5_LuDbu0nW9YpNNKkI",
    authDomain: "apcs-profile.firebaseapp.com",
    projectId: "apcs-profile",
    storageBucket: "apcs-profile.appspot.com",
    messagingSenderId: "290190992735",
    appId: "1:290190992735:web:a9389660ac3aa2ed6542ea",
    measurementId: "G-GS88QTZNJ9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);