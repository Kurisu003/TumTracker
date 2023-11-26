import MenuIcon from "@mui/icons-material/Menu";
import { getAuth } from "firebase/auth";
import { Link } from "react-router-dom";
import "./css/Topbar.css";
function Topbar(props: { setSidebarOpen: Function; sidebarOpen: boolean }) {
    const auth = getAuth();

    return (
        <div className="Topbar">
            <MenuIcon
                style={{ cursor: "Pointer" }}
                onClick={() => {
                    props.setSidebarOpen(!props.sidebarOpen);
                }}
            />

            {auth.currentUser?.displayName == "" || auth.currentUser == null ? (
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
