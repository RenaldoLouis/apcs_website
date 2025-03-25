import { Button } from "@mui/material";
import React from "react";
import { useAuth } from "../../context/DataContext";

const PillButton = (props) => {
    const { text, isWhite = true, icon = null, onClick } = props;
    const { isMobileAndSmaller, isSmallMobileAndSmaller } = useAuth();
    return (
        // <div className={`flex cursorPointer ${isWhite ? "whitePill" : "blackPill"}`} onClick={onClick}>
        //     {icon}
        //     {/* <CaretRightOutlined style={{ marginRight: 8, fontSize: 24 }} /> */}
        //     <div className="pillButtonFontSize">
        //         {text}
        //     </div>
        // </div>

        <Button
            className="mosafinFont"
            startIcon={icon}
            // size={"medium"}
            variant="contained"
            sx={{
                width: 150,
                zIndex: 10,
                fontSize: isSmallMobileAndSmaller ? "10px" : "1.5vmin",
                borderRadius: 25,
                background: "rgba(128,128,128,255)",
                fontWeight: 'bold',
                "&:hover": {
                    background: "rgba(160, 160, 160, 1)", // subtle lighter gray
                },
            }}
            onClick={onClick}>{text}</Button>
    )
}

export default PillButton;