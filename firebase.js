// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCX52lJCtBEw_WGTpSV4j5THnVXl9iCcGw",
  authDomain: "inventory-manager-5e552.firebaseapp.com",
  projectId: "inventory-manager-5e552",
  storageBucket: "inventory-manager-5e552.appspot.com",
  messagingSenderId: "368078148267",
  appId: "1:368078148267:web:208e68473f1226a2091dee",
  measurementId: "G-5LD3GSKRTP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore}