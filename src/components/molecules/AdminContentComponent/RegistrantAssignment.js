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
import * as FileSaver from "file-saver";
import ExcelJS from "exceljs";

const RegistrantAssignment = ({ allData, isLoading }) => {
    const [totalDaysEvent, setTotalDaysEvent] = useState(2);
    const [totalSteps, setTotalSteps] = useState([]);
    const [spinning, setSpinning] = React.useState(false);
    const [isAbleToExport, setIsAbleToExport] = useState(false);

    useEffect(() => {
        setSpinning(isLoading)
    }, [isLoading])

    const splitIntoFour = (arr, totalGroup) => {
        const chunks = [];
        const chunkSize = Math.ceil(arr.length / totalGroup); // Calculate chunk size (round up)

        for (let i = 0; i < arr.length; i += chunkSize) {
            chunks.push(arr.slice(i, i + chunkSize));
        }
        return chunks;
    };

    const handleClickAssignRegistrant = () => {
        setIsAbleToExport(true)
        setSpinning(true)

        allData.sort((a, b) => {
            // 1. Sort by achievement (Gold > Silver)
            const achievementOrder = { DIAMOND: 0, SILVER: 1, GOLD: 2 }; // Define the order
            const achievementA = achievementOrder[a.achievement];
            const achievementB = achievementOrder[b.achievement];

            if (achievementA !== achievementB) {
                return achievementA - achievementB;  // Sort by achievement
            }

            // 2. If achievements are the same, sort by teacher name
            const teacherA = a.teacher.toLowerCase(); // Case-insensitive sorting
            const teacherB = b.teacher.toLowerCase();

            if (teacherA < teacherB) {
                return -1;
            }
            if (teacherA > teacherB) {
                return 1;
            }
            return 0; // Teacher names are the same
        });

        const groupedArray = splitIntoFour(allData, totalSteps.length * 2);

        const AssignedSession = [...totalSteps]

        const mod = groupedArray.length % 4

        let tempArray = []
        let tempArray2 = []
        if (mod !== 2) {
            // 2 days
            tempArray.push(groupedArray[0])
            tempArray.push(groupedArray[1])
            tempArray2.push(groupedArray[2])
            tempArray2.push(groupedArray[3])
            AssignedSession[0].data = tempArray
            AssignedSession[1].data = tempArray2
        } else {
            // 1 days
            tempArray.push(groupedArray[0])
            tempArray.push(groupedArray[1])
            AssignedSession[0].data = tempArray
        }

        setTotalSteps(AssignedSession)

        setSpinning(false)
    }

    const handleChangeEventDays = (value) => {
        setTotalDaysEvent(value)
    };

    useEffect(() => {
        setIsAbleToExport(false)
        let tempArray = []
        for (let i = 1; i <= totalDaysEvent; i++) {
            tempArray.push(
                {
                    "day": i
                })
        }
        setTotalSteps(tempArray)
    }, [totalDaysEvent])

    const exportDataToExcel = (data, filename = "data.xlsx") => {
        const workbook = new ExcelJS.Workbook();

        data.forEach(dayData => {
            dayData.data.forEach((sessionData, sessionIndex) => { // Iterate through sessions
                const worksheet = workbook.addWorksheet(`Day ${dayData.day} - Session ${sessionIndex + 1}`);

                if (sessionData.length > 0) { // Check if sessionData is not empty
                    const headers = Object.keys(sessionData[0]);
                    worksheet.addRow(headers);

                    sessionData.forEach(item => {
                        const values = headers.map(header => item[header]);
                        worksheet.addRow(values);
                    });
                } else {
                    worksheet.addRow(["No data for this session."]); // Add a message for empty sessions
                }
            });
        });

        workbook.xlsx.writeBuffer().then(buffer => {
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            FileSaver.saveAs(blob, filename);
        });
    };

    const handleExportToExcel = () => {
        exportDataToExcel(totalSteps);
    }

    console.log("totalSteps", totalSteps)
    return (
        <div >
            <Spin tip="Loading..." spinning={spinning} fullscreen />

            <div className="flex-column w-15">
                <Button loading={isLoading} className="mb-12" type="primary" onClick={handleClickAssignRegistrant}>Assign Registrant</Button>
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
                {/* <Button loading={isLoading} className="mb-12" type="primary" onClick={handleClickSaveToDb}>Save To DB</Button> */}
                <Button loading={isLoading} type="primary" onClick={handleExportToExcel} disabled={!isAbleToExport}>Export to excel</Button>
            </div>

            <div className="flex justify-center">
                <Typograhpy
                    className="mb-12"
                    text={"Day of Events Rundown"}
                    size={TextSizeType.big}
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
                            <h2 className="mb-16 d-flex justify-center">
                                {`Day ${index + 1}`}
                            </h2>
                            <div className="d-flex">

                                <DragDrop eachEvent={eachEvent} session={1} />
                                <DragDrop eachEvent={eachEvent} session={2} />
                            </div>
                        </div>
                    </DndProvider>
                ))}
            </div>
        </div>
    )
}

export default RegistrantAssignment;