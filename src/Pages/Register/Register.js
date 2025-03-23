import {
    QuestionCircleOutlined
} from '@ant-design/icons';
import {
    Box,
    Button,
    Checkbox,
    CircularProgress,
    FormControl,
    FormControlLabel,
    FormLabel,
    IconButton,
    InputLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    TextField,
    Tooltip
} from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import axios from 'axios';
import dayjs from 'dayjs';
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import React, { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from 'react-toastify';
import apis from '../../apis';
import FileInput from '../../components/molecules/FileInput';
import { InstrumentCategory } from '../../constant/InstrumentCategory';
import { db } from '../../firebase';

const Register = () => {
    const { t } = useTranslation();

    const ageCategories = {
        Poco: "Poco (4-5 years old)",
        Petite: "Petite (6-7 years old)",
        Primary: "Primary (8-11 years old)",
        Young: "Young (12-15 years old)",
        Junior: "Junior (16-19 years old)",
        Youth: "Youth (20-23 years old)",
        OpenAge: "Open Age (24 years old and up)",
        FreeChoice: "Free Choice (Combination Age - No Limitation)"
    }

    const [isLoading, setIsLoading] = useState(false);

    const { watch, register, control, formState: { errors }, handleSubmit } = useForm({
        defaultValues: {
            name: "",
            teacherName: ""
        },
    })

    const onSubmit = async (data) => {
        try {
            setIsLoading(true)
            //save birth cert first
            const birthCert = data.birthCertificate[0]
            const directoryName = birthCert.name.replace(/\s/g, "").replace(/\.[^/.]+$/, "");
            const res = await apis.aws.postSignedUrl(directoryName, "birthCert")
            const signedUrl = res.data.link
            await axios.put(signedUrl, birthCert, {
                headers: {
                    'Content-Type': birthCert.type, // Ensure this matches the file type
                },
            });

            //save exam cert
            const pdfRepertoire = data.pdfRepertoire[0]
            const directoryName2 = pdfRepertoire.name.replace(/\s/g, "").replace(/\.[^/.]+$/, "");
            const res2 = await apis.aws.postSignedUrl(directoryName2, "pdfRepertoire")
            const signedUrl2 = res2.data.link
            await axios.put(signedUrl2, birthCert, {
                headers: {
                    'Content-Type': birthCert.type, // Ensure this matches the file type
                },
            });

            //save pdf report
            const examCertificate = data.examCertificate[0]
            const directoryName3 = examCertificate.name.replace(/\s/g, "").replace(/\.[^/.]+$/, "");
            const res3 = await apis.aws.postSignedUrl(directoryName3, "examCertificate")
            const signedUrl3 = res3.data.link
            await axios.put(signedUrl3, birthCert, {
                headers: {
                    'Content-Type': birthCert.type, // Ensure this matches the file type
                },
            });

            const formattedDate = data?.dob?.format("YYYY-MM-DD") ?? null;
            const formattedDate2 = data?.dob2?.format("YYYY-MM-DD") ?? null;

            // save data to Firebase
            const docRef = await addDoc(collection(db, "Registrants2025"), {
                address: data.address,
                ageCategory: data.ageCategory,
                email: data.email,
                instrumentCategory: data.instrumentCategory,
                name: data.name,
                dob: formattedDate,
                dob2: formattedDate2,
                phoneNumber: data.phoneNumber,
                teacherName: data.teacherName,
                youtubeLink: data.youtubeLink,
                createdAt: serverTimestamp(),
            });

            setIsLoading(false)

            toast.success("Succesfully Register")

        } catch (e) {
            setIsLoading(false)
            toast.error("Register failed, please try again. If the error persist please contact us")
            console.error(e)
        }
    };

    const selectedInstrument = watch("instrumentCategory");

    const isDoubleContestant = useMemo(() => {
        return selectedInstrument !== InstrumentCategory.Piano_Solo
    }, [selectedInstrument])

    const tooltipMessageYoutubeFormat = useMemo(() => {
        let text = null;
        switch (selectedInstrument) {
            case InstrumentCategory.Piano_Solo:
                text = <p>
                    Example:
                    APCSCF2024 - PIANO SOLO - POCO - WALLACE JOHANNA TANTONO - Sonata in F Major
                    (If you have a longer name, (Wallace Johanna Tantono), please simplify into Wallace J.T).
                </p>
                break;
            case InstrumentCategory.Piano_Fourhands_one:
                text = <p>
                    Example:
                    APCSCF2024 - PIANO FOURHANDS - FREE CHOICE - KIRANA SEAN & SKY YOHANNA - MOZART PIANO SONATA K.381
                    (If you have a longer name, please simplify it.).
                </p>
                break;
            case InstrumentCategory.Piano_Fourhands_two:
                text = <p>
                    Example:
                    APCSCF2024 - PIANO FOURHANDS - FREE CHOICE - KIRANA SEAN & SKY YOHANNA - Scaramouche Op.165b - Darius Milhaud for 2 Pianos 4 Hands
                    (If you have a longer name, please simplify it.).
                </p>
                break;
            case InstrumentCategory.Chamber_Music_one:
                text = <p>
                    Example:
                    APCSCF2024 - CHAMBER MUSIC - FREE CHOICE - RINA JULIANNA, MATTHEW TAN, RYAN WIJAYA, LINA TIONANDA) - Lavignac "Galop- Marche"
                    (If you have a longer name, please simplify it.).
                </p>
                break;
            case InstrumentCategory.Chamber_Music_two:
                text = <p>
                    Example:
                    APCSCF2024 - CHAMBER MUSIC - FREE CHOICE - TIMOTHY TIO, KIMBERLY WIJAYA, MAY JULIO, JONATHAN ROBERT - Champagne Toccata - William Gillock for 2 Piano 8 Hands
                    (If you have a longer name, please simplify it.).
                </p>
                break;
            case InstrumentCategory.Chamber_Music_any:
                text = <p>
                    Example:
                    APCSCF2024 - CHAMBER MUSIC - FREE CHOICE - TIMOTHY's Chamber - Dvořák: Piano Quintet No. 2, Op. 81
                    (If you have a longer name, please simplify it.).
                </p>
                break;
            default:
        }

        return text

    }, [selectedInstrument])

    return (
        <div className="primaryBackgroundBlack" style={{ padding: "128px 0px 48px 0px" }}>
            <div className="container" style={{ marginBottom: 30 }}>
                <div className="row">
                    <div className="col-sm">
                        <div className="goldenText">
                            <p>Dear Participants,</p>
                            <p>Please fill in the data below according to the Terms & Conditions.</p>
                            <div>
                                <strong>Notes:</strong>
                                <ul>
                                    <li>Age counting as of 2 September 2024.</li>
                                    <li>
                                        APCS MUSIC RESERVES THE RIGHT TO CHANGE THE PARTICIPANTS' AGE
                                        CATEGORIES IF PARTICIPANTS ARE OF INSUFFICIENT AGE.
                                    </li>
                                </ul>
                            </div>
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
                                >
                                    Select Age Category
                                </FormLabel>

                                <Controller
                                    name="ageCategory"
                                    control={control}
                                    rules={{ required: "Please select an age category" }}
                                    render={({ field }) => (
                                        <RadioGroup {...field} row>
                                            {Object.entries(ageCategories).map(([key, label]) => (
                                                <FormControlLabel
                                                    id={`${key}-${label}`}
                                                    key={key}
                                                    value={key}
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
                                                    label={label}
                                                    sx={{ color: "#EBBC64" }}
                                                />
                                            ))}
                                        </RadioGroup>
                                    )}
                                />
                                {errors.ageCategory && <p style={{ color: "red" }}>{errors.ageCategory.message}</p>}
                            </FormControl>;


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
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <TextField
                                            {...field}
                                            label="Teacher's Name"
                                            variant="standard"
                                            className="custom-textfield mb-4"
                                            error={!!error}
                                            helperText={error ? error.message : ""}
                                        />

                                        <Tooltip title="Enter your teacher's name. If you are self-taught, type '-'">
                                            <IconButton sx={{ color: "#EBBC64", fontSize: 16, mt: 1 }}>
                                                <QuestionCircleOutlined />
                                            </IconButton>
                                        </Tooltip>
                                    </div>
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
                                            MenuProps={{
                                                PaperProps: {
                                                    sx: {
                                                        background: "#26261c !important",
                                                    },
                                                },
                                                // Optionally,style the popover container if needed:
                                                // sx: {
                                                //   background: "#26261c !important",
                                                // },
                                            }}
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
                                            <MenuItem sx={{ color: "#EBBC64" }} value={InstrumentCategory.Piano_Solo}>
                                                Piano Solo (One piano, two hands)
                                            </MenuItem>
                                            <MenuItem sx={{ color: "#EBBC64" }} value={InstrumentCategory.Piano_Fourhands_one}>
                                                Piano Fourhands (One piano, four hands)
                                            </MenuItem>
                                            <MenuItem sx={{ color: "#EBBC64" }} value={InstrumentCategory.Piano_Fourhands_two}>
                                                Piano Fourhands (Two piano, four hands)
                                            </MenuItem>
                                            <MenuItem sx={{ color: "#EBBC64" }} value={InstrumentCategory.Chamber_Music_one}>
                                                Chamber Music (One piano, six-eight hands)
                                            </MenuItem>
                                            <MenuItem sx={{ color: "#EBBC64" }} value={InstrumentCategory.Chamber_Music_two}>
                                                Chamber Music (Two piano, six-eight hands)
                                            </MenuItem>
                                            <MenuItem sx={{ color: "#EBBC64" }} value={InstrumentCategory.Chamber_Music_any}>
                                                Chamber Music (Any insturment(s) with piano(s))
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
                            {/* <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <TextField sx={{ mt: 2 }} {...field} label="Description (Optional)" variant="standard" className="custom-textfield mb-4" />
                                )}
                            /> */}

                            {/* Date of Birth */}
                            <Box className='d-flex' sx={{ width: "100%", gap: 4 }}>
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

                                {isDoubleContestant && (

                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <Controller
                                            name="dob2"
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
                                )}
                            </Box>

                            {/* Exam Certificate Upload */}
                            <FileInput
                                name="examCertificate"
                                control={control}
                                label="Exam Certificate"
                                rules={{ required: "Upload required" }}
                                tooltipLabel="Please attach your latest exam certificate / essay of maximum 80 words in pdf if you are not joining any exams."
                            />

                            {/* Birth Certificate Upload */}
                            <FileInput
                                name="birthCertificate"
                                control={control}
                                label="Birth Certificate"
                                rules={{ required: "Upload required" }}
                                tooltipLabel="Please attach your copy of Birth Certificate/Passport/KTP (identity card) in pdf"
                            />

                            {/* PDF Repertoire Upload */}

                            <FileInput
                                name="pdfRepertoire"
                                control={control}
                                label="Repertoire"
                                rules={{ required: "Upload required" }}
                                tooltipLabel="Please attach your PDF repertoire here"
                            />

                            {/* YouTube Link */}
                            <div className='d-flex'>
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

                                <Tooltip title={<div>
                                    <p>
                                        Make sure to fill the title on YouTube with the format: APCSCF2024 - (INSTRUMENT CATEGORIES) - (AGE CATEGORIES) - (FULL NAME) - (PIECE)
                                    </p>
                                    {tooltipMessageYoutubeFormat}
                                </div>}>
                                    <IconButton sx={{ color: "#EBBC64", fontSize: 16, mt: 1 }}>
                                        <QuestionCircleOutlined />
                                    </IconButton>
                                </Tooltip>
                            </div>

                            {/* Agreement Checkbox */}
                            <Box className="goldenText" sx={{ mt: 2 }}>
                                I acknowledge and agree that in order to join the APCs CLASSICAL FESTIVAL 2024 event,
                                I will be in compliance with the terms and conditions,
                                rules and regulations as well as the privacy policy of APCs MUSIC.
                                I will be disqualified if I did not meet any requirement
                                and did not obey the rules & regulations, terms & conditions
                                and privacy policy that were given by APCs MUSIC.
                            </Box>
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
                            <Button
                                disabled={isLoading}
                                type="submit" variant="contained" color="primary"
                                sx={{
                                    backgroundColor: "#EBBC64",
                                    color: "black",
                                    // Override disabled styles to keep the same background and text color
                                    "&.Mui-disabled": {
                                        backgroundColor: "#EBBC64",
                                        color: "black",
                                        opacity: 0.5, // you can adjust the opacity to indicate disabled state
                                    },
                                    "&:hover": { backgroundColor: "#d9a84d" },

                                }}
                            >
                                Submit
                                {isLoading && (
                                    <CircularProgress
                                        size={24}
                                        sx={{
                                            color: "blue",
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            marginTop: '-12px',
                                            marginLeft: '-12px',
                                        }}
                                    />
                                )}

                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Register;