
import { initializeApp } from "firebase/app";
import { addDoc, collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import { API_KEY } from "../../api_key";
import { subjectShorts } from "./types";

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

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// const storage = getStorage(app);
export async function test(username: string) {
    // console.log("getting user by username")
    const userCol = collection(db, "user-reports");
    const userSnapshot = await getDocs(userCol);
    console.log(userSnapshot.docs.map((doc) => doc.data()))
}

export async function usernameFree(username: string): Promise<boolean> {
    const userCol = collection(db, "user-reports");
    const userSnapshot = await getDocs(userCol);
    const userDoc = userSnapshot.docs.find(
        (doc) => doc.data().username === username
    );
    return userDoc == null;
}

export async function addUserToDb(username: string) {
    // console.log("adding user to db")

    await addDoc(collection(db, "users"), {
        Username: username,
    });
}

export async function getWorksheets(subject:subjectShorts){
    const subjectQuery = query(
        collection(db, "worksheets"),
        where("__name__", "==", subject),
    )

    const subjectSnapshot = await getDocs(subjectQuery)

    return subjectSnapshot.docs.map(doc => {
      return doc.data();
    });
}