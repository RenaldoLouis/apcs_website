import React from "react";
import podcastBacgkorund from "../../assets/images/podcastBacgkorund.png"
import musiciswhatapcs from "../../assets/images/musiciswhatapcs.svg"
import BackgroundWithText from "../../components/molecules/BacgkroundWithText";
import { ContentPosition } from "../../constant/ContentPosition";

const Podcast = () => {

    return (
        <div>
            {/* <CoverImage background={podcastBacgkorund} logo={musiciswhatapcs} isMiddleLeft={true} /> */}
            <BackgroundWithText
                image={podcastBacgkorund}
                logo={""}
                text={
                    <>
                        <div className="mangolaineFont goldenTextColor" style={{ fontSize: 96 }}>
                            STAY TUNED
                        </div>
                        <div className="goldenTextColor" style={{ fontSize: 36, letterSpacing: 16 }}>
                            AUGUST 2024
                        </div>
                    </>
                }
                buttonText={""}
                contentPosition={ContentPosition.MIDDLELEFT}
                centerText={false}
                noRelativeContainer={true}
            />
        </div>
    )
}

export default Podcast;