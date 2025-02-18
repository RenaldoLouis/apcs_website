import React, { useEffect, useState } from "react";
import { Steps } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { RegistrantStatus } from "../../../constant/RegistrantStatus";
import Typograhpy from "../../atom/Typograhpy";
import { TextSizeType } from "../../../constant/TextSizeType";
import RundownEventSteps from "./RundownEventSteps";
import { Space, TimePicker, Form, Button } from 'antd';
import { InputNumber } from 'antd';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import DragDrop from "./DragDrop";

const RegistrantAssignment = () => {

    const [totalDaysEvent, setTotalDaysEvent] = useState(3);
    const [totalSteps, setTotalSteps] = useState([]);

    const handleClickAssignRegistrant = () => {

    }

    const handleClickSaveToDb = () => {
        console.log("totalSteps", totalSteps)
    }

    const handleChangeEventDays = (value) => {
        setTotalDaysEvent(value)
    };

    useEffect(() => {
        let tempArray = []
        for (let i = 1; i <= totalDaysEvent; i++) {
            tempArray.push(
                {
                    "day": i
                })
        }
        setTotalSteps(tempArray)
    }, [totalDaysEvent])

    const handleExportToExcel = () => {

    }

    return (
        <div >
            <div className="flex-column w-15">
                <Button className="mb-12" type="primary" onClick={handleClickAssignRegistrant}>Assign Registrant</Button>
                <InputNumber
                    className="mb-12"
                    suffix="Days"
                    min={1} max={3}
                    defaultValue={totalDaysEvent}
                    onChange={handleChangeEventDays}
                    style={{
                        width: '100%',
                    }}
                />
                <Button className="mb-12" type="primary" onClick={handleClickSaveToDb}>Save To DB</Button>
                <Button type="primary" onClick={handleExportToExcel}>Export to excel</Button>
            </div>

            <div className="flex justify-center">
                <Typograhpy
                    className="mb-12"
                    text={"Day of Events Rundown"}
                    size={TextSizeType.medium}
                    style={{ color: "black" }}
                />
            </div>
            {/* <div className="flex justify-evenly">
                {totalSteps.map((eachEvent) => (
                    <RundownEventSteps eachEvent={eachEvent} day={eachEvent.day} totalSteps={totalSteps} setTotalSteps={setTotalSteps} />
                ))}
            </div> */}

            <DndProvider backend={HTML5Backend}>
                <DragDrop />
            </DndProvider>
        </div>
    )
}

export default RegistrantAssignment;