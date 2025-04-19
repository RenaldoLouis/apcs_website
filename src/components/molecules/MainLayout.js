import {
    CloseOutlined
} from '@ant-design/icons';
import { Box } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PathName } from "../../constant/PathName";
import { PillButtonType } from "../../constant/PillButtonType";
import { useAuth } from '../../context/DataContext';
import Navbar from "../atom/navbar";
import PillButton from "../atom/PillButton";
import Footer from "./Footer";

const MainLayout = (props) => {
    const { children, hidden = false } = props
    const navigate = useNavigate();

    const { isSmallMobileAndSmaller, isMobileAndBigger } = useAuth();

    const [isNavbarMobileOpen, setIsNavbarMobileOpen] = useState(false);
    const [isShowStickyFooter, setIsShowStickyFooter] = useState(true);

    const handleClickRegister = () => {
        navigate(PathName.register);
    }

    const handleRemoveStickyFooter = () => {
        setIsShowStickyFooter(false)
    }

    const handleDirectToWhatsApp = () => {
        window.open("https://api.whatsapp.com/send/?phone=6282213002686", '_blank');
    }

    const isShowFooterRegister = () => {
        if (window.location.pathname === PathName.register) {
            return false
        } else if (isSmallMobileAndSmaller) {
            return false
        } else {
            return true
        }
    }

    return (
        <>
            <Navbar
                setIsNavbarMobileOpen={setIsNavbarMobileOpen}
                isNavbarMobileOpen={isNavbarMobileOpen} />
            <section>
                {children}
            </section>
            <Footer />

            {/* TO DO update View */}
            {isShowFooterRegister() && (
                <footer className={isShowStickyFooter ? "sticky-footer" : "sticky-footer-hidden"}>
                    <Box className="row">
                        <Box className="col-12 d-flex justify-content-around align-items-center">
                            <p style={{ visibility: "hidden" }} />
                            <p style={{ marginBottom: 0 }}>Don’t miss your chance to register! Take this opportunity to perform with the orchestra</p>
                            <Box className="d-flex">
                                <PillButton type={PillButtonType.PRIMARY} text={"Register"} onClick={handleDirectToWhatsApp} />

                                <CloseOutlined style={{ marginLeft: 36, cursor: "pointer" }} onClick={handleRemoveStickyFooter} />
                            </Box>
                        </Box>
                    </Box>
                </footer>
            )}

            {isNavbarMobileOpen && (
                <div className="backdrop" />
            )}
        </>
    )
}

export default MainLayout;
