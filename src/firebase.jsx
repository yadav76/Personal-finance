// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBpBFLiibyeYvUsXNo67Ey5M6Yhji2zYZs",
    authDomain: "financely-98cea.firebaseapp.com",
    projectId: "financely-98cea",
    storageBucket: "financely-98cea.appspot.com",
    messagingSenderId: "499389334447",
    appId: "1:499389334447:web:1fd3c9eb1670b477e0655a",
    measurementId: "G-P237CFR0Q5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { db, auth, provider, doc, setDoc };