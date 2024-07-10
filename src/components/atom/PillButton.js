import React from "react";
import {
    CaretRightOutlined,
} from '@ant-design/icons';
import { Button } from "@mui/material";
import { useAuth } from "../../context/DataContext";

const PillButton = (props) => {
    const { text, isWhite = true, icon = null, onClick } = props;
    const { isMobileAndSmaller } = useAuth();
    return (
        // <div className={`flex cursorPointer ${isWhite ? "whitePill" : "blackPill"}`} onClick={onClick}>
        //     {icon}
        //     {/* <CaretRightOutlined style={{ marginRight: 8, fontSize: 24 }} /> */}
        //     <div className="pillButtonFontSize">
        //         {text}
        //     </div>
        // </div>

        <Button
            startIcon={icon}
            size={isMobileAndSmaller ? "small" : "medium"}
            variant="outlined"
            sx={{ zIndex: 10, fontSize: "1.8vmin" }}
            onClick={onClick}>{text}</Button>
    )
}

export default PillButton;