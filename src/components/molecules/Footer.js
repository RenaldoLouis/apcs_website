import React, { useEffect, useState } from "react";
import ArrowUp from "../../assets/icons/ArrowUp.png"
import apcLogo from "../../assets/images/apc_logo.svg"
import {
    MenuOutlined,
    CloseOutlined,
    YoutubeOutlined,
    InstagramOutlined,
    WhatsAppOutlined,
    TikTokOutlined
} from '@ant-design/icons';
import { PathName } from "../../constant/PathName";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Link } from '@mui/material';
import { useTranslation } from "react-i18next";

const Footer = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isTabletAndSmaller = useMediaQuery(theme.breakpoints.down('md'));
    const { t } = useTranslation();

    const [currentPage, setCurrentPage] = useState();

    const handleClickScrollToTop = () => {
        window.scrollTo(0, 0);
    }

    const handleMovePage = (path) => {
        handleClickScrollToTop()
        navigate(path);
    }

    useEffect(() => {
        setCurrentPage(location.pathname)
    }, [location])

    const handleOpenYoutube = () => {
        window.open("https://www.youtube.com/@apcsmusic", '_blank');
    }

    const handleOpenInstagram = () => {
        window.open("https://www.instagram.com/apcs.music/?img_index=6", '_blank');
    }

    const handleOpenWhatsapp = () => {
        window.open("https://api.whatsapp.com/send/?phone=6282213002686", '_blank');
    }

    const handleDirectToWhatsApp = () => {
        window.open("https://api.whatsapp.com/send/?phone=6281944163410", '_blank');
    }

    return (
        <footer className="footer">
            <div className="container-fluid">
                {isTabletAndSmaller ? (
                    <div className="d-flex flex-column">
                        <div className="p-2">
                            <img loading="lazy" src={apcLogo} alt="apcsLogo" style={{ height: "6rem" }} />
                        </div>
                        <div className="d-flex flex-column align-items-start">
                            <div className="p-2 text-align-start" style={{ display: "grid", gap: 5 }}>
                                <div className="mb-3" style={{ fontWeight: 900 }}>
                                    APCS
                                </div>
                                {Object.keys(PathName).map((eachPath) => {
                                    let path = PathName[eachPath]
                                    let navbarName = PathName[eachPath].substring(1);
                                    if (navbarName === "contactUs") {
                                        navbarName = "CONTACT US"
                                    }
                                    return (
                                        <div
                                            key={`footer-${eachPath}`}
                                            style={{ fontSize: 16 }}
                                            className={`mb-1 itemMenuSelected ${currentPage === path ? "selected textColorSelected" : ""}`}
                                            onClick={() => handleMovePage(path)}>
                                            {t(navbarName.toUpperCase())}
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="p-2 text-align-start">
                                <div className="mb-3" style={{ fontWeight: 900 }}>
                                    {t("contact")}
                                </div>
                                <Link
                                    href="mailto:hello@apcsmusic.com"
                                    className="cursorPointer"
                                    sx={{ textDecoration: 'none', color: 'inherit' }}
                                >
                                    hello@apcsmusic.com
                                </Link>
                                <div onClick={handleOpenWhatsapp} className="cursorPointer">
                                    (+62) 822-1300-2686
                                </div>
                            </div>
                            <div className="p-2 text-align-start mb-5">
                                <div className="mb-3" style={{ fontWeight: 900 }}>
                                    Location
                                </div>
                                <div>
                                    APCS Studio
                                </div>
                                <div>
                                    Jakarta, Indonesia
                                </div>
                            </div>
                            <div className="p-2 align-self-center">
                                <YoutubeOutlined style={{ fontSize: 32 }} />
                                <InstagramOutlined style={{ marginLeft: 36, marginRight: 36, fontSize: 32 }} />
                                <TikTokOutlined style={{ fontSize: 32 }} />
                            </div>
                            <div className="p-2 align-self-center">
                                (c)2024 APCS. All Rights Reserved
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="row">
                        <div className="col d-flex align-items-start justify-content-center">
                            <img loading="lazy" src={apcLogo} alt="apcsLogo" style={{ height: "6rem" }} />
                        </div>
                        <div className="col-2 d-flex flex-column align-items-start gap-3">
                            <div className="headerFooter">
                                APCS
                            </div>
                            {Object.keys(PathName).map((eachPath) => {
                                let path = PathName[eachPath]
                                let navbarName = PathName[eachPath].substring(1);
                                if (navbarName === "contactUs") {
                                    navbarName = "CONTACT_US"
                                }
                                return (
                                    <div
                                        key={`footer2-${eachPath}`}
                                        style={{ fontSize: 16 }}
                                        className={`mb-1 itemMenuSelected ${currentPage === path ? "selected textColorSelected" : ""}`}
                                        onClick={() => handleMovePage(path)}>
                                        {t(navbarName.toUpperCase())}
                                    </div>
                                )
                            })}
                        </div>
                        <div className="col-3 d-flex flex-column align-items-start gap-3">
                            <div className="headerFooter">
                                {t("contact")}
                            </div>
                            <Link
                                href="mailto:hello@apcsmusic.com"
                                className="cursorPointer"
                                sx={{ textDecoration: 'none', color: 'inherit' }}
                            >
                                hello@apcsmusic.com
                            </Link>

                            <div className="headerFooter mt-5" >
                                {t("regisInfo")}
                            </div>
                            <div onClick={handleOpenWhatsapp} className="cursorPointer">
                                (+62) 822-1300-2686
                            </div>
                            {/* <a href="https://api.whatsapp.com/send/?phone=6281944163410">
                                (+62) 819-4416-3410
                            </a> */}
                            {/* <div onClick={handleDirectToWhatsApp} className="cursorPointer">
                                Partnership
                            </div> */}
                            {/* <div >
                                
                            </div> */}
                            {/* <div> */}
                            {/* <div className="headerFooter mt-3">
                                Location
                            </div>
                            <div>
                                APCS Studio
                            </div>
                            <div>
                                Jakarta, Indonesia
                            </div> */}
                            {/* </div> */}
                        </div>
                        {/* <div className="col-1 d-flex flex-column align-items-start" >
                        
                    </div> */}
                        <div className="col-3 d-flex flex-column justify-content-sm-between">
                            {/* <div className="col-sm-4 col-lg-3 d-flex flex-column justify-content-center"> */}
                            <div className="text-align-end">
                                <WhatsAppOutlined style={{ fontSize: 30, marginRight: 36 }} onClick={handleOpenWhatsapp} />
                                <YoutubeOutlined className="cursorPointer" style={{ fontSize: 32 }} onClick={handleOpenYoutube} />
                                <InstagramOutlined className="cursorPointer" style={{ marginLeft: 36, fontSize: 32 }} onClick={handleOpenInstagram} />
                                {/* <TikTokOutlined style={{ fontSize: 32 }} /> */}
                            </div>
                            <div className="text-align-end">
                                &copy; 2024 APCS. All Rights Reserved
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </footer>
    )
}

export default Footer;