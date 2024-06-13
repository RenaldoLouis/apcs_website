import React from "react";

const HeaderTitle = (props) => {

    const { fontSize = "medium", children } = props

    return (
        <div className="goldenTextColor mangolaineFont text-align-center lineHeightNormal" style={{ fontSize: fontSize === "medium" ? 64 : 32 }}>
            {children}
        </div>
    )
}

export default HeaderTitle;