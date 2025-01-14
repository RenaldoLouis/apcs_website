import React from "react";
import { TextSizeType } from "../../constant/TextSizeType";

const Typograhpy = ({ text, size }) => {

    let fontSize = () => {
        switch (size) {
            case TextSizeType.small:
                return "fontSizeBody"
            case TextSizeType.medium:
                return "fontSizeSubHeader"
            case TextSizeType.big:
                return "fontSizeHeader"
            default:
                return "fontSizeBody"
        }
    }

    return (
        <div className={`${fontSize()}`} style={{ color: "white", textWrap: "nowrap" }}>
            {text}
        </div>
    )
}

export default Typograhpy;