import React, { useState } from "react";
import { ListEvent, YearlyEvent } from "../../constant/YearlyEvent";
import Galery from "./Galery";
import PillButton from "../../components/atom/PillButton";

const GaleryContent = () => {

    const [selectedEvent, setSelectenEvent] = useState(YearlyEvent.GHIBLI);

    const handleClickEvent = (eventName) => {
        setSelectenEvent(eventName)
    }

    return (
        <div className="primaryBackgroundBlack" style={{ padding: "48px 0px 48px 0px" }}>
            <div className="container">
                <div className="color-white" style={{ marginBottom: 74 }}>
                    YEAR
                </div>
                <div className="flex color-white" style={{ gap: 86 }}>
                    {ListEvent.map((eachEvent) => {

                        return (
                            <div className={`itemMenuSelected ${selectedEvent === eachEvent.title ? 'selected' : ''}`} onClick={() => handleClickEvent(eachEvent.title)}>
                                <div>
                                    {eachEvent.year}
                                </div>
                                <div>
                                    {eachEvent.title}
                                </div>
                            </div>
                        )
                    })}
                </div>
                <Galery />
                <div className="flex justify-center">
                    <PillButton text={"View More"} />
                </div>
            </div>
        </div>
    )
}

export default GaleryContent;