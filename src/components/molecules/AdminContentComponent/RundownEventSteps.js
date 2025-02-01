import React, { useEffect, useState } from "react";
import Typograhpy from "../../atom/Typograhpy";
import { Steps } from "antd";
import { RegistrantStatus } from "../../../constant/RegistrantStatus";
import { TextSizeType } from "../../../constant/TextSizeType";
import { Space, TimePicker, Form, Button } from 'antd';
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const RundownEventSteps = ({ eachEvent, day, totalSteps, setTotalSteps }) => {
    const [form] = Form.useForm();

    const [totalPerformance, setTotalPerformance] = useState([])

    const generateTimeSlots = (timeRange) => {
        if (!timeRange || timeRange.length !== 2) return [];

        let startTime = timeRange[0];
        let endTime = timeRange[1];
        let timeSlots = [];

        while (startTime.isBefore(endTime) || startTime.isSame(endTime)) {
            timeSlots.push(startTime.format("HH:mm")); // Format as string
            startTime = startTime.add(30, "minutes"); // Increment by 30 minutes
        }

        return timeSlots;
    };

    const handleSubmit = () => {
        let cloneTotalSteps = [...totalSteps]
        let timeRange = form.getFieldsValue().timeRange
        if (timeRange) {
            const timeSlots = generateTimeSlots(timeRange);
            cloneTotalSteps[day - 1].timeRange = timeSlots
        }
        setTotalSteps(cloneTotalSteps)
    };

    useEffect(() => {
        let tempArray = []
        if (eachEvent.timeRange) {
            eachEvent.timeRange.forEach((eachData) => {
                let tempObject = {
                    title: "none",
                    description: eachData,
                }
                tempArray.push(tempObject)
            })
        }
        setTotalPerformance(tempArray)
    }, [totalSteps])

    return (
        <div className="flex-column">
            <Typograhpy
                className="mb-12 flex justify-center"
                text={`Day${day}`}
                style={{ color: "black" }}
            />
            <Form
                className="mb-12"
                form={form} onFinish={handleSubmit}>
                <Form.Item className="mb-12" name="timeRange">
                    <TimePicker.RangePicker format="HH:mm" />
                </Form.Item>
                <Button type="primary" htmlType="submit">Submit</Button>
            </Form>
            <Steps
                direction="vertical"
                current={0}
                items={totalPerformance}
            />
        </div>
    )
}
export default RundownEventSteps;