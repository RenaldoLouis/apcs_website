import { TextSizeType } from "../../constant/TextSizeType";

const Typography = ({ className, text, size, style = null }) => {

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
        <div className={`${className} ${fontSize()}`} style={style ? style : { color: "white", textWrap: "nowrap" }}>
            {text}
        </div>
    )
}

export default Typography;