// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAmcLEIRTlBouQL0FG491nfMcp3y6ROsPs",
  authDomain: "int305fb-e3e60.firebaseapp.com",
  projectId: "int305fb-e3e60",
  storageBucket: "int305fb-e3e60.firebasestorage.app",
  messagingSenderId: "191475124413",
  appId: "1:191475124413:web:4746f898dd4a72b50b0fd4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

export default db