// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

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

// Initialize Analytics and get a reference to the service
export const analytics = getAnalytics(app);

export const db = getFirestore(app);
const storage = getStorage(app);

// Initialize Firebase Auth provider
export const provider = new GoogleAuthProvider();

// whenever a user interacts with the provider, we force them to select an account
provider.setCustomParameters({
    prompt: "select_account "
});
export const auth = getAuth();