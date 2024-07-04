import React, { useState } from "react";
import Navbar from "../atom/navbar";
import Footer from "./Footer";

const MainLayout = (props) => {
    const { children } = props
    const [isNavbarMobileOpen, setIsNavbarMobileOpen] = useState(false);
    return (
        <>
            <Navbar
                setIsNavbarMobileOpen={setIsNavbarMobileOpen}
                isNavbarMobileOpen={isNavbarMobileOpen} />
            <section>
                {children}
            </section>
            <Footer />

            {isNavbarMobileOpen && (
                <div className="backdrop" />
            )}
        </>
    )
}

export default MainLayout;
