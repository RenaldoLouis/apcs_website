import {
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormLabel,
    InputLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    TextField,
} from "@mui/material";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

const Register = () => {
    const { t } = useTranslation();

    const { register, control, formState: { errors }, handleSubmit } = useForm({
        defaultValues: {
            firstName: "",
            select: {},
        },
    })
    const onSubmit = (data) => {
        console.log("Form Data:", data);
    };
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
                        <form className="d-flex flex-column" onSubmit={handleSubmit(onSubmit)}>
                            <Controller
                                name="email"
                                control={control}
                                rules={{
                                    required: "Email is required", // Custom error message
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                        message: "Please enter a valid email address",
                                    },
                                }}
                                render={({ field, fieldState: { error } }) => (
                                    <TextField
                                        {...field}
                                        type="email" // Ensure email input type is set
                                        placeholder="JohnDoe@gmail.com"
                                        id="standard-basic"
                                        label={t("email")}
                                        variant="standard"
                                        className="custom-textfield mb-4"
                                        error={!!error} // Highlight the field on error
                                        helperText={error ? error.message : ""}
                                    />
                                )}
                            />
                            <Controller
                                name="name"
                                control={control}
                                rules={{
                                    required: "Name is required", // Custom error message
                                }}
                                render={({ field, fieldState: { error } }) => (
                                    <TextField
                                        {...field}
                                        placeholder="John Doe"
                                        id="standard-basic"
                                        label={t("name")}
                                        variant="standard"
                                        className="custom-textfield mb-4"
                                        error={!!error} // Highlight the field on error
                                        helperText={error ? error.message : ""}
                                    />
                                )}
                            />
                            {/* Age Category (Radio Buttons) */}
                            <FormControl component="fieldset" error={!!errors.ageCategory}>
                                <FormLabel
                                    component="legend"
                                    sx={{
                                        color: "#EBBC64", // Gold text color
                                        "&.Mui-focused": { color: "#EBBC64 !important" }, // Forces gold on focus
                                        "&:hover": { color: "#EBBC64 !important" }, // Forces gold on hover
                                    }}
                                >Select Age Category</FormLabel>

                                <Controller
                                    name="ageCategory"
                                    control={control}
                                    rules={{ required: "Please select an age category" }}
                                    render={({ field }) => (
                                        <RadioGroup {...field} row>
                                            {["under18", "18-25", "26-35", "36-50", "51+"].map((value) => (
                                                <FormControlLabel
                                                    key={value}
                                                    value={value}
                                                    control={
                                                        <Radio
                                                            sx={{
                                                                color: "#EBBC64", // Unselected color
                                                                "&.Mui-checked": {
                                                                    color: "#EBBC64", // Selected color
                                                                },

                                                                // 👇 Removes blue focus and replaces with gold glow
                                                                "&.Mui-focusVisible": {
                                                                    outline: "2px solid #EBBC64", // Gold outline when focused
                                                                },
                                                                "&.Mui-checked.Mui-focusVisible": {
                                                                    outline: "2px solid #EBBC64", // Gold glow for checked state
                                                                },
                                                            }}
                                                        />
                                                    }
                                                    label={value.replace("-", " ")}
                                                    sx={{ color: "#EBBC64" }}
                                                />
                                            ))}
                                        </RadioGroup>
                                    )}
                                />
                                {errors.ageCategory && <p style={{ color: "red" }}>{errors.ageCategory.message}</p>}
                            </FormControl>


                            {/* Phone Number */}
                            <Controller
                                name="phoneNumber"
                                control={control}
                                rules={{
                                    required: "Phone Number is required",
                                    pattern: {
                                        value: /^[0-9]{10,15}$/,
                                        message: "Please enter a valid phone number",
                                    },
                                }}
                                render={({ field, fieldState: { error } }) => (
                                    <TextField {...field} label="Phone Number" variant="standard" className="custom-textfield mb-4"
                                        error={!!error} helperText={error ? error.message : ""} />
                                )}
                            />

                            {/* Address */}
                            <Controller
                                name="address"
                                control={control}
                                rules={{ required: "Address is required" }}
                                render={({ field, fieldState: { error } }) => (
                                    <TextField {...field} label="Address" variant="standard" className="custom-textfield mb-4"
                                        error={!!error} helperText={error ? error.message : ""} />
                                )}
                            />

                            {/* Teacher's Name */}
                            <Controller
                                name="teacherName"
                                control={control}
                                rules={{ required: "Teacher's Name is required" }}
                                render={({ field, fieldState: { error } }) => (
                                    <TextField {...field} label="Teacher's Name" variant="standard" className="custom-textfield mb-4"
                                        error={!!error} helperText={error ? error.message : ""} />
                                )}
                            />

                            {/* Instrument Category (Dropdown) */}
                            <FormControl
                                variant="standard"
                                className="custom-dropdown"
                                error={!!errors.instrumentCategory}
                                sx={{ width: "100%" }}
                            >
                                {/* Gold Label */}
                                <InputLabel sx={{ color: "#EBBC64" }}>Instrument Category</InputLabel>

                                <Controller
                                    name="instrumentCategory"
                                    control={control}
                                    rules={{ required: "Please select an instrument category" }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            displayEmpty
                                            sx={{
                                                color: "#EBBC64", // Gold text color
                                                backgroundColor: "black", // Black dropdown background
                                                borderBottom: "1px solid #EBBC64", // Gold bottom border
                                                "& .MuiSelect-icon": { color: "#EBBC64" }, // Gold dropdown arrow
                                                "&:hover": { borderBottom: "2px solid #EBBC64" }, // Gold hover effect

                                                // 👇 Removes blue outline and adds gold focus effect
                                                "&.Mui-focused": {
                                                    color: "#EBBC64", // Keep text gold when focused
                                                    borderBottom: "2px solid #EBBC64", // Gold bottom border when focused
                                                },

                                                "& .MuiOutlinedInput-notchedOutline": {
                                                    borderColor: "#EBBC64", // Gold border for outlined variant
                                                },

                                                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                    borderColor: "#EBBC64", // Gold border when focused
                                                },

                                                "&:focus": {
                                                    outline: "none", // Removes blue outline
                                                    borderBottom: "2px solid #EBBC64", // Gold glow effect
                                                },
                                            }}
                                        >
                                            {/* Gold Menu Items */}
                                            <MenuItem value="" disabled>
                                                <span style={{ color: "#EBBC64" }}>Select an Instrument</span>
                                            </MenuItem>
                                            <MenuItem sx={{ color: "#EBBC64" }} value="Piano Solo">
                                                Piano Solo (One piano, two hands)
                                            </MenuItem>
                                            <MenuItem sx={{ color: "#EBBC64" }} value="Piano Fourhands">
                                                Piano Fourhands (One piano, four hands)
                                            </MenuItem>
                                            <MenuItem sx={{ color: "#EBBC64" }} value="Chamber Music">
                                                Chamber Music (Various combinations)
                                            </MenuItem>
                                        </Select>
                                    )}
                                />

                                {/* Error Message in Red */}
                                {errors.instrumentCategory && (
                                    <p style={{ color: "red" }}>{errors.instrumentCategory.message}</p>
                                )}
                            </FormControl>

                            {/* Description */}
                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <TextField {...field} label="Description (Optional)" variant="standard" className="custom-textfield mb-4" />
                                )}
                            />

                            {/* Date of Birth */}
                            <Controller
                                name="dob"
                                control={control}
                                rules={{ required: "Date of Birth is required" }}
                                render={({ field, fieldState: { error } }) => (
                                    <TextField {...field} type="date" label="Date of Birth" InputLabelProps={{ shrink: true }} variant="standard"
                                        className="custom-textfield mb-4" error={!!error} helperText={error ? error.message : ""} />
                                )}
                            />

                            {/* File Upload Fields */}
                            <input type="file" {...register("examCertificate", { required: "Upload required" })} />
                            {errors.examCertificate && <p style={{ color: "red" }}>{errors.examCertificate.message}</p>}

                            <input type="file" {...register("birthCertificate", { required: "Upload required" })} />
                            {errors.birthCertificate && <p style={{ color: "red" }}>{errors.birthCertificate.message}</p>}

                            <input type="file" {...register("pdfRepertoire", { required: "Upload required" })} />
                            {errors.pdfRepertoire && <p style={{ color: "red" }}>{errors.pdfRepertoire.message}</p>}

                            {/* YouTube Link */}
                            <Controller
                                name="youtubeLink"
                                control={control}
                                rules={{ required: "YouTube link is required" }}
                                render={({ field, fieldState: { error } }) => (
                                    <TextField {...field} label="YouTube Video Link" variant="standard" className="custom-textfield mb-4"
                                        error={!!error} helperText={error ? error.message : ""} />
                                )}
                            />

                            {/* Agreement Checkbox */}
                            <FormControlLabel control={<Controller name="agreement" control={control} rules={{ required: "Required" }} render={({ field }) => <Checkbox {...field} />} />} label="I agree to the terms and conditions." />
                            {errors.agreement && <p style={{ color: "red" }}>{errors.agreement.message}</p>}

                            {/* Submit Button */}
                            <Button type="submit" variant="contained" color="primary">Submit</Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register;