import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PathName } from "../../constant/PathName";

const Navbar = () => {

    const [currentPage, setCurrentPage] = useState();

    const navigate = useNavigate();

    const location = useLocation();

    const handleMovePage = (path) => {
        navigate(path);
    }

    useEffect(() => {
        setCurrentPage(location.pathname)
    }, [location])

    return (
        <nav className="navbarContainer">
            <span className="text-3xl">
                APC Logo
            </span>
            <ul >
                {Object.keys(PathName).map((eachPath) => {
                    let path = PathName[eachPath]
                    let navbarName = PathName[eachPath].substring(1);
                    return (
                        <li className={currentPage === path ? "selectedNavbar" : ""} onClick={() => handleMovePage(path)}>
                            {navbarName.toUpperCase()}
                        </li>
                    )
                })}
            </ul>
        </nav>
    );
}

export default Navbar;