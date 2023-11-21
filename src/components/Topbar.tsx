import { getAuth } from "firebase/auth";
import { Link } from "react-router-dom";

import "./css/Topbar.css";
function Topbar(props: { setSidebarOpen: Function; sidebarOpen: boolean }) {
    const auth = getAuth();

    return (
        <div className="Topbar">
            <button
                onClick={() => {
                    props.setSidebarOpen(!props.sidebarOpen);
                }}
            >
                =
            </button>

            {auth.currentUser?.displayName == "" ? (
                <Link to={"/login"}>
                    <p>Anmelden</p>
                </Link>
            ) : (
                <p>{auth.currentUser?.displayName}</p>
            )}
        </div>
    );
}

export default Topbar;
