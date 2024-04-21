import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();

    const handleMovePage = (path) => {
        navigate(path);
    }
    return (
        <nav className="navbarContainer">
            <span className="text-3xl">
                APC Logo
            </span>
            <ul >
                <li onClick={() => handleMovePage("/home")}>
                    HOME
                </li>
                <li onClick={() => handleMovePage("/about")}>
                    ABOUT
                </li>
                <li onClick={() => handleMovePage("/podcast")}>
                    PODCAST
                </li>
                {/* <li>
                    <div className="divider"></div>
                </li> */}
                <li onClick={() => handleMovePage("/galery")}>
                    GALERY
                </li>
                <li onClick={() => handleMovePage("/achievers")}>
                    ACHIEVERS
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;