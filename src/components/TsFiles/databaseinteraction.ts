import { initializeApp } from "firebase/app";
import {
    addDoc,
    collection,
    doc,
    getDocs,
    getFirestore,
    query,
    setDoc,
    updateDoc,
    where,
} from "firebase/firestore";
import { API_KEY } from "../../api_key";
import { Status, SubjectData, UserData, subjectShorts } from "./types";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: API_KEY,
    authDomain: "tum-tracker.firebaseapp.com",
    databaseURL:
        "https://tum-tracker-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "tum-tracker",
    storageBucket: "tum-tracker.appspot.com",
    messagingSenderId: "493301300751",
    appId: "1:493301300751:web:966055ccce17876d946d7a",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

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
        UserData: [],
    });

}

export async function getWorksheets(
    subject: subjectShorts
): Promise<SubjectData> {
    const subjectQuery = query(
        collection(db, "worksheets"),
        where("__name__", "==", subject)
    );
    const subjectSnapshot = await getDocs(subjectQuery);

    const ret = subjectSnapshot.docs.map((doc) => {
        return doc.data();
    });

    return ret[0] as SubjectData;
}

export async function getUserData(username: string): Promise<UserData | null> {
    if (username == "") return null;

    const userQuery = query(
        collection(db, "users"),
        where("Username", "==", username)
    );

    const userSnapshot = await getDocs(userQuery);

    const ret = userSnapshot.docs.map((doc) => {
        return doc.data();
    });
    return ret[0].UserData as UserData;
}

export async function updateOrCreateUserData(
    username: string,
    idToUpdate: string,
    updateStatus: string
): Promise<void | null> {
    if (username === "") return;

    const userQuery = query(
        collection(db, "users"),
        where("Username", "==", username)
    );

    const userSnapshot = await getDocs(userQuery);

    if (userSnapshot.empty) {
        // User doesn't exist, create a new document
        const newUserDocRef = doc(collection(db, "users"));
        await setDoc(newUserDocRef, {
            Username: username,
            UserData: [],
        });
    } else {
        // User exists, update the existing document
        const userDoc = userSnapshot.docs[0];
        const userId = userDoc.id;

        const userData = await getUserData(username);

        if (!userData) return null

        const existingUserDataIndex = userData.findIndex(
            (data) => data.Id === idToUpdate
        );

        if (existingUserDataIndex !== -1) {
            // Id exists, update the existing UserData
            userData[existingUserDataIndex].Status = updateStatus as Status;
        } else {
            // Id doesn't exist, create a new UserData entry
            userData.push({
                Id: idToUpdate,
                Status: updateStatus as Status,
            });
        }

        // ...

        await updateDoc(doc(db, "users", userId), {
            UserData: userData,
        });
    }
}
