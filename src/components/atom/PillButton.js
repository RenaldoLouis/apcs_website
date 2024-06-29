import React from "react";

const PillButton = (props) => {
    const { text, isWhite = true } = props;
    return (
        <div className={`cursorPointer ${isWhite ? "whitePill" : "blackPill"}`} >
            <div className="pillButtonFontSize">
                {text}
            </div>
        </div>
    )
}

export default PillButton;