import React from "react";

const PillButton = (props) => {
    const { text, isWhite = true } = props;
    return (
        <div className={isWhite ? "whitePill" : "blackPill"} >
            <div style={{ fontWeight: 800 }}>
                {text}
            </div>
        </div>
    )
}

export default PillButton;