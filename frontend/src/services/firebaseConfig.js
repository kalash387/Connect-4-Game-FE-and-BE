// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBI0OmF7GaiH3BzgazvpA7IwErK4iD3HGU",
  authDomain: "connect-4-multiplayer-aa9e4.firebaseapp.com",
  databaseURL: "https://connect-4-multiplayer-aa9e4-default-rtdb.firebaseio.com",
  projectId: "connect-4-multiplayer-aa9e4",
  storageBucket: "connect-4-multiplayer-aa9e4.firebasestorage.app",
  messagingSenderId: "370813422906",
  appId: "1:370813422906:web:fa8198f5368ee1d0d2d403",
  measurementId: "G-C4N3QEDBTT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

export { database, analytics };