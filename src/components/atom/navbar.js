import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PathName } from "../../constant/PathName";
import apcLogo from "../../assets/images/apc_logo.svg"
import {
    MenuOutlined,
    CloseOutlined
} from '@ant-design/icons';
import { useTranslation } from "react-i18next";
const Navbar = () => {
    const { t, i18n } = useTranslation();

    //Creating a method to change the language onChnage from select box
    const changeLanguageHandler = (e) => {
        const languageValue = e.target.value
        i18n.changeLanguage(languageValue);
    }

    const [currentPage, setCurrentPage] = useState();
    const [isNavbarMobileOpen, setIsNavbarMobileOpen] = useState(false);

    const navigate = useNavigate();

    const location = useLocation();

    const handleMovePage = (path) => {
        navigate(path);
    }

    useEffect(() => {
        setCurrentPage(location.pathname)
    }, [location])

    const handleOpenMenuMobile = () => {
        setIsNavbarMobileOpen(true)
    }

    const handleCloseMenuMobile = () => {
        setIsNavbarMobileOpen(false)
    }

    return (
        <nav className="navbarContainer">
            <span className="logoContainer">
                <img loading="lazy" src={apcLogo} alt="apcsLogo" />
            </span>
            <div className="logoContainerMobile">
                <MenuOutlined style={{ visibility: "hidden" }} />
                <MenuOutlined style={{ visibility: "hidden" }} />
                <MenuOutlined style={{ visibility: "hidden" }} />
                <MenuOutlined onClick={handleOpenMenuMobile} />
            </div>
            <div className={`menuNavbarContainer  ${isNavbarMobileOpen ? "open" : ""}`}>
                <CloseOutlined className="logoContainerMobile" onClick={handleCloseMenuMobile} />
                <span className="logoContainerMobile">
                    <img loading="lazy" src={apcLogo} alt="apcsLogo" />
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
            <select className="custom-select" style={{ width: 200 }} onChange={changeLanguageHandler}>
                <option value="en" >English</option>
                <option value="id" >Indo</option>
            </select>
        </nav>
    );
}

export default Navbar;