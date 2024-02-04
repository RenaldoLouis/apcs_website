import React from "react";

const Navbar = () => {
    return (
        <nav className="navbarContainer">
            <span className="text-3xl">
                BgVideo
            </span>
            <ul >
                <li className="">
                    Home
                </li>
                <li className="">
                    About
                </li>
                <li className="">
                    Contact
                </li>
                <li>
                    <div className="divider"></div>
                </li>
                <li className="portfolio">
                    My portofolio
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;