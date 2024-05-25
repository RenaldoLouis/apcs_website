import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PathName } from "../../constant/PathName";
import apcLogo from "../../assets/images/apc_logo.svg"
import {
    MenuOutlined,
    CloseOutlined
} from '@ant-design/icons';
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
            <span className="logoContainer">
                <img src={apcLogo} alt="apcsLogo" />
            </span>
            <div className="menuNavbarContainer">
                <MenuOutlined />
                <CloseOutlined />
                <span className="logoContainerMobile">
                    <img src={apcLogo} alt="apcsLogo" />
                </span>
                {Object.keys(PathName).map((eachPath) => {
                    let path = PathName[eachPath]
                    let navbarName = PathName[eachPath].substring(1);
                    return (
                        <div className={`itemMenuSelectedNavbarBackgoundColor itemMenuSelected ${currentPage === path ? "selected textColorNavbarSelected" : ""}`} onClick={() => handleMovePage(path)}>
                            {navbarName.toUpperCase()}
                        </div>
                    )
                })}
            </div>
        </nav>
        // <nav>
        //     <input type="checkbox" id="sidebar-active" />
        //     <label for="sidebar-active" className="open-sidebar-button">
        //         <MenuOutlined />
        //     </label>

        //     <div className="links-container">
        //         <label for="sidebar-active" className="close-sidebar-button">
        //             <CloseOutlined />
        //         </label>
        //         {Object.keys(PathName).map((eachPath) => {
        //             let path = PathName[eachPath]
        //             let navbarName = PathName[eachPath].substring(1);
        //             return (
        //                 <div className={`itemMenuSelectedNavbarBackgoundColor itemMenuSelected ${currentPage === path ? "selected textColorNavbarSelected" : ""}`} onClick={() => handleMovePage(path)}>
        //                     {navbarName.toUpperCase()}
        //                 </div>
        //             )
        //         })}
        //     </div>
        // </nav>
    );
}

export default Navbar;