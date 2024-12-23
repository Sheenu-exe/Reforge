// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import {getStorage} from "firebase/storage";
import {getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDlFF7DSP2-yZ4xr-6S7O5Y9mkQQDpU1Vg",
  authDomain: "habittracker-9a93c.firebaseapp.com",
  projectId: "habittracker-9a93c",
  storageBucket: "habittracker-9a93c.firebasestorage.app",
  messagingSenderId: "1071873424873",
  appId: "1:1071873424873:web:2856c9f48b7f6ea3259f78",
  measurementId: "G-6GWV9B1V84"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
export {db, storage, auth};