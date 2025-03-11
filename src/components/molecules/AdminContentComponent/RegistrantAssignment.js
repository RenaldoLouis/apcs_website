import { Button, InputNumber, Spin } from 'antd';
import ExcelJS from "exceljs";
import * as FileSaver from "file-saver";
import moment from 'moment';
import React, { useEffect, useState } from "react";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TextSizeType } from "../../../constant/TextSizeType";
import { formatDuration, shuffleArray, splitEvenlyBetweenTwo } from "../../../utils/Utils";
import Typograhpy from "../../atom/Typograhpy";
import DragDrop from "./DragDrop";

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
        let AssignedDay = [
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

        // 6. Create Session for each Stage, Event->Day->Stage->Session
        //with max of each session of 1:30
        const timeFormat = "HH:mm:ss"
        const maxSessionDuration = moment.duration("01:30:00").asSeconds(); // 1 hour 30 minutes in seconds

        let sessions = [];
        let currentSession = [];
        let currentTotal = 0;

        AssignedDay = AssignedDay.map((eachDay) => {
            // Process each day's data array using map
            eachDay.data = eachDay.data.map((eachStage) => {
                let sessions = [];
                let currentSession = [];
                let currentTotal = 0;

                // Loop over each record in the stage (here we can use forEach, or map if you want to transform)
                eachStage.forEach((eachData) => {
                    // Convert record duration to seconds
                    const recordDuration = moment.duration(eachData.duration).asSeconds();

                    // Check if adding this record exceeds the session max duration (1:30:00)
                    if (currentTotal + recordDuration > maxSessionDuration) {
                        sessions.push({
                            records: currentSession,
                            totalDuration: formatDuration(currentTotal)  // Helper to convert seconds to "HH:mm:ss"
                        });
                        // Reset for the new session
                        currentSession = [];
                        currentTotal = 0;
                    }

                    // Add the record and update the current total duration
                    currentSession.push(eachData);
                    currentTotal += recordDuration;
                });

                // Add any remaining records as the final session
                if (currentSession.length) {
                    sessions.push({
                        records: currentSession,
                        totalDuration: formatDuration(currentTotal)
                    });
                }

                // Attach the sessionGroup to eachStage so changes are reflected immediately
                eachStage.sessionGroup = sessions;
                return eachStage;
            });

            return eachDay;
        });


        if (currentSession.length > 0) {
            sessions.push({
                records: currentSession,
                totalDuration: formatDuration(currentTotal)
            });
        }

        // 7. Set the results
        setTotalSteps(AssignedDay);
        setSpinning(false);
    };

    // const handleClickAssignRegistrant = () => {
    //     setIsAbleToExport(true);
    //     setSpinning(true);

    //     // 1. Sort by achievement (DIAMOND > GOLD > SILVER)
    //     const achievementOrder = { DIAMOND: 0, GOLD: 1, SILVER: 2 };
    //     allData.sort((a, b) => {
    //         const achievementA = achievementOrder[a.achievement];
    //         const achievementB = achievementOrder[b.achievement];

    //         if (achievementA !== achievementB) {
    //             return achievementA - achievementB;  // Sort by achievement
    //         }

    //         // If achievements are the same, sort by teacher name
    //         return a.teacher.toLowerCase().localeCompare(b.teacher.toLowerCase());
    //     });

    //     // 2. Separate DIAMOND, GOLD, and SILVER participants
    //     const diamondData = allData.filter((item) => item.achievement === 'DIAMOND');
    //     const goldData = allData.filter((item) => item.achievement === 'GOLD');
    //     const silverData = allData.filter((item) => item.achievement === 'SILVER');

    //     // 3. Shuffle the GOLD and SILVER participants together to mix them
    //     const goldAndSilverData = shuffleArray([...goldData, ...silverData]);

    //     // 4. Split DIAMOND and the combined GOLD/SILVER participants evenly between both days
    //     const diamondGroups = splitEvenlyBetweenTwo(diamondData);
    //     const goldAndSilverGroups = splitEvenlyBetweenTwo(goldAndSilverData);

    //     const sortedGoldAndSilverGroups = goldAndSilverGroups.map((eachData) => {
    //         return eachData.sort((a, b) => {
    //             const achievementA = achievementOrder[a.achievement];
    //             const achievementB = achievementOrder[b.achievement];

    //             if (achievementA !== achievementB) {
    //                 return achievementA - achievementB;  // Sort by achievement
    //             }

    //             return a.teacher.toLowerCase().localeCompare(b.teacher.toLowerCase());
    //         });
    //     });

    //     // 5. Create Sessions
    //     const maxSessionDuration = moment.duration("01:30:00").asSeconds(); // 1 hour 30 minutes in seconds

    //     let AssignedDay = [
    //         { day: 1, data: [diamondGroups[0], sortedGoldAndSilverGroups[0]] },
    //         { day: 2, data: [diamondGroups[1], sortedGoldAndSilverGroups[1]] }
    //     ];

    //     // Process each day and replace `data` with only `sessionGroup`
    //     AssignedDay = AssignedDay.map((eachDay) => {
    //         return {
    //             day: eachDay.day,
    //             sessionGroup: eachDay.data.map((eachStage) => {
    //                 let sessions = [];
    //                 let currentSession = [];
    //                 let currentTotal = 0;

    //                 eachStage.forEach((eachData) => {
    //                     const recordDuration = moment.duration(eachData.duration).asSeconds();

    //                     if (currentTotal + recordDuration > maxSessionDuration) {
    //                         sessions.push({
    //                             records: currentSession,
    //                             totalDuration: formatDuration(currentTotal)
    //                         });
    //                         currentSession = [];
    //                         currentTotal = 0;
    //                     }

    //                     currentSession.push(eachData);
    //                     currentTotal += recordDuration;
    //                 });

    //                 if (currentSession.length) {
    //                     sessions.push({
    //                         records: currentSession,
    //                         totalDuration: formatDuration(currentTotal)
    //                     });
    //                 }

    //                 return sessions;
    //             })
    //         };
    //     });

    //     // 6. Set the results
    //     setTotalSteps(AssignedDay);
    //     setSpinning(false);
    // };

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
                    label: `Session ${i}`,
                    children: <p>Dummy</p>,
                },
            )
        }
        setSessions(tempArray)
    }, [totalSessionEvent])

    const exportDataToExcel = (data, filename = "data.xlsx") => {
        const workbook = new ExcelJS.Workbook();

        data.forEach(dayData => {
            dayData.data.forEach((StageData, stageIndex) => {
                StageData.sessionGroup.forEach((eachSession, sessionIndex) => {
                    const worksheet = workbook.addWorksheet(`Day ${dayData.day} - Stage ${stageIndex + 1} - Session ${sessionIndex + 1}`);

                    const eachRecord = eachSession.records;

                    if (eachRecord.length > 0) {
                        const headers = Object.keys(eachRecord[0]);
                        worksheet.addRow(headers);

                        eachRecord.forEach(item => {
                            const values = headers.map(header => item[header]);
                            worksheet.addRow(values);
                        });
                    } else {
                        worksheet.addRow(["No data for this Rundown."]);
                    }
                })
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
                    disabled={true}
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

            <div className="d-flex justify-evenly">
                {totalSteps.map((eachEvent, index) => (
                    <DndProvider backend={HTML5Backend}>
                        <div className="dayContainer">
                            <h2 className="mb-16 d-flex justify-center">
                                {`Day ${index + 1}`}
                            </h2>
                            <div className="d-flex">

                                <DragDrop eachEvent={eachEvent} stage={1} dayIndex={index} totalSteps={totalSteps} setTotalSteps={setTotalSteps} />
                                <DragDrop eachEvent={eachEvent} stage={2} dayIndex={index} totalSteps={totalSteps} setTotalSteps={setTotalSteps} />
                            </div>
                        </div>
                    </DndProvider>
                ))}
            </div>
        </div>
    )
}

export default RegistrantAssignment;