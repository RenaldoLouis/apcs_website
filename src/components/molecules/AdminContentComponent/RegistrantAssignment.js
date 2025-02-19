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
        setSpinning(true)
        const first50 = allData.slice(0, 50); // Get elements from index 0 up to (but not including) 50

        first50.sort((a, b) => {
            // 1. Sort by achievement (Gold > Silver)
            const achievementOrder = { GOLD: 0, SILVER: 1, DIAMOND: 2 }; // Define the order
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

        const groupedArray = splitIntoFour(first50, totalSteps.length * 2);

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

    const handleClickSaveToDb = () => {
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

    const exportDataToExcel = (data, filename = "data", sheetname = "Sheet1") => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(sheetname);

        console.log("data", data)
        // Add header row (optional, but recommended)
        const headerRow = Object.keys(data[0].data[0][0]); // Get keys from the first data item
        worksheet.addRow(headerRow);

        // Add data rows for each day
        data.forEach(dayData => {
            dayData.data.forEach(items => { // Iterate through the array of arrays
                items.forEach(item => { // Iterate through the items in each inner array
                    const values = Object.values(item);
                    worksheet.addRow(values);
                });
            });
        });

        workbook.xlsx.writeBuffer().then(buffer => {
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            FileSaver.saveAs(blob, filename + '.xlsx');
        });
    };

    const handleExportToExcel = () => {
        console.log("totalSteps", totalSteps)
        const myData = totalSteps;
        exportDataToExcel(myData); // Or exportDataToExcel(myData, "my_excel_file", "Participants");
    }

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
                <Button loading={isLoading} type="primary" onClick={handleExportToExcel}>Export to excel</Button>
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