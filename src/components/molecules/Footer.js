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

const Footer = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isTabletAndSmaller = useMediaQuery(theme.breakpoints.down('md'));

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

    return (
        <footer className="footer">
            <div className="container-fluid">
                {isTabletAndSmaller ? (
                    <div class="d-flex flex-column">
                        <div class="p-2">
                            <img loading="lazy" src={apcLogo} alt="apcsLogo" style={{ height: "6rem" }} />
                        </div>
                        <div className="d-flex flex-column align-items-start">
                            <div class="p-2 text-align-start" style={{ display: "grid", gap: 5 }}>
                                <div className="mb-3" style={{ fontWeight: 900 }}>
                                    APCS
                                </div>
                                {Object.keys(PathName).map((eachPath) => {
                                    let path = PathName[eachPath]
                                    let navbarName = PathName[eachPath].substring(1);
                                    return (
                                        <div
                                            style={{ fontSize: 16 }}
                                            className={`mb-1 itemMenuSelected ${currentPage === path ? "selected textColorSelected" : ""}`}
                                            onClick={() => handleMovePage(path)}>
                                            {navbarName.toUpperCase()}
                                        </div>
                                    )
                                })}
                            </div>
                            <div class="p-2 text-align-start">
                                <div className="mb-3" style={{ fontWeight: 900 }}>
                                    Contact
                                </div>
                                <div>
                                    apcs@gmail.com
                                </div>
                                <div>
                                    (+62) 821-1234-1234
                                </div>
                            </div>
                            <div class="p-2 text-align-start mb-5">
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
                            <div class="p-2 align-self-center">
                                <YoutubeOutlined style={{ fontSize: 32 }} />
                                <InstagramOutlined style={{ marginLeft: 36, marginRight: 36, fontSize: 32 }} />
                                <TikTokOutlined style={{ fontSize: 32 }} />
                            </div>
                            <div class="p-2 align-self-center">
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
                                return (
                                    <div
                                        style={{ fontSize: 16 }}
                                        className={`mb-1 itemMenuSelected ${currentPage === path ? "selected textColorSelected" : ""}`}
                                        onClick={() => handleMovePage(path)}>
                                        {navbarName.toUpperCase()}
                                    </div>
                                )
                            })}
                        </div>
                        <div className="col-3 d-flex flex-column align-items-start">
                            <div className="headerFooter">
                                Contact
                            </div>
                            <div>
                                apcs@gmail.com
                            </div>
                            <div>
                                (+62) 821-1234-1234
                            </div>
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
                        <div className="col-3 d-flex flex-column">
                            {/* <div className="col-sm-4 col-lg-3 d-flex flex-column justify-content-center"> */}
                            <div className="text-align-end">
                                <WhatsAppOutlined style={{ fontSize: 30, marginRight: 36 }} />
                                <YoutubeOutlined className="cursorPointer" style={{ fontSize: 32 }} onClick={handleOpenYoutube} />
                                <InstagramOutlined className="cursorPointer" style={{ marginLeft: 36, fontSize: 32 }} onClick={handleOpenInstagram} />
                                {/* <TikTokOutlined style={{ fontSize: 32 }} /> */}
                            </div>
                            <div className="text-align-end">
                                (c)2024 APCS. All Rights Reserved
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </footer>
    )
}

export default Footer;