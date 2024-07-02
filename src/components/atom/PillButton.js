import React from "react";
import {
    CaretRightOutlined,
} from '@ant-design/icons';

const PillButton = (props) => {
    const { text, isWhite = true, icon = null } = props;
    return (
        <div className={`flex cursorPointer ${isWhite ? "whitePill" : "blackPill"}`} >
            <CaretRightOutlined style={{ marginRight: 8, fontSize: 24 }} />
            <div className="pillButtonFontSize">
                {text}
            </div>
        </div>
    )
}

export default PillButton;