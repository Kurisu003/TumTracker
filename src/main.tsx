import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./components/App.tsx";
import Login from "./components/Login.tsx";
import Signup from "./components/Signup.tsx";
import { subjectShorts } from "./components/TsFiles/types.ts";
import Weekdisplay from "./components/Weekdisplay.tsx";

const subjects: subjectShorts[] = [
    "analysis",
    "linalg",
    "schaltung",
    "comptech",
    "digtech",
];

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
            </Routes>
            <Routes>
                <Route path="/login" element={<Login />} />
            </Routes>
            <Routes>
                <Route path="/signup" element={<Signup />} />
            </Routes>

            {subjects.map((el) => (
                <Routes>
                    <Route
                        path={"/" + el}
                        element={<Weekdisplay subject={el} />}
                    />
                </Routes>
            ))}
        </BrowserRouter>
    </React.StrictMode>
);
