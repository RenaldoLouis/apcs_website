import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PathName } from "../../constant/PathName";
import apcLogo from "../../assets/images/apc_logo.svg"
import {
    MenuOutlined,
    CloseOutlined,
    YoutubeOutlined,
    InstagramOutlined,
    TikTokOutlined,
    WhatsAppOutlined
} from '@ant-design/icons';
import { useTranslation } from "react-i18next";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import indFlag from "../../assets/images/indFlag.jpg"
import ukFlag from "../../assets/images/ukFlag.png"

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
        setIsNavbarMobileOpen(false)
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

    const handleOpenYoutube = () => {
        window.open("https://www.youtube.com/@apcsmusic", '_blank');
    }

    const handleOpenInstagram = () => {
        window.open("https://www.instagram.com/apcs.music/?img_index=6", '_blank');
    }

    const handleOpenWhatsapp = () => {
        window.open("https://api.whatsapp.com/send/?phone=6282213002686", '_blank');
    }

    return (
        <nav>
            <div className="container-fluid mt-3" style={{ position: "absolute", color: "white", zIndex: 999 }}>
                <div className="row d-flex justify-content-between">
                    <div className="col-2 d-flex d-none d-lg-flex justify-content-end">
                        <WhatsAppOutlined style={{ fontSize: 30, marginRight: 18 }} onClick={handleOpenWhatsapp} />
                        <YoutubeOutlined className="cursorPointer" style={{ fontSize: 32 }} onClick={handleOpenYoutube} />
                        <InstagramOutlined className="cursorPointer" style={{ marginLeft: 18, marginRight: 18, fontSize: 32 }} onClick={handleOpenInstagram} />
                        {/* <TikTokOutlined style={{ fontSize: 32 }} /> */}
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
                            if (navbarName === "contactUs") {
                                navbarName = "CONTACT US"
                            }
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
                        <img className="d-none d-lg-block cursorPointer" src={indFlag} alt="indFlag" style={{ width: 24, marginRight: 8 }} onClick={() => changeLanguageHandler("id")} />
                        <span onClick={() => changeLanguageHandler("id")}
                            className={`d-none d-lg-block cursorPointer ${currentLanguage === "id" ? "textColorSelected" : ""}`}>ID</span>
                        <span className="d-none d-lg-block separator"></span>
                        <span onClick={() => changeLanguageHandler("en")}
                            className={`d-none d-lg-block cursorPointer ${currentLanguage === "en" ? "textColorSelected" : ""}`}>EN</span>
                        <img className="d-none d-lg-block cursorPointer" src={ukFlag} alt="ukFlag" style={{ width: 24, marginLeft: 8 }} onClick={() => changeLanguageHandler("en")} />
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
                                if (navbarName === "contactUs") {
                                    navbarName = "CONTACT US"
                                }
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