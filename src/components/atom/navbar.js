import {
    InstagramOutlined,
    WhatsAppOutlined,
    YoutubeOutlined
} from '@ant-design/icons';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import apcLogo from "../../assets/images/apc_logo.svg";
import APCS_SVG from "../../assets/images/APCS_SVG.svg";
import indFlag from "../../assets/images/indFlag.jpg";
import navbarMobileBackground from "../../assets/images/navbarMobileBackground.jpg";
import ukFlag from "../../assets/images/ukFlag.png";
import { PathName } from "../../constant/PathName";
import { PillButtonType } from '../../constant/PillButtonType';
import PillButton from './PillButton';

const Navbar = (props) => {
    const { isNavbarMobileOpen, setIsNavbarMobileOpen } = props
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isTabletAndSmaller = useMediaQuery(theme.breakpoints.down('md'));
    const isLaptopAndSmaller = useMediaQuery(theme.breakpoints.down('lg'));

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
                                navbarName = "CONTACT_US"
                            }
                            else {
                                return (
                                    <div
                                        key={`${eachPath}`}
                                        style={{ height: "fit-content", fontSize: 16 }}
                                        className={`itemMenuSelected ${currentPage === path ? "selected textColorSelected" : ""}`} onClick={() => handleMovePage(path)}>
                                        {t(navbarName.toUpperCase())}
                                    </div>
                                )
                            }
                        })}
                    </div>
                    <div className="col-2 d-flex align-items-center justify-content-center" style={{ marginRight: isLaptopAndSmaller ? "19px" : "0px" }}>
                        <div className="logoContainerMobile" style={{ zIndex: 999 }}>
                            {/* <MenuOutlined onClick={handleOpenMenuMobile} /> */}
                            <PillButton type={PillButtonType.SECONDARY} text={"Menu"} onClick={handleOpenMenuMobile} />
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


            {/* #region navbar mobile */}
            <div className="navbarContainerMobile" >
                <div className={`menuNavbarContainer  ${isNavbarMobileOpen ? "open" : ""}`} style={{ backgroundImage: `url(${navbarMobileBackground})` }}>
                    <div className='d-flex justify-spaceBetween w-100'>
                        <img loading="lazy" src={APCS_SVG} alt="apcsLogo" style={{ width: 116 }} />
                        <PillButton type={PillButtonType.SECONDARY} text={"Close"} onClick={handleCloseMenuMobile} />
                    </div>
                    <div className="d-flex flex-column" style={{ width: '100%', height: "100%", justifyContent: "space-between", marginTop: "60px" }}>
                        <div style={{ display: 'flex', flexDirection: "column", gap: "1rem" }}>
                            {Object.keys(PathName).map((eachPath) => {
                                let path = PathName[eachPath]
                                let navbarName = PathName[eachPath].substring(1);
                                if (navbarName === "contactUs") {
                                    navbarName = "CONTACT_US"
                                }
                                else {
                                    return (
                                        <div
                                            key={`navbarContainerMobile-${eachPath}`}
                                            className={`plus-jakarta-sans-font itemMenuSelected ${currentPage === path ? "selected textColorSelected" : ""}`} onClick={() => handleMovePage(path)}>
                                            {t(navbarName.toUpperCase())}
                                        </div>
                                    )
                                }
                            })}
                        </div>
                        <span className="logoContainerMobile">
                            <div className="p-2 align-self-center">
                                &copy;2024 APCS. All Rights Reserved
                            </div>
                        </span>
                    </div>
                </div>
            </div>
            {/* #endregion navbar mobile */}
        </nav>
    );
}

export default Navbar;