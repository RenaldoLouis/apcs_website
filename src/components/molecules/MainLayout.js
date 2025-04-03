import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PathName } from "../../constant/PathName";
import Navbar from "../atom/navbar";
import Footer from "./Footer";

const MainLayout = (props) => {
    const { children, hidden = false } = props
    const navigate = useNavigate();

    const [isNavbarMobileOpen, setIsNavbarMobileOpen] = useState(false);

    const handleClickRegister = () => {
        navigate(PathName.register);
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
            {/* <footer className="sticky-footer">
                <Box className="row">
                    <Box className="col-12 d-flex justify-content-around align-items-center">
                        <p style={{ visibility: "hidden" }} />
                        <p style={{ marginBottom: 0 }}>Take the stage in a world-class concert and earn your chance to perform at the heart of the orchestra.</p>
                        <Box className="d-flex">
                            <PillButton type={PillButtonType.PRIMARY} text={"Register"} onClick={handleClickRegister} />
                        </Box>
                    </Box>
                </Box>
            </footer> */}

            {isNavbarMobileOpen && (
                <div className="backdrop" />
            )}
        </>
    )
}

export default MainLayout;
