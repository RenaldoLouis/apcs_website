import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PathName } from "../../constant/PathName";
import apcLogo from "../../assets/images/apc_logo.svg"
import {
    MenuOutlined,
    CloseOutlined,
    YoutubeOutlined,
    InstagramOutlined,
    TikTokOutlined
} from '@ant-design/icons';
import { useTranslation } from "react-i18next";
const Navbar = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    //Creating a method to change the language onChnage from select box
    const changeLanguageHandler = (lang) => {
        i18n.changeLanguage(lang);
        setCurrentLanguage(lang)
    }

    const [currentPage, setCurrentPage] = useState();
    const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
    const [isNavbarMobileOpen, setIsNavbarMobileOpen] = useState(false);

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
        <nav>
            <div className="container-fluid mt-3" style={{ position: "absolute", color: "white", zIndex: 10 }}>
                <div className="row d-flex justify-content-between">
                    <div className="col-2 d-flex d-none d-lg-flex justify-content-end">
                        <YoutubeOutlined style={{ fontSize: 32 }} />
                        <InstagramOutlined style={{ marginLeft: 36, marginRight: 36, fontSize: 32 }} />
                        <TikTokOutlined style={{ fontSize: 32 }} />
                    </div>
                    <div className="col-2">
                        <span className="logoContainerNavbar">
                            <img loading="lazy" src={apcLogo} alt="apcsLogo" />
                        </span>
                    </div>
                    <div className="col d-flex d-none d-lg-flex align-items-center justify-content-between">
                        {Object.keys(PathName).map((eachPath) => {
                            let path = PathName[eachPath]
                            let navbarName = PathName[eachPath].substring(1);
                            return (
                                <div
                                    style={{ height: "fit-content", fontSize: 16 }}
                                    className={`itemMenuSelected ${currentPage === path ? "selected textColorSelected" : ""}`} onClick={() => handleMovePage(path)}>
                                    {navbarName.toUpperCase()}
                                </div>
                            )
                        })}
                    </div>
                    <div className="col-2 d-flex align-items-center justify-content-center">
                        <div className="logoContainerMobile">
                            <MenuOutlined onClick={handleOpenMenuMobile} />
                        </div>
                        <span onClick={() => changeLanguageHandler("id")}
                            className={`d-none d-lg-block cursorPointer ${currentLanguage === "id" ? "textColorSelected" : ""}`}>ID</span>
                        <span className="d-none d-lg-block separator"></span>
                        <span onClick={() => changeLanguageHandler("en")}
                            className={`d-none d-lg-block cursorPointer ${currentLanguage === "en" ? "textColorSelected" : ""}`}>EN</span>
                    </div>
                </div>
            </div>

            <div className="navbarContainerMobile">
                <div className={`menuNavbarContainer  ${isNavbarMobileOpen ? "open" : ""}`}>
                    <CloseOutlined className="logoContainerMobile" onClick={handleCloseMenuMobile} />
                    <span className="logoContainerMobile">
                        <img loading="lazy" src={apcLogo} alt="apcsLogo" />
                    </span>
                    {Object.keys(PathName).map((eachPath) => {
                        let path = PathName[eachPath]
                        let navbarName = PathName[eachPath].substring(1);
                        return (
                            <div className={`plus-jakarta-sans-font itemMenuSelected ${currentPage === path ? "selected textColorSelected" : ""}`} onClick={() => handleMovePage(path)}>
                                {navbarName.toUpperCase()}
                            </div>
                        )
                    })}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;