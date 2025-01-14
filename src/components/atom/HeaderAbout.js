import React from "react";
import { useAuth } from "../../context/DataContext";

const HeaderAbout = ({ title }) => {
    const { isMobileAndBigger, isMobileAndSmaller } = useAuth()

    return (
        <div>
            <span style={{ fontSize: isMobileAndSmaller ? "8vmin" : 36, letterSpacing: 4 }}> OUR NOTABLE </span> <br />  <span className="italicText" style={{ fontSize: isMobileAndSmaller ? "10vmin" : 64 }}>{title}</span>
        </div>
    )
}

export default HeaderAbout