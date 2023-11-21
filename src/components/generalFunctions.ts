import { getAuth } from "firebase/auth";

export function signOutUser() {
    const auth = getAuth();
    auth.signOut().then(() => {
    }).catch((error) => {
        alert(error);
    });
}

export function hasSpecialCharacters(str:string):boolean {
    let regex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g;
    return regex.test(str);
}