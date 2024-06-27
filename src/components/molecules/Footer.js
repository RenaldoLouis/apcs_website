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
            <div className="container">
                {/* <img loading="lazy" className="cursorPointer" src={ArrowUp} style={{ width: 54, height: 54 }} alt="ArrowUp" onClick={handleClickScrollToTop} /> */}

                <div className="row">
                    <div className="col">
                        <img loading="lazy" src={apcLogo} alt="apcsLogo" />
                    </div>
                    <div className="col">
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
                    <div className="col">
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
                    <div className="col" >
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
                    <div className="col-4 d-flex justify-content-end">
                        <YoutubeOutlined style={{ fontSize: 32 }} />
                        <InstagramOutlined style={{ marginLeft: 36, marginRight: 36, fontSize: 32 }} />
                        <TikTokOutlined style={{ fontSize: 32 }} />
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;