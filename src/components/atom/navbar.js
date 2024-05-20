import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PathName } from "../../constant/PathName";
import apcLogo from "../../assets/images/apc_logo.svg"

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
                <img src={apcLogo} />
            </span>
            <ul >
                {Object.keys(PathName).map((eachPath) => {
                    let path = PathName[eachPath]
                    let navbarName = PathName[eachPath].substring(1);
                    return (
                        <div className={`itemMenuSelectedNavbarBackgoundColor itemMenuSelected ${currentPage === path ? "selected textColorNavbarSelected" : ""}`} onClick={() => handleMovePage(path)}>
                            {navbarName.toUpperCase()}
                        </div>
                    )
                })}
            </ul>
        </nav>
    );
}

export default Navbar;