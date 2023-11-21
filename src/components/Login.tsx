import { TextField } from "@mui/material";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();
    const auth = getAuth();
    const [user] = useAuthState(auth);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function loginUser() {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                navigate("/");
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // updateFailed(errorMessage.replace("Firebase: ", ""));
            });
    }

    return (
        <div id="LoginContainer">
            <div className="InputWrapper">
                <TextField
                    className="TextField"
                    id="outlined-textarea-email"
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
                    id="outlined-textarea-pwd"
                    placeholder="***********"
                    label="Password"
                    margin="none"
                    minRows={1}
                    maxRows={1}
                    type="password"
                    value={password}
                    onChange={(e: any) => setPassword(e.target.value)}
                />
            </div>
            <div className="LoginButtonContainer">
                <button className="LoginButton" onClick={() => loginUser()}>
                    Login
                </button>
                <button
                    className="SignupButton"
                    onClick={() => navigate("/signUp")}
                >
                    Sign up instead
                </button>
            </div>
        </div>
    );
}

export default Login;
