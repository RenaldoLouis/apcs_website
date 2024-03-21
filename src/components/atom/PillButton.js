import React from "react";

const PillButton = (props) => {
    const { text } = props;
    return (
        <div style={{ border: "1px solid black", borderWidth: "medium", borderRadius: 25, textAlign: "center", width: "fit-content", padding: "6px 50px" }}>
            <div style={{ fontWeight: 800 }}>
                {text}
            </div>
        </div>
    )
}

export default PillButton;