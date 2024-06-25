// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCeXSDzdWQVnlYStQ22hOTFLSdaePuXICw",
  authDomain: "manisha-592f0.firebaseapp.com",
  projectId: "manisha-592f0",
  storageBucket: "manisha-592f0.appspot.com",
  messagingSenderId: "687504150775",
  appId: "1:687504150775:web:8f107d9cea09554d9e83f2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
const storage = getStorage();


export {auth, db, storage};
export default app;