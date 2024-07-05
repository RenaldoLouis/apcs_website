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
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const Navbar = (props) => {
    const { isNavbarMobileOpen, setIsNavbarMobileOpen } = props
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isTabletAndSmaller = useMediaQuery(theme.breakpoints.down('md'));

    //Creating a method to change the language onChnage from select box
    const changeLanguageHandler = (lang) => {
        i18n.changeLanguage(lang);
        setCurrentLanguage(lang)
    }

    const [currentPage, setCurrentPage] = useState();
    const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

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
            <div className="container-fluid mt-3" style={{ position: "absolute", color: "white", zIndex: 999 }}>
                <div className="row d-flex justify-content-between">
                    <div className="col-2 d-flex d-none d-lg-flex justify-content-end">
                        <YoutubeOutlined style={{ fontSize: 32 }} />
                        <InstagramOutlined style={{ marginLeft: 18, marginRight: 18, fontSize: 32 }} />
                        <TikTokOutlined style={{ fontSize: 32 }} />
                    </div>
                    <div className="col-2">
                        <span className="logoContainerNavbar">
                            {!isTabletAndSmaller && (
                                <img loading="lazy" src={apcLogo} alt="apcsLogo" style={{ width: "14vmin" }} />
                            )}
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
                        <div className="logoContainerMobile" style={{ zIndex: 999 }}>
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
                    <CloseOutlined className=" logoContainerMobile" onClick={handleCloseMenuMobile} style={{ display: "flex", alignSelf: "self-end" }} />
                    <div className="d-flex flex-column" style={{ width: '100%', height: "100%", justifyContent: "space-between" }}>
                        <div style={{ display: 'flex', flexDirection: "column", gap: "1rem" }}>
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
                        <span className="logoContainerMobile">
                            <img className="align-self-center" loading="lazy" src={apcLogo} alt="apcsLogo" style={{ marginBottom: 64 }} />
                        </span>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;