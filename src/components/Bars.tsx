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
                    <MenuItem>
                        <Link to={"/analysis"}> Analysis </Link>
                    </MenuItem>
                    <MenuItem>
                        <Link to={"/linalg"}> Lin. Alg. </Link>
                    </MenuItem>
                    <MenuItem>
                        <Link to={"/schaltung"}> Schaltung. </Link>
                    </MenuItem>
                    <MenuItem>
                        <Link to={"/digtech"}> Digit. tech. </Link>
                    </MenuItem>
                    <MenuItem>
                        <Link to={"/comptech"}> Comp. tech. </Link>
                    </MenuItem>
                </Menu>
            </Sidebar>
        </>
    );
}

export default Bars;
