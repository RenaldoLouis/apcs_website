import React from "react";
import angLogo from '../../assets/images/ANG-Logo.png';


const Navbar = () => {
    return (
        <div className="navbarContainer">
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
        </div>
    );
}

export default Navbar;