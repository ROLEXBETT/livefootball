// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCbQIr7stKtowtx1X7jz1eShM6heoAemCI",
  authDomain: "footballlive-3cc97.firebaseapp.com",
  projectId: "footballlive-3cc97",
  storageBucket: "footballlive-3cc97.firebasestorage.app",
  messagingSenderId: "259772515101",
  appId: "1:259772515101:web:c6076c24ea18319b1997f4",
  measurementId: "G-NX62SG6V7W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
