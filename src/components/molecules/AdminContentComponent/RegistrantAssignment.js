import React, { useEffect, useState } from "react";
import { LoadingOutlined } from '@ant-design/icons';
import { RegistrantStatus } from "../../../constant/RegistrantStatus";
import Typograhpy from "../../atom/Typograhpy";
import { TextSizeType } from "../../../constant/TextSizeType";
import RundownEventSteps from "./RundownEventSteps";
import { Space, TimePicker, Form, Button, Spin, InputNumber, Collapse } from 'antd';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import DragDrop from "./DragDrop";
import * as FileSaver from "file-saver";
import ExcelJS from "exceljs";
import { shuffleArray, splitEvenlyBetweenTwo } from "../../../utils/Utils";

const RegistrantAssignment = ({ allData, isLoading }) => {
    const [totalDaysEvent, setTotalDaysEvent] = useState(2);
    const [totalSessionEvent, setTotalSessionEvent] = useState(5);
    const [sessions, setSessions] = useState([]);
    const [totalSteps, setTotalSteps] = useState([]);
    const [spinning, setSpinning] = React.useState(false);
    const [isAbleToExport, setIsAbleToExport] = useState(false);

    useEffect(() => {
        setSpinning(isLoading)
    }, [isLoading])

    const handleClickAssignRegistrant = () => {
        setIsAbleToExport(true);
        setSpinning(true);

        // 1. Sort by achievement (DIAMOND > GOLD > SILVER)
        const achievementOrder = { DIAMOND: 0, GOLD: 1, SILVER: 2 };
        allData.sort((a, b) => {
            const achievementA = achievementOrder[a.achievement];
            const achievementB = achievementOrder[b.achievement];

            if (achievementA !== achievementB) {
                return achievementA - achievementB;  // Sort by achievement
            }

            // If achievements are the same, sort by teacher name
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

        // 2. Separate DIAMOND, GOLD, and SILVER participants
        const diamondData = allData.filter((item) => item.achievement === 'DIAMOND');
        const goldData = allData.filter((item) => item.achievement === 'GOLD');
        const silverData = allData.filter((item) => item.achievement === 'SILVER');

        // 3. Shuffle the GOLD and SILVER participants together to mix them
        // const goldAndSilverData = [...goldData, ...silverData];
        const goldAndSilverData = shuffleArray([...goldData, ...silverData]);

        // 4. Split DIAMOND and the combined GOLD/SILVER participants evenly between both days
        const diamondGroups = splitEvenlyBetweenTwo(diamondData);
        const goldAndSilverGroups = splitEvenlyBetweenTwo(goldAndSilverData);

        const sortedGoldAndSilverGroups = goldAndSilverGroups.map((eachData) => {
            eachData.sort((a, b) => {
                const achievementA = achievementOrder[a.achievement];
                const achievementB = achievementOrder[b.achievement];

                if (achievementA !== achievementB) {
                    return achievementA - achievementB;  // Sort by achievement
                }

                // If achievements are the same, sort by teacher name
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

            return eachData;
        })

        // 5. Structure the result as per your requirement, splitting evenly across days
        const AssignedSession = [
            {
                day: 1,
                data: [
                    diamondGroups[0], // DIAMOND participants for day 1
                    sortedGoldAndSilverGroups[0], // GOLD and SILVER participants for day 1 (evenly mixed)
                ]
            },
            {
                day: 2,
                data: [
                    diamondGroups[1], // DIAMOND participants for day 2
                    sortedGoldAndSilverGroups[1], // GOLD and SILVER participants for day 2 (evenly mixed)
                ]
            }
        ];

        // 6. Set the results
        setTotalSteps(AssignedSession);
        setSpinning(false);
    };

    const handleChangeEventDays = (value) => {
        setTotalDaysEvent(value)
    };

    const handleChangeTotalSession = (value) => {
        setTotalSessionEvent(value)
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

    useEffect(() => {
        setIsAbleToExport(false)
        let tempArray = []
        for (let i = 1; i <= totalSessionEvent; i++) {
            tempArray.push(
                {
                    key: i,
                    label: `This is session ${i}`,
                    children: <p>Dummy</p>,
                },
            )
        }
        setSessions(tempArray)
    }, [totalSessionEvent])

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
                <InputNumber
                    className="mb-12"
                    suffix="Sessions"
                    min={4} max={5}
                    defaultValue={totalSessionEvent}
                    onChange={handleChangeTotalSession}
                    style={{
                        width: '100%',
                    }}
                />
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

            <Collapse items={sessions} defaultActiveKey={['1']} />

            <div className="d-flex justify-evenly">
                {totalSteps.map((eachEvent, index) => (
                    <DndProvider backend={HTML5Backend}>
                        <div className="dayContainer">
                            <h2 className="mb-16 d-flex justify-center">
                                {`Day ${index + 1}`}
                            </h2>
                            <div className="d-flex">

                                <DragDrop eachEvent={eachEvent} stage={1} />
                                <DragDrop eachEvent={eachEvent} stage={2} />
                            </div>
                        </div>
                    </DndProvider>
                ))}
            </div>
        </div>
    )
}

export default RegistrantAssignment;