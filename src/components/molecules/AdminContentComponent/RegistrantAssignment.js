import React, { useEffect, useState } from "react";
import { LoadingOutlined } from '@ant-design/icons';
import { RegistrantStatus } from "../../../constant/RegistrantStatus";
import Typograhpy from "../../atom/Typograhpy";
import { TextSizeType } from "../../../constant/TextSizeType";
import RundownEventSteps from "./RundownEventSteps";
import { Space, TimePicker, Form, Button, Spin, InputNumber } from 'antd';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import DragDrop from "./DragDrop";

const RegistrantAssignment = ({ allData }) => {
    const [totalDaysEvent, setTotalDaysEvent] = useState(2);
    const [totalSteps, setTotalSteps] = useState([]);
    const [spinning, setSpinning] = React.useState(false);

    const handleClickAssignRegistrant = () => {
        const first50 = allData.slice(0, 50); // Get elements from index 0 up to (but not including) 50
        console.log("first50", first50)
        setSpinning(true)
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
            <Spin tip="Assigning..." spinning={spinning} fullscreen />

            <div className="flex-column w-15">
                <Button className="mb-12" type="primary" onClick={handleClickAssignRegistrant}>Assign Registrant</Button>
                <InputNumber
                    className="mb-12"
                    suffix="Days"
                    min={1} max={2}
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

            <div className="d-flex justify-evenly">
                {totalSteps.map((eachEvent, index) => (
                    <DndProvider backend={HTML5Backend}>
                        <div className="dayContainer">
                            <div className="mb-16 d-flex justify-center">
                                {`Day ${index + 1}`}
                            </div>
                            <div className="d-flex">

                                <DragDrop />
                                <DragDrop />
                            </div>
                        </div>
                    </DndProvider>
                ))}
            </div>
        </div>
    )
}

export default RegistrantAssignment;