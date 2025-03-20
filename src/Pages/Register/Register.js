import React, { useEffect, useRef, useState } from "react";
import TextField from '@mui/material/TextField';
import { useTranslation } from "react-i18next";
import Select from "react-select"
import { useForm, Controller } from "react-hook-form"

const Register = () => {
    const { t } = useTranslation();

    const { control, handleSubmit } = useForm({
        defaultValues: {
            firstName: "",
            select: {},
        },
    })
    const onSubmit = (data) => console.log(data)

    return (
        <div className="primaryBackgroundBlack" style={{ padding: "128px 0px 48px 0px" }}>
            <div className="container" style={{ marginBottom: 30 }}>
                <div className="row">
                    <div className="col-sm">
                        <div className="goldenText">
                            <p>Dear Participants,</p>
                            <p>Please fill in the data below according to the Terms & Conditions.</p>
                            <p>
                                <strong>Notes:</strong>
                                <ul>
                                    <li>Age counting as of 2 September 2024.</li>
                                    <li>
                                        APCS MUSIC RESERVES THE RIGHT TO CHANGE THE PARTICIPANTS' AGE
                                        CATEGORIES IF PARTICIPANTS ARE OF INSUFFICIENT AGE.
                                    </li>
                                </ul>
                            </p>
                            <p>Thank you.</p>

                            Regards,
                            <br />
                            <p>APCS MUSIC</p>
                        </div>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Controller
                                name="email"
                                control={control}
                                rules={{
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                        message: "Please enter a valid email address"
                                    }
                                }}
                                render={({ field }) =>
                                    <TextField
                                        {...field}
                                        required
                                        // onChange={handleChange}
                                        placeholder="JohnDoe@gmail.com"
                                        name="email"
                                        id="standard-basic"
                                        label={t("email")} variant="standard" className="custom-textfield mb-4" />}
                            />
                            <Controller
                                name="select"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={[
                                            { value: "chocolate", label: "Chocolate" },
                                            { value: "strawberry", label: "Strawberry" },
                                            { value: "vanilla", label: "Vanilla" },
                                        ]}
                                    />
                                )}
                            />
                            <input type="submit" />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register;