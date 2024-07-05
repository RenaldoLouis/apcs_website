import React from "react";
import {
    CaretRightOutlined,
} from '@ant-design/icons';

const PillButton = (props) => {
    const { text, isWhite = true, icon = null, onClick } = props;
    return (
        <div className={`flex cursorPointer ${isWhite ? "whitePill" : "blackPill"}`} onClick={onClick}>
            {icon}
            {/* <CaretRightOutlined style={{ marginRight: 8, fontSize: 24 }} /> */}
            <div className="pillButtonFontSize">
                {text}
            </div>
        </div>
    )
}

export default PillButton;