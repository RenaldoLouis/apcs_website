import React from "react";
import ArrowUp from "../../assets/icons/ArrowUp.png"
import apcLogo from "../../assets/images/apc_logo.svg"
import {
    MenuOutlined,
    CloseOutlined,
    YoutubeOutlined,
    InstagramOutlined,
    TikTokOutlined
} from '@ant-design/icons';
import { PathName } from "../../constant/PathName";
import { useNavigate } from "react-router-dom";

const Footer = () => {
    const navigate = useNavigate();

    const handleClickScrollToTop = () => {
        window.scrollTo(0, 0);
    }

    const handleMovePage = (path) => {
        navigate(path);
    }

    return (
        <footer className="footer">
            <div className="container-fluid">
                {/* <img loading="lazy" className="cursorPointer" src={ArrowUp} style={{ width: 54, height: 54 }} alt="ArrowUp" onClick={handleClickScrollToTop} /> */}

                <div className="row row-cols-1 row-cols-lg-5">
                    {/* <div className="row"> */}
                    <div className="col d-flex align-items-center justify-content-center">
                        <img loading="lazy" src={apcLogo} alt="apcsLogo" style={{ height: "8rem" }} />
                    </div>
                    <div className="col-2 d-flex flex-column align-items-start">
                        <div className="headerFooter">
                            APCS
                        </div>
                        {Object.keys(PathName).map((eachPath) => {
                            let path = PathName[eachPath]
                            let navbarName = PathName[eachPath].substring(1);
                            return (
                                <div
                                    // style={{ height: "fit-content", fontSize: 16 }}
                                    // className={`itemMenuSelected ${currentPage === path ? "selected textColorSelected" : ""}`}
                                    onClick={() => handleMovePage(path)}>
                                    {navbarName.toUpperCase()}
                                </div>
                            )
                        })}
                    </div>
                    <div className="col-2 d-flex flex-column align-items-start">
                        <div className="headerFooter">
                            Contact
                        </div>
                        <div>
                            apcs@gmail.com
                        </div>
                        <div>
                            (+62)821-1234-1234
                        </div>
                    </div>
                    <div className="col-2 d-flex flex-column align-items-start" >
                        <div className="headerFooter">
                            Location
                        </div>
                        <div>
                            APCS Studio
                        </div>
                        <div>
                            Jakarta, Indonesia
                        </div>
                    </div>
                    <div className="col-3 d-flex flex-column justify-content-center">
                        {/* <div className="col-sm-4 col-lg-3 d-flex flex-column justify-content-center"> */}
                        <div className="">
                            <YoutubeOutlined style={{ fontSize: 32 }} />
                            <InstagramOutlined style={{ marginLeft: 36, marginRight: 36, fontSize: 32 }} />
                            <TikTokOutlined style={{ fontSize: 32 }} />
                        </div>
                        <div className="">
                            (c)2024 APCS. All Rights Reserved
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;