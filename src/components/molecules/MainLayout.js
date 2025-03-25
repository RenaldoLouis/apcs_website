import React, { useState } from "react";
import Navbar from "../atom/navbar";
import Footer from "./Footer";

const MainLayout = (props) => {
    const { children, hidden = false } = props
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

            {/* TO DO update View */}
            {/* <footer className="sticky-footer">
                <p>Event news</p>
            </footer> */}

            {isNavbarMobileOpen && (
                <div className="backdrop" />
            )}
        </>
    )
}

export default MainLayout;
