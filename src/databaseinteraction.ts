import { initializeApp } from "firebase-admin";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { API_KEY } from "./api_key";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: "tum-tracker.firebaseapp.com",
  databaseURL: "https://tum-tracker-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "tum-tracker",
  storageBucket: "tum-tracker.appspot.com",
  messagingSenderId: "493301300751",
  appId: "1:493301300751:web:966055ccce17876d946d7a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();

export async function test(){
  const userRef = doc(db, "user-reports", "kurisu");
  try {
    const snapshot = await getDoc(userRef);
    if (snapshot.exists()) {
      const userData = snapshot.data();
      console.log("User data:", userData);
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.error("Error getting user data:", error);
  }
}