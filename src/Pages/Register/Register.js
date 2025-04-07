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
    Radio,
    RadioGroup,
    TextField,
    Tooltip
} from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Cascader, InputNumber } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import React, { useEffect, useMemo, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from 'react-toastify';
import apis from '../../apis';
import FileInput from '../../components/molecules/FileInput';
import { countryCodes } from '../../constant/CountryCodePhone';
import { ageCategories, competitionList, PianoInstrumentList } from '../../constant/RegisterPageConst';
import { db } from '../../firebase';

const Register = () => {
    const { t } = useTranslation();

    const userType = {
        Teacher: "I'm a Teacher registering my students",
        Personal: "I'm Registering myself (If you are participants / parents register for your child)",
    }

    const gender = {
        Male: "Male",
        Female: "Female",
        Other: "Other"
    }

    const [isLoading, setIsLoading] = useState(false);
    const [isSaveSuccess, setIsSaveSuccess] = useState(false);
    const [totalPerformer, setTotalPerformer] = useState(1);

    const { watch, register, control, formState: { errors }, handleSubmit, reset, clearErrors } = useForm({
        defaultValues: {
            // address: "",
            ageCategory: null,
            // city: "",
            userType: "Teacher",
            // country: "",
            competitionCategory: competitionList.Piano,
            name: "",
            // phoneNumber: "",
            youtubeLink: "",
            performers: []
        },
        mode: "onBlur", // or "onBlur"
    })
    const { fields, append, remove } = useFieldArray({
        control,
        name: "performers"
    });

    const onError = (errors) => {
        // Get the first error key
        const firstErrorKey = Object.keys(errors)[0];
        if (firstErrorKey) {
            // Use document.querySelector to find the element with the corresponding name attribute
            const errorElement = document.querySelector(`[name="${firstErrorKey}"]`);
            const errorElementID = document.querySelector("#birthCertificate");

            let element = null
            element = errorElement || errorElementID
            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "center" });
                element.focus();
            }
        }
    };


    // TO DO ADD ANIMATION PROGRESS
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
            await axios.put(signedUrl2, pdfRepertoire, {
                headers: {
                    'Content-Type': pdfRepertoire.type, // Ensure this matches the file type
                },
            });

            //save pdf report
            const examCertificate = data.examCertificate[0]
            const directoryName3 = examCertificate.name.replace(/\s/g, "").replace(/\.[^/.]+$/, "");
            const res3 = await apis.aws.postSignedUrl(directoryName3, "examCertificate")
            const signedUrl3 = res3.data.link
            await axios.put(signedUrl3, examCertificate, {
                headers: {
                    'Content-Type': examCertificate.type, // Ensure this matches the file type
                },
            });

            const formattedDatePerformers = data?.performers.map((performer) => {
                const formattedDate = performer?.dob?.format("YYYY-MM-DD") ?? null;

                return { ...performer, dob: formattedDate }
            })

            // save data to Firebase
            await addDoc(collection(db, "Registrants2025"), {
                // address: data.address,
                ageCategory: data.ageCategory,
                competitionCategory: data.competitionCategory,
                // city: data.city,
                userType: data.userType,
                // country: data.country,
                performers: formattedDatePerformers,
                // phoneNumber: data.phoneNumber,
                name: data.name,
                youtubeLink: data.youtubeLink,
                createdAt: serverTimestamp(),
            });

            setIsLoading(false)

            toast.success("Succesfully Register")
            setIsSaveSuccess(true)
        } catch (e) {
            setIsLoading(false)
            toast.error("Register failed, please try again. If the error persist please contact us")
            console.error(e)
        }
    };

    const handleClickReset = () => {
        reset()
        setIsSaveSuccess(false)
        clearErrors()
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    const selectedCompetition = watch("competitionCategory");
    const userTypeValue = watch("userType");

    // Sync the fields with `totalPerformer`
    useEffect(() => {
        const currentLength = fields.length;
        if (totalPerformer > currentLength) {
            // Add fields
            for (let i = currentLength; i < totalPerformer; i++) {
                append({ dob: null });
            }
        } else if (totalPerformer < currentLength) {
            // Remove fields
            for (let i = currentLength; i > totalPerformer; i--) {
                remove(i - 1);
            }
        }
    }, [totalPerformer]);

    const isEnsemble = useMemo(() => {
        return totalPerformer > 1
    }, [totalPerformer])

    const performerExpText = useMemo(() => {
        if (!isEnsemble) {
            return "you are performing solo"
        } else {
            return "you are performing as an ensemble"
        }
    }, [isEnsemble])

    const handleChangePerformer = (value) => {
        setTotalPerformer(value)
    }

    const instrumentCategoryList = useMemo(() => {
        switch (selectedCompetition) {
            case competitionList.Piano:
                return PianoInstrumentList
                break;

            default:
                return {}
                break;
        }
    }, [selectedCompetition])

    return (
        <div className="primaryBackgroundBlack" style={{ padding: "128px 0px 48px 0px" }}>
            <div className="container" style={{ marginBottom: 30 }}>
                <div className="row">
                    <div className="col-sm">
                        <div className="mangolaineFont goldenTextColor d-flex align-items-center justify-center" style={{ fontSize: "6vmin" }}>
                            REGISTER
                        </div>
                        <div className="creamText" style={{ color: '#e5cc92' }}>
                            <div>
                                <strong>
                                    Please complete the form below in accordance with the Terms & Conditions.
                                </strong>
                            </div>
                            <strong>
                                Important Notes:
                            </strong>
                            <ul>
                                <li>Participant age will be calculated based on their age as of <strong>31 December 2025</strong>.</li>
                                <li>
                                    <strong> APCS Music </strong>reserves the right to reassign participants to the appropriate age category if the submitted information does not meet the eligibility requirements.
                                </li>
                            </ul>
                        </div>
                        <form className="d-flex flex-column" onSubmit={handleSubmit(onSubmit, onError)}>
                            <Box className="row">
                                <Box className="col-7">
                                    <FormControl component="fieldset" error={!!errors.userType}>
                                        <FormLabel
                                            className='fontSizeFormTitle'
                                            component="legend"
                                            sx={{
                                                color: "#e5cc92", // Gold text color
                                                "&.Mui-focused": { color: "#e5cc92 !important" }, // Forces gold on focus
                                                "&:hover": { color: "#e5cc92 !important" }, // Forces gold on hover
                                            }}
                                        >
                                            Who are you?
                                        </FormLabel>

                                        <Controller
                                            name="userType"
                                            control={control}
                                            rules={{ required: "Please Choose" }}
                                            render={({ field }) => (
                                                <RadioGroup {...field} row>
                                                    {Object.entries(userType).map(([key, label]) => (
                                                        <FormControlLabel
                                                            id={`${key}-${label}`}
                                                            key={key}
                                                            value={key}
                                                            control={
                                                                <Radio
                                                                    sx={{
                                                                        color: "#e5cc92", // Unselected color
                                                                        "&.Mui-checked": {
                                                                            color: "#e5cc92", // Selected color
                                                                        },

                                                                        // 👇 Removes blue focus and replaces with gold glow
                                                                        "&.Mui-focusVisible": {
                                                                            outline: "2px solid #e5cc92", // Gold outline when focused
                                                                        },
                                                                        "&.Mui-checked.Mui-focusVisible": {
                                                                            outline: "2px solid #e5cc92", // Gold glow for checked state
                                                                        },
                                                                    }}
                                                                />
                                                            }
                                                            label={label}
                                                            sx={{ color: "#e5cc92" }}
                                                        />
                                                    ))}
                                                </RadioGroup>
                                            )}
                                        />
                                        {errors.userType && <p style={{ color: "red" }}>{errors.userType.message}</p>}
                                    </FormControl>
                                </Box>
                            </Box>

                            {/* Teacher's/Parent's Name */}
                            <Controller
                                name="name"
                                control={control}
                                rules={{ required: "Name is required" }}
                                render={({ field, fieldState: { error } }) => (
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <TextField
                                            {...field}
                                            label={userTypeValue !== "Teacher" ? "Parent's Name" : "Teacher's Name"}
                                            variant="standard"
                                            className="custom-textfield-full mb-4"
                                            error={!!error}
                                            helperText={error ? error.message : ""}
                                        />

                                        <Tooltip title="If you are registering yourself input '-' here and input your name in performer below">
                                            <IconButton sx={{ color: "#e5cc92", fontSize: 16, mt: 1 }}>
                                                <QuestionCircleOutlined />
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                )}
                            />

                            {/* Competition Category (Radio Button) */}
                            <FormControl className='mt-4' component="fieldset" error={!!errors.competitionCategory}>
                                <FormLabel
                                    className='fontSizeFormTitle'
                                    component="legend"
                                    sx={{
                                        color: "#e5cc92", // Gold text color
                                        "&.Mui-focused": { color: "#e5cc92 !important" }, // Forces gold on focus
                                        "&:hover": { color: "#e5cc92 !important" }, // Forces gold on hover
                                    }}
                                >
                                    Select Competition Category
                                </FormLabel>

                                <Controller
                                    name="competitionCategory"
                                    control={control}
                                    rules={{ required: "Please select an competition category" }}
                                    render={({ field }) => (
                                        <RadioGroup {...field} row>
                                            {Object.entries(competitionList).map(([key, label]) => (
                                                <FormControlLabel
                                                    id={`${key}-${label}`}
                                                    key={key}
                                                    value={key}
                                                    control={
                                                        <Radio
                                                            sx={{
                                                                color: "#e5cc92", // Unselected color
                                                                "&.Mui-checked": {
                                                                    color: "#e5cc92", // Selected color
                                                                },

                                                                // 👇 Removes blue focus and replaces with gold glow
                                                                "&.Mui-focusVisible": {
                                                                    outline: "2px solid #e5cc92", // Gold outline when focused
                                                                },
                                                                "&.Mui-checked.Mui-focusVisible": {
                                                                    outline: "2px solid #e5cc92", // Gold glow for checked state
                                                                },
                                                            }}
                                                        />
                                                    }
                                                    label={label}
                                                    sx={{ color: "#e5cc92" }}
                                                />
                                            ))}
                                        </RadioGroup>
                                    )}
                                />
                                {errors.competitionCategory && <p style={{ color: "red" }}>{errors.competitionCategory.message}</p>}
                            </FormControl>

                            {/* Instrument Category (Radio Buttons) */}
                            {Object.keys(instrumentCategoryList).length > 0 && (
                                <FormControl className='mt-4' component="fieldset" error={!!errors.instrumentCategory}>
                                    <FormLabel
                                        className='fontSizeFormTitle'
                                        component="legend"
                                        sx={{
                                            color: "#e5cc92", // Gold text color
                                            "&.Mui-focused": { color: "#e5cc92 !important" }, // Forces gold on focus
                                            "&:hover": { color: "#e5cc92 !important" }, // Forces gold on hover
                                        }}
                                    >
                                        Select Instrument Category
                                    </FormLabel>

                                    <Controller
                                        name="instrumentCategory"
                                        control={control}
                                        rules={{ required: "Please select an instrument category" }}
                                        render={({ field }) => (
                                            <RadioGroup {...field} row>
                                                {Object.entries(instrumentCategoryList).map(([key, label]) => (
                                                    <FormControlLabel
                                                        id={`${key}-${label}`}
                                                        key={key}
                                                        value={key}
                                                        control={
                                                            <Radio
                                                                sx={{
                                                                    color: "#e5cc92", // Unselected color
                                                                    "&.Mui-checked": {
                                                                        color: "#e5cc92", // Selected color
                                                                    },

                                                                    // 👇 Removes blue focus and replaces with gold glow
                                                                    "&.Mui-focusVisible": {
                                                                        outline: "2px solid #e5cc92", // Gold outline when focused
                                                                    },
                                                                    "&.Mui-checked.Mui-focusVisible": {
                                                                        outline: "2px solid #e5cc92", // Gold glow for checked state
                                                                    },
                                                                }}
                                                            />
                                                        }
                                                        label={label}
                                                        sx={{ color: "#e5cc92" }}
                                                    />
                                                ))}
                                            </RadioGroup>
                                        )}
                                    />
                                    {errors.instrumentCategory && <p style={{ color: "red" }}>{errors.instrumentCategory.message}</p>}
                                </FormControl>
                            )}

                            {/* Age Category (Radio Buttons) */}
                            <FormControl className='mt-4' component="fieldset" error={!!errors.ageCategory}>
                                <FormLabel
                                    className='fontSizeFormTitle'
                                    component="legend"
                                    sx={{
                                        color: "#e5cc92", // Gold text color
                                        "&.Mui-focused": { color: "#e5cc92 !important" }, // Forces gold on focus
                                        "&:hover": { color: "#e5cc92 !important" }, // Forces gold on hover
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
                                                                color: "#e5cc92", // Unselected color
                                                                "&.Mui-checked": {
                                                                    color: "#e5cc92", // Selected color
                                                                },

                                                                // 👇 Removes blue focus and replaces with gold glow
                                                                "&.Mui-focusVisible": {
                                                                    outline: "2px solid #e5cc92", // Gold outline when focused
                                                                },
                                                                "&.Mui-checked.Mui-focusVisible": {
                                                                    outline: "2px solid #e5cc92", // Gold glow for checked state
                                                                },
                                                            }}
                                                        />
                                                    }
                                                    label={label}
                                                    sx={{ color: "#e5cc92" }}
                                                />
                                            ))}
                                        </RadioGroup>
                                    )}
                                />
                                {errors.ageCategory && <p style={{ color: "red" }}>{errors.ageCategory.message}</p>}
                            </FormControl>

                            <Box className="row mt-2">
                                <Box className="col-2">
                                    <FormControl component="fieldset" error={!!errors.totalPerformer}>
                                        <FormLabel
                                            className='fontSizeFormTitle'
                                            component="legend"
                                            sx={{
                                                color: "#e5cc92", // Gold text color
                                                "&.Mui-focused": { color: "#e5cc92 !important" }, // Forces gold on focus
                                                "&:hover": { color: "#e5cc92 !important" }, // Forces gold on hover
                                            }}
                                        >
                                            Input total performer
                                        </FormLabel>
                                        <Controller
                                            name="totalPerformer"
                                            control={control}
                                            rules={{
                                                required: "Total Performer Is required", // Custom error message
                                            }}
                                            render={({ field, fieldState: { error } }) => (
                                                <InputNumber
                                                    suffix="Person"
                                                    min={1} max={15}
                                                    onError={!!error}
                                                    defaultValue={1} // or use `value={field.value}` explicitly
                                                    onChange={(value) => {
                                                        field.onChange(value);       // Update form state
                                                        handleChangePerformer(value); // Your custom logic
                                                    }}
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                />
                                            )}
                                        />
                                        <small class="note">*{performerExpText}.</small>
                                        {errors.totalPerformer && <p style={{ color: "red" }}>{errors.totalPerformer.message}</p>}
                                    </FormControl>
                                </Box>
                            </Box>

                            {/* #region Student's Info */}
                            {fields.map((item, index) => (
                                <>
                                    <FormLabel
                                        className='mt-4 fontSizeFormTitle'
                                        component="legend"
                                        sx={{
                                            color: "#e5cc92", // Gold text color
                                            "&.Mui-focused": { color: "#e5cc92 !important" }, // Forces gold on focus
                                            "&:hover": { color: "#e5cc92 !important" }, // Forces gold on hover
                                            marginBottom: 0,

                                        }}
                                    >
                                        {`Personal Information ${index + 1}`}
                                    </FormLabel>

                                    {/* First Name & Last Name */}
                                    <Box className="row">
                                        <Box className="col-6">
                                            <Controller
                                                name={`performers.${index}.firstName`}
                                                control={control}
                                                rules={{ required: "First Name is required" }}
                                                render={({ field, fieldState: { error } }) => (
                                                    <TextField {...field} label="First Name" variant="standard" className="custom-textfield-full mb-4"
                                                        error={!!error} helperText={error ? error.message : ""} />
                                                )}
                                            />
                                        </Box>
                                        <Box className="col-6">
                                            <Controller
                                                name={`performers.${index}.lastName`}
                                                control={control}
                                                rules={{ required: "Last Name is required" }}
                                                render={({ field, fieldState: { error } }) => (
                                                    <TextField {...field} label="Last Name" variant="standard" className="custom-textfield-full mb-4"
                                                        error={!!error} helperText={error ? error.message : ""} />
                                                )}
                                            />
                                        </Box>
                                    </Box>

                                    {/* Dob & Nationality */}
                                    <Box className="row mt-2" key={item.id}>
                                        <Box className="col-6">
                                            <Controller
                                                name={`performers.${index}.nationality`}
                                                control={control}
                                                rules={{
                                                    required: "Nationality is required", // Custom error message
                                                }}
                                                render={({ field, fieldState: { error } }) => (
                                                    <TextField
                                                        {...field}
                                                        placeholder="Indonesia"
                                                        id="standard-basic"
                                                        label={t("Nationality")}
                                                        variant="standard"
                                                        className="custom-textfield-full mb-4"
                                                        error={!!error} // Highlight the field on error
                                                        helperText={error ? error.message : ""}
                                                    />
                                                )}
                                            />
                                        </Box>
                                        <Box className="col-6">
                                            <Box className='d-flex' sx={{ width: "100%", gap: 4 }}>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <Controller
                                                        name={`performers.${index}.dob`}
                                                        control={control}
                                                        rules={{ required: "Date of Birth is required" }}
                                                        render={({ field, fieldState: { error } }) => (
                                                            <DatePicker
                                                                {...field}
                                                                label="Date of Birth"
                                                                value={field.value ? dayjs(field.value) : null}
                                                                onChange={(newValue) => field.onChange(newValue)}
                                                                sx={{
                                                                    // mt: 2,
                                                                    // mb: 2,
                                                                    "& .MuiInputBase-root": {
                                                                        color: "#e5cc92", // Gold text color
                                                                    },
                                                                    "& .MuiOutlinedInput-notchedOutline": {
                                                                        borderColor: "#e5cc92 !important", // Gold border (default)
                                                                    },
                                                                    "&:hover .MuiOutlinedInput-notchedOutline": {
                                                                        borderColor: "#e5cc92 !important", // Gold border on hover
                                                                    },
                                                                    "& .MuiInputLabel-root": {
                                                                        color: "#e5cc92", // Gold label color
                                                                    },
                                                                    "& .MuiInputLabel-root.Mui-focused": {
                                                                        color: "#e5cc92 !important", // Force gold label on focus
                                                                    },
                                                                    "& .MuiIconButton-root": {
                                                                        color: "#e5cc92", // Gold calendar icon
                                                                    },
                                                                    "& .MuiPickersDay-root": {
                                                                        color: "#e5cc92", // Gold date numbers
                                                                    },
                                                                    "& .MuiPickersDay-root.Mui-selected": {
                                                                        backgroundColor: "#e5cc92", // Gold background on selected date
                                                                        color: "black", // Black text on selected date
                                                                    },
                                                                    "& .MuiOutlinedInput-root": {
                                                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                                            borderColor: "#e5cc92 !important", // Force gold outline when focused
                                                                        },
                                                                    },
                                                                    "& .MuiInputBase-input": {
                                                                        caretColor: "#e5cc92", // Gold cursor
                                                                    },
                                                                    "& .Mui-focused": {
                                                                        color: "#e5cc92 !important", // Forces gold text when focused
                                                                    },
                                                                    "& .MuiOutlinedInput-root.Mui-focused": {
                                                                        borderColor: "#e5cc92 !important", // Forces gold border when focused
                                                                    },
                                                                    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                                        borderColor: "#e5cc92 !important", // Forces gold border line when focused
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
                                            </Box>
                                        </Box>
                                    </Box>

                                    {/* Gender */}
                                    <FormControl component="fieldset" error={!!errors.userType}>
                                        <FormLabel
                                            fontSizeFormTitle
                                            component="legend"
                                            sx={{
                                                color: "#e5cc92", // Gold text color
                                                "&.Mui-focused": { color: "#e5cc92 !important" }, // Forces gold on focus
                                                "&:hover": { color: "#e5cc92 !important" }, // Forces gold on hover
                                            }}
                                        >
                                            Gender
                                        </FormLabel>

                                        <Controller
                                            name={`performers.${index}.gender`}
                                            control={control}
                                            rules={{ required: "Please Choose" }}
                                            render={({ field }) => (
                                                <RadioGroup {...field} row>
                                                    {Object.entries(gender).map(([key, label]) => (
                                                        <FormControlLabel
                                                            id={`${key}-${label}`}
                                                            key={key}
                                                            value={key}
                                                            control={
                                                                <Radio
                                                                    sx={{
                                                                        color: "#e5cc92", // Unselected color
                                                                        "&.Mui-checked": {
                                                                            color: "#e5cc92", // Selected color
                                                                        },

                                                                        // 👇 Removes blue focus and replaces with gold glow
                                                                        "&.Mui-focusVisible": {
                                                                            outline: "2px solid #e5cc92", // Gold outline when focused
                                                                        },
                                                                        "&.Mui-checked.Mui-focusVisible": {
                                                                            outline: "2px solid #e5cc92", // Gold glow for checked state
                                                                        },
                                                                    }}
                                                                />
                                                            }
                                                            label={label}
                                                            sx={{ color: "#e5cc92" }}
                                                        />
                                                    ))}
                                                </RadioGroup>
                                            )}
                                        />
                                        {errors.performers?.[index]?.gender && (
                                            <p style={{ color: "red", marginTop: "4px" }}>
                                                {errors.performers[index].gender.message}
                                            </p>
                                        )}
                                    </FormControl>


                                    {/* Email/Phone Number */}
                                    <Box className="row align-items-center">
                                        <Box className="col-6">
                                            <Controller
                                                name={`performers.${index}.email`}
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
                                                        className="custom-textfield-full mb-4"
                                                        error={!!error} // Highlight the field on error
                                                        helperText={error ? error.message : ""}
                                                    />
                                                )}
                                            />

                                        </Box>
                                        <Box className="col-6">
                                            <Controller
                                                name={`performers.${index}.phoneNumber`}
                                                control={control}
                                                rules={{ required: "Phone Number is required" }}
                                                render={({ field, fieldState: { error } }) => (
                                                    <InputNumber
                                                        {...field}
                                                        style={{
                                                            width: '100%',
                                                            color: '#e5cc92',
                                                            borderColor: '#e5cc92',
                                                            backgroundColor: 'white',
                                                        }}
                                                        className="custom-input-gold"
                                                        addonBefore={
                                                            <Controller
                                                                name={`performers.${index}.countryCode`}
                                                                control={control}
                                                                defaultValue={['+1']}
                                                                rules={{ required: "Country code is required" }}
                                                                render={({ field }) => (
                                                                    <Cascader
                                                                        {...field}
                                                                        options={countryCodes.map(code => ({ value: code.code, label: code.name }))}
                                                                        // value={countryCode}
                                                                        // onChange={(value) => setCountryCode(value)}
                                                                        placeholder="+Code"
                                                                        style={{
                                                                            width: 150,
                                                                            color: '#e5cc92',
                                                                            fontSize: 12,
                                                                            borderColor: '#e5cc92',
                                                                            backgroundColor: 'white',
                                                                        }}
                                                                        dropdownStyle={{
                                                                            // color: '#e5cc92',
                                                                        }}
                                                                        popupClassName="custom-cascader-popup"
                                                                    />
                                                                )}
                                                            />
                                                        }
                                                        status={error ? 'error' : ''}
                                                    />
                                                )}
                                            />
                                        </Box>
                                    </Box>

                                    {/* City/Country */}
                                    <Box className="row">
                                        <Box className="col-6">
                                            <Controller
                                                name={`performers.${index}.city`}
                                                control={control}
                                                rules={{ required: "City is required" }}
                                                render={({ field, fieldState: { error } }) => (
                                                    <TextField {...field} label="City" variant="standard" className="custom-textfield-full mb-4"
                                                        error={!!error} helperText={error ? error.message : ""} />
                                                )}
                                            />
                                        </Box>
                                        <Box className="col-6">
                                            <Controller
                                                name={`performers.${index}.country`}
                                                control={control}
                                                rules={{ required: "Country is required" }}
                                                render={({ field, fieldState: { error } }) => (
                                                    <TextField {...field} label="Country" variant="standard" className="custom-textfield-full mb-4"
                                                        error={!!error} helperText={error ? error.message : ""} />
                                                )}
                                            />
                                        </Box>
                                    </Box>

                                    {/* province/zipcode */}
                                    <Box className="row">
                                        <Box className="col-6">
                                            <Controller
                                                name={`performers.${index}.province`}
                                                control={control}
                                                rules={{ required: "Province is required" }}
                                                render={({ field, fieldState: { error } }) => (
                                                    <TextField {...field} label="Province" variant="standard" className="custom-textfield-full mb-4"
                                                        error={!!error} helperText={error ? error.message : ""} />
                                                )}
                                            />
                                        </Box>
                                        <Box className="col-6">
                                            <Controller
                                                name={`performers.${index}.zipCode`}
                                                control={control}
                                                rules={{ required: "zipCode is required" }}
                                                render={({ field, fieldState: { error } }) => (
                                                    <TextField {...field} label="zipCode" variant="standard" className="custom-textfield-full mb-4"
                                                        error={!!error} helperText={error ? error.message : ""} />
                                                )}
                                            />
                                        </Box>
                                    </Box>

                                    {/* Address */}
                                    <Controller
                                        name={`performers.${index}.addressLine`}
                                        control={control}
                                        rules={{ required: "Address Line is required" }}
                                        render={({ field, fieldState: { error } }) => (
                                            <TextField {...field} label="Address Line" variant="standard" className="custom-textfield-full mb-4"
                                                error={!!error} helperText={error ? error.message : ""} />
                                        )}
                                    />
                                </>
                            ))}

                            {/* Exam Certificate Upload */}
                            <FileInput
                                name="examCertificate"
                                control={control}
                                label="Exam Certificate"
                                rules={{ required: "Upload required" }}
                                tooltipLabel="Please attach your latest exam certificate / essay of maximum 80 words in pdf if you are not joining any exams. Please Upload All students in 1 pdf"
                            />

                            {/* Birth Certificate Upload */}
                            <FileInput
                                name="birthCertificate"
                                control={control}
                                label="Birth Certificate"
                                rules={{ required: "Upload required" }}
                                tooltipLabel="Please attach your copy of Birth Certificate/Passport/KTP (identity card) in pdf. Please Upload All students in 1 pdf"
                            />

                            {/* PDF Repertoire Upload */}

                            <FileInput
                                name="pdfRepertoire"
                                control={control}
                                label="Repertoire"
                                rules={{ required: "Upload required" }}
                                tooltipLabel="Please attach your PDF repertoire here. Please Upload All students in 1 pdf"
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
                                            label="YouTube Video Link" variant="standard" className="custom-textfield-full mb-4"
                                            error={!!error} helperText={error ? error.message : ""} />
                                    )}
                                />

                                <Tooltip title={<div>
                                    <p>
                                        Make sure to fill the title on YouTube with the format: APCSCF2024 - (INSTRUMENT CATEGORIES) - (AGE CATEGORIES) - (FULL NAME) - (PIECE)
                                    </p>
                                </div>}>
                                    <IconButton sx={{ color: "#e5cc92", fontSize: 16, mt: 1 }}>
                                        <QuestionCircleOutlined />
                                    </IconButton>
                                </Tooltip>
                            </div>

                            {/* Agreement Checkbox */}
                            <Box className="creamText" sx={{ mt: 2 }}>
                                I acknowledge and agree that in order to join the APCs CLASSICAL FESTIVAL 2024 event,
                                I will be in compliance with the terms and conditions,
                                rules and regulations as well as the privacy policy of APCs MUSIC.
                                I will be disqualified if I did not meet any requirement
                                and did not obey the rules & regulations, terms & conditions
                                and privacy policy that were given by APCs MUSIC.
                            </Box>
                            <FormControlLabel
                                sx={{
                                    color: "#e5cc92", // Gold text color
                                    "&.Mui-focused": { color: "#e5cc92 !important" }, // Forces gold on focus
                                    "&:hover": { color: "#e5cc92 !important" }, // Forces gold on hover
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
                                                    color: "#e5cc92", // Unchecked color
                                                    "&.Mui-checked": {
                                                        color: "#e5cc92", // Checked color
                                                    },
                                                    "&.Mui-focusVisible": {
                                                        outline: "2px solid #e5cc92", // Gold focus outline
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
                            {isSaveSuccess ? (
                                <Button
                                    disabled={isLoading}
                                    onClick={handleClickReset}
                                    variant="contained" color="primary"
                                    sx={{
                                        backgroundColor: "#e5cc92",
                                        color: "black",
                                        // Override disabled styles to keep the same background and text color
                                        "&.Mui-disabled": {
                                            backgroundColor: "#e5cc92",
                                            color: "black",
                                            opacity: 0.5, // you can adjust the opacity to indicate disabled state
                                        },
                                        "&:hover": { backgroundColor: "#d9a84d" },

                                    }}
                                >
                                    Submit Another Registrant
                                </Button>
                            ) : (
                                <Button
                                    disabled={isLoading}
                                    type="submit" variant="contained" color="primary"
                                    sx={{
                                        backgroundColor: "#e5cc92",
                                        color: "black",
                                        // Override disabled styles to keep the same background and text color
                                        "&.Mui-disabled": {
                                            backgroundColor: "#e5cc92",
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
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Register;