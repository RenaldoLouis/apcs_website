import React from "react";
import { useAuth } from "../../context/DataContext";

const HeaderAbout = ({ title }) => {
    const { isLaptopAndBigger, isLaptopAndSmaller } = useAuth()

    return (
        <div>
            <span style={{ fontSize: isLaptopAndSmaller ? "8vmin" : 36, letterSpacing: 4 }}> OUR NOTABLE </span> <br />  <span className="italicText" style={{ fontSize: isLaptopAndSmaller ? "10vmin" : 64 }}>{title}</span>
        </div>
    )
}

export default HeaderAbout