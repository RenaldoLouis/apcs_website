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

    //Creating a method to change the language onChnage from select box
    const changeLanguageHandler = (lang) => {
        i18n.changeLanguage(lang);
        setCurrentLanguage(lang)
    }

    const [currentPage, setCurrentPage] = useState();
    const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
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
        <>
            <nav className="navbarContainer">
                <div>
                    <YoutubeOutlined style={{ fontSize: 32 }} />
                    <InstagramOutlined style={{ fontSize: 32 }} />
                    <TikTokOutlined style={{ fontSize: 32 }} />
                </div>
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
                            <div className={`plus-jakarta-sans-font itemMenuSelected ${currentPage === path ? "selected textColorSelected" : ""}`} onClick={() => handleMovePage(path)}>
                                {navbarName.toUpperCase()}
                            </div>
                        )
                    })}
                </div>
                <div className="flex align-items-center">
                    <span onClick={() => changeLanguageHandler("id")}
                        className={`cursorPointer ${currentLanguage === "id" ? "textColorSelected" : ""}`}>ID</span>
                    <span className="separator"></span>
                    <span onClick={() => changeLanguageHandler("en")}
                        className={`cursorPointer ${currentLanguage === "en" ? "textColorSelected" : ""}`}>EN</span>
                </div>
            </nav>
            {/* <nav>
                <div class="container" style={{ position: "absolute" }}>
                    <div className={`row`}>
                        <div class="col">
                            <YoutubeOutlined />
                            <InstagramOutlined />
                            <TikTokOutlined />
                        </div>
                        <div class="col">
                            Column
                        </div>
                        <div class="col">
                            Column
                        </div>
                    </div>
                </div>
            </nav> */}
        </>
    );
}

export default Navbar;