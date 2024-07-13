import React from "react";

const HeaderTitle = (props) => {

    const { fontSize = "medium", children } = props

    return (
        <div className="goldenTextColor mangolaineFont text-align-center lineHeightNormal" style={{ fontSize: fontSize === "medium" ? "7vmin" : "3.5vmin" }}>
            {children}
        </div>
    )
}

export default HeaderTitle;