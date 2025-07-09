import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAl_JZnoOTHk6LohFf8RbDSL_1gC-KCJUA",
  authDomain: "korean-learning-27def.firebaseapp.com",
  databaseURL: "https://korean-learning-27def-default-rtdb.firebaseio.com",
  projectId: "korean-learning-27def",
  storageBucket: "korean-learning-27def.firebasestorage.app",
  messagingSenderId: "880939727536",
  appId: "1:880939727536:web:5eb0457f2f76edea9c1975",
  measurementId: "G-9X482GTLVK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);
export const auth = getAuth(app);

export default app;