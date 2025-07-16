// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {getStorage} from "firebase/storage";
import {getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAcQVc4ruk-vARspEx8SObQsafI61L53PE",
  authDomain: "beyond-us-37f2a.firebaseapp.com",
  projectId: "beyond-us-37f2a",
  storageBucket: "beyond-us-37f2a.appspot.com",
  messagingSenderId: "36368523989",
  appId: "1:36368523989:web:943c43219cce4ea4b2785c",
  measurementId: "G-8TVKCT32PT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
export {db, storage, auth};