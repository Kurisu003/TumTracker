import { useState } from "react";
import { Menu, MenuItem, Sidebar } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import Topbar from "./Topbar";

function Bars() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return (
        <>
            <Topbar setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />

            <Sidebar
                style={{
                    background: "#033F59",
                    height: "100vh",
                    display: `${sidebarOpen ? "flex" : "none"}`,
                }}
                backgroundColor="#033F59"
                collapsedWidth="0px"
                onBackdropClick={() => {
                    setSidebarOpen(false);
                }}
            >
                <Menu
                    menuItemStyles={{
                        button: {
                            minWidth: "100%",
                        },
                    }}
                >
                    <Link to={"/an"}>
                        <MenuItem>Analysis</MenuItem>
                    </Link>
                    <Link to={"/la"}>
                        <MenuItem>Lin. Alg.</MenuItem>
                    </Link>
                    <Link to={"/st"}>
                        <MenuItem>Schaltung.</MenuItem>
                    </Link>
                    <Link to={"/dt"}>
                        <MenuItem>Digit. tech.</MenuItem>
                    </Link>
                    {/* <Link to={"/comptech"}>
                        <MenuItem>Comp. tech.</MenuItem>
                    </Link> */}
                </Menu>
            </Sidebar>
        </>
    );
}

export default Bars;
