import {
    CloudUploadOutlined
} from '@ant-design/icons';
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
    Typography
} from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
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
                                <InputLabel
                                    sx={{
                                        color: "#EBBC64", // Gold label text
                                        "&.Mui-focused": { color: "#EBBC64 !important" }, // Keep label gold when focused
                                    }}
                                >
                                    Instrument Category
                                </InputLabel>

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
                                                borderBottom: "1px solid #EBBC64", // Gold bottom border

                                                "& .MuiSelect-icon": { color: "#EBBC64" }, // Gold dropdown arrow

                                                "&:hover": { borderBottom: "2px solid #EBBC64" }, // Gold hover effect

                                                // 👇 Completely removes blue focus and applies gold focus effect
                                                "&.Mui-focused": {
                                                    color: "#EBBC64 !important", // Keep text gold when focused
                                                    borderBottom: "2px solid #EBBC64 !important", // Gold bottom border when focused
                                                },

                                                "&:before": {
                                                    borderBottom: "1px solid #EBBC64 !important", // Gold default underline
                                                },

                                                "&:after": {
                                                    borderBottom: "2px solid #EBBC64 !important", // Gold focus underline
                                                },

                                                "&.Mui-focused:after": {
                                                    borderBottom: "2px solid #EBBC64 !important", // Gold underline focus effect
                                                },

                                                "& .MuiInputBase-root:after": {
                                                    borderBottom: "2px solid #EBBC64 !important", // Ensures gold focus underline
                                                },

                                                "&:focus": {
                                                    outline: "none !important", // Completely removes blue outline
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
                                    <TextField sx={{ mt: 2 }} {...field} label="Description (Optional)" variant="standard" className="custom-textfield mb-4" />
                                )}
                            />

                            {/* Date of Birth */}
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Controller
                                    name="dob"
                                    control={control}
                                    rules={{ required: "Date of Birth is required" }}
                                    render={({ field, fieldState: { error } }) => (
                                        <DatePicker
                                            {...field}
                                            label="Date of Birth"
                                            value={field.value ? dayjs(field.value) : null}
                                            onChange={(newValue) => field.onChange(newValue)}
                                            sx={{
                                                mt: 4,
                                                mb: 4,
                                                "& .MuiInputBase-root": {
                                                    color: "#EBBC64", // Gold text color
                                                },
                                                "& .MuiOutlinedInput-notchedOutline": {
                                                    borderColor: "#EBBC64 !important", // Gold border (default)
                                                },
                                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                                    borderColor: "#EBBC64 !important", // Gold border on hover
                                                },
                                                "& .MuiInputLabel-root": {
                                                    color: "#EBBC64", // Gold label color
                                                },
                                                "& .MuiInputLabel-root.Mui-focused": {
                                                    color: "#EBBC64 !important", // Force gold label on focus
                                                },
                                                "& .MuiIconButton-root": {
                                                    color: "#EBBC64", // Gold calendar icon
                                                },
                                                "& .MuiPickersDay-root": {
                                                    color: "#EBBC64", // Gold date numbers
                                                },
                                                "& .MuiPickersDay-root.Mui-selected": {
                                                    backgroundColor: "#EBBC64", // Gold background on selected date
                                                    color: "black", // Black text on selected date
                                                },
                                                "& .MuiOutlinedInput-root": {
                                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                        borderColor: "#EBBC64 !important", // Force gold outline when focused
                                                    },
                                                },
                                                "& .MuiInputBase-input": {
                                                    caretColor: "#EBBC64", // Gold cursor
                                                },
                                                "& .Mui-focused": {
                                                    color: "#EBBC64 !important", // Forces gold text when focused
                                                },
                                                "& .MuiOutlinedInput-root.Mui-focused": {
                                                    borderColor: "#EBBC64 !important", // Forces gold border when focused
                                                },
                                                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                    borderColor: "#EBBC64 !important", // Forces gold border line when focused
                                                },
                                            }}
                                            slotProps={{
                                                textField: {
                                                    variant: "outlined", // Change this to "standard" if you prefer no outline
                                                    error: !!error,
                                                    helperText: error ? error.message : "",
                                                    InputLabelProps: { shrink: true },
                                                },
                                            }}
                                        />
                                    )}
                                />
                            </LocalizationProvider>

                            {/* Exam Certificate Upload */}
                            <label htmlFor="examCertificate">
                                <input
                                    id="examCertificate"
                                    type="file"
                                    {...register("examCertificate", { required: "Upload required" })}
                                    style={{ display: "none" }} // Hide default file input
                                />
                                <Button
                                    variant="contained"
                                    component="span"
                                    sx={{
                                        backgroundColor: "#EBBC64",
                                        color: "black",
                                        borderRadius: "20px",
                                        padding: "10px 20px",
                                        textTransform: "none",
                                        fontWeight: "bold",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        "&:hover": { backgroundColor: "#d9a84d" }, // Slightly darker gold on hover
                                    }}
                                >
                                    <CloudUploadOutlined /> Upload Exam Certificate
                                </Button>
                            </label>
                            {errors.examCertificate && <Typography color="red">{errors.examCertificate.message}</Typography>}

                            {/* Birth Certificate Upload */}
                            <label htmlFor="birthCertificate" style={{ marginTop: "15px", display: "block" }}>
                                <input
                                    id="birthCertificate"
                                    type="file"
                                    {...register("birthCertificate", { required: "Upload required" })}
                                    style={{ display: "none" }}
                                />
                                <Button
                                    variant="contained"
                                    component="span"
                                    sx={{
                                        backgroundColor: "#EBBC64",
                                        color: "black",
                                        borderRadius: "20px",
                                        padding: "10px 20px",
                                        textTransform: "none",
                                        fontWeight: "bold",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        "&:hover": { backgroundColor: "#d9a84d" },
                                    }}
                                >
                                    <CloudUploadOutlined /> Upload Birth Certificate
                                </Button>
                            </label>
                            {errors.birthCertificate && <Typography color="red">{errors.birthCertificate.message}</Typography>}

                            {/* PDF Repertoire Upload */}
                            <label htmlFor="pdfRepertoire" style={{ marginTop: "15px", display: "block" }}>
                                <input
                                    id="pdfRepertoire"
                                    type="file"
                                    {...register("pdfRepertoire", { required: "Upload required" })}
                                    style={{ display: "none" }}
                                />
                                <Button
                                    variant="contained"
                                    component="span"
                                    sx={{
                                        backgroundColor: "#EBBC64",
                                        color: "black",
                                        borderRadius: "20px",
                                        padding: "10px 20px",
                                        textTransform: "none",
                                        fontWeight: "bold",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        "&:hover": { backgroundColor: "#d9a84d" },
                                    }}
                                >
                                    <CloudUploadOutlined /> Upload PDF Repertoire
                                </Button>
                            </label>
                            {errors.pdfRepertoire && <Typography color="red">{errors.pdfRepertoire.message}</Typography>}


                            {/* YouTube Link */}
                            <Controller
                                name="youtubeLink"
                                control={control}
                                rules={{ required: "YouTube link is required" }}
                                render={({ field, fieldState: { error } }) => (
                                    <TextField {...field}
                                        sx={{ mt: 2 }}
                                        label="YouTube Video Link" variant="standard" className="custom-textfield mb-4"
                                        error={!!error} helperText={error ? error.message : ""} />
                                )}
                            />

                            {/* Agreement Checkbox */}
                            <FormControlLabel
                                sx={{
                                    color: "#EBBC64", // Gold text color
                                    "&.Mui-focused": { color: "#EBBC64 !important" }, // Forces gold on focus
                                    "&:hover": { color: "#EBBC64 !important" }, // Forces gold on hover
                                }}
                                control={
                                    <Controller
                                        name="agreement"
                                        control={control}
                                        rules={{ required: "Required" }}
                                        render={({ field }) => (
                                            <Checkbox
                                                {...field}
                                                sx={{
                                                    color: "#EBBC64", // Unchecked color
                                                    "&.Mui-checked": {
                                                        color: "#EBBC64", // Checked color
                                                    },
                                                    "&.Mui-focusVisible": {
                                                        outline: "2px solid #EBBC64", // Gold focus outline
                                                    },
                                                }}
                                            />
                                        )}
                                    />
                                }
                                label="I agree to the terms and conditions."
                            />

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