import { TextField } from "@mui/material";
import {
    createUserWithEmailAndPassword,
    getAuth,
    updateProfile,
} from "firebase/auth";
import { useState } from "react";
import PasswordStrengthBar from "react-password-strength-bar";
import { useNavigate } from "react-router-dom";
import { addUserToDb, usernameFree } from "./TsFiles/databaseinteraction";
import { hasSpecialCharacters } from "./generalFunctions";

function Signup() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");

    const auth = getAuth();
    // const [user] = useAuthState(auth);

    async function signUpUser() {
        if (email === "" || userName === "" || password === "") {
            console.error("Please fill in all fields");
            return;
        }
        if (userName.length > 20) {
            console.error("Username must be shorter than 20 characters");
            return;
        }
        if (hasSpecialCharacters(userName)) {
            console.error("Username can't contain special characters");
            return;
        }
        if (!(await usernameFree(userName))) {
            console.error("Username already taken");
            return;
        }

        if (password !== password2) {
            console.error("Passwords dont match");
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                updateProfile(userCredential.user, {
                    displayName: userName,
                });
                await addUserToDb(userName);
                navigate("/");
            })
            .catch((error) => {
                // const errorCode = error.code;
                const errorMessage = error.message;
                console.error(errorMessage.replace("Firebase: ", ""));
            });
    }

    return (
        <div id="SignupContainer">
            <TextField
                className="TextField"
                id="outlined-textarea"
                placeholder="john.doe@gmail.com"
                label="Email"
                margin="none"
                minRows={1}
                maxRows={1}
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
            />
            <TextField
                className="TextField"
                id="outlined-textarea"
                placeholder="Username"
                label="Username"
                margin="none"
                minRows={1}
                maxRows={1}
                value={userName}
                onChange={(e: any) => setUserName(e.target.value)}
            />
            <TextField
                className="TextField"
                id="outlined-textarea"
                placeholder="**********"
                label="Password"
                type="password"
                margin="none"
                minRows={1}
                maxRows={1}
                value={password}
                onChange={(e: any) => setPassword(e.target.value)}
            />
            <TextField
                className="TextField"
                id="outlined-textarea"
                placeholder="**********"
                label="Password"
                type="password"
                margin="none"
                minRows={1}
                maxRows={1}
                value={password2}
                onChange={(e: any) => setPassword2(e.target.value)}
            />
            <PasswordStrengthBar
                style={{ width: "100%" }}
                password={password}
            />
            <button className="LoginButton" onClick={() => signUpUser()}>
                Sign up
            </button>
        </div>
    );
}
export default Signup;
