import React, { useState } from "react";
import Typograhpy from "../../atom/Typograhpy";
import { Steps } from "antd";
import { RegistrantStatus } from "../../../constant/RegistrantStatus";
import { TextSizeType } from "../../../constant/TextSizeType";
import { Space, TimePicker, Form, Button } from 'antd';
import dayjs from "dayjs";

const RundownEventSteps = ({ day }) => {
    const [form] = Form.useForm();

    const handleSubmit = () => {
        console.log("Form Values:", form.getFieldsValue());
    };

    console.log("day", day)

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
                items={[
                    {
                        title: RegistrantStatus.FINISHED,
                        description: "This is a description.",
                    },
                    {
                        title: RegistrantStatus.IN_PROGRESS,
                        description: "This is a description.",
                    },
                    {
                        title: RegistrantStatus.WAITING,
                        description: "This is a description.",
                    },
                ]}
            />
        </div>
    )
}
export default RundownEventSteps;