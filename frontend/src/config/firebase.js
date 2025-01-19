import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAn5BB5U_9DdJ2ESchC8FI-d8USrDXlZBU",
  authDomain: "z-clothing-b316d.firebaseapp.com",
  projectId: "z-clothing-b316d",
  storageBucket: "z-clothing-b316d.firebasestorage.app",
  messagingSenderId: "189600888531",
  appId: "1:189600888531:web:74d66e4612aa1a7f020626",
  measurementId: "G-M96ZXKN8VN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics, logEvent };
