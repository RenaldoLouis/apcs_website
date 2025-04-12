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
import React, { useEffect, useMemo, useRef, useState } from "react";
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
    const examInputRef = useRef();
    const birthCertInputRef = useRef();
    const repertoireInputRef = useRef();

    const userType = {
        Teacher: t("register.imTeacher"),
        Personal: t("register.imParent"),
    }

    const gender = {
        Male: t("register.gender.Male"),
        Female: t("register.gender.Female"),
        Other: t("register.gender.Other")
    }

    const [isLoading, setIsLoading] = useState(false);
    const [isSaveSuccess, setIsSaveSuccess] = useState(false);
    const [totalPerformer, setTotalPerformer] = useState(1);
    const [progressLoading, setProgressLoading] = useState(10);

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
            performers: [],
            totalPerformer: 1
        },
        mode: "onBlur", // or "onBlur"
    })
    const { fields, append, remove } = useFieldArray({
        control,
        name: "performers"
    });

    // fix error on personal information
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

            setProgressLoading(30)

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

            setProgressLoading(50)
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
                const formattedDate = performer?.dob?.format("DD/MM/YYYY") ?? null;

                return { ...performer, dob: formattedDate }
            })

            setProgressLoading(70)

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

            const dataEmail = formattedDatePerformers.map(({ email, firstName, lastName }) => ({
                email,
                name: `${firstName} ${lastName}`
            }))

            setProgressLoading(90)

            apis.email.sendEmail(dataEmail).then((res) => {
                if (res.status === 200) {
                    toast.success("Succesfully Registered! Please check your email for confirmation.")
                    setIsSaveSuccess(true)

                    setProgressLoading(100)
                } else {
                    throw new Error("Email sending failed with status " + res.status);
                }
                setIsLoading(false)
            })
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
        setTotalPerformer(0)
        // Clear file input
        if (examInputRef.current) {
            examInputRef.current.value = null;
        }
        if (birthCertInputRef.current) {
            birthCertInputRef.current.value = null;
        }
        if (repertoireInputRef.current) {
            repertoireInputRef.current.value = null;
        }
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
        setProgressLoading(10)
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
            return t("register.form.performingSolo")
        } else {
            return t("register.form.performingEnsemble")
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
                            {t("register.title")}
                        </div>

                        <div className="creamText" style={{ color: '#e5cc92' }}>
                            <div>
                                <strong>
                                    {t("register.description.line1")}
                                </strong>
                            </div>

                            <strong>{t("register.description.importantNotes")}</strong>
                            <ul>
                                <li>{t("register.description.ageInfo")}</li>
                                <li>
                                    <strong>APCS Music </strong>{t("register.description.disclaimer")}
                                </li>
                            </ul>
                        </div>
                        <form className="d-flex flex-column" onSubmit={handleSubmit(onSubmit, onError)}>
                            <Box className="row">
                                <Box className="col-md-8 col-sm-12">
                                    <FormControl component="fieldset" error={!!errors.userType}>
                                        <FormLabel
                                            className='fontSizeFormTitle'
                                            component="legend"
                                            sx={{
                                                color: "#e5cc92",
                                                "&.Mui-focused": { color: "#e5cc92 !important" },
                                                "&:hover": { color: "#e5cc92 !important" },
                                            }}
                                        >
                                            {t("register.form.whoAreYou")}
                                        </FormLabel>

                                        <Controller
                                            name="userType"
                                            control={control}
                                            rules={{ required: t("register.errors.required") }}
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
                                                                        color: "#e5cc92",
                                                                        "&.Mui-checked": { color: "#e5cc92" },
                                                                        "&.Mui-focusVisible": {
                                                                            outline: "2px solid #e5cc92",
                                                                        },
                                                                        "&.Mui-checked.Mui-focusVisible": {
                                                                            outline: "2px solid #e5cc92",
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
                                        {errors.userType && (
                                            <p style={{ color: "red" }}>{errors.userType.message}</p>
                                        )}
                                    </FormControl>
                                </Box>
                            </Box>


                            {/* Teacher's/Parent's Name */}
                            <Controller
                                name="name"
                                control={control}
                                rules={{ required: t("register.errors.required") }}
                                render={({ field, fieldState: { error } }) => (
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <TextField
                                            {...field}
                                            label={userTypeValue !== "Teacher"
                                                ? t("register.form.parentName")
                                                : t("register.form.teacherName")}
                                            variant="standard"
                                            className="custom-textfield-full mb-4"
                                            error={!!error}
                                            helperText={error ? error.message : ""}
                                        />

                                        <Tooltip title={t("register.form.teacherNameNote")}>
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
                                        color: "#e5cc92",
                                        "&.Mui-focused": { color: "#e5cc92 !important" },
                                        "&:hover": { color: "#e5cc92 !important" },
                                    }}
                                >
                                    {t("register.form.competitionCategory")}
                                </FormLabel>

                                <Controller
                                    name="competitionCategory"
                                    control={control}
                                    rules={{ required: t("register.errors.required") }}
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
                                                                color: "#e5cc92",
                                                                "&.Mui-checked": {
                                                                    color: "#e5cc92",
                                                                },
                                                                "&.Mui-focusVisible": {
                                                                    outline: "2px solid #e5cc92",
                                                                },
                                                                "&.Mui-checked.Mui-focusVisible": {
                                                                    outline: "2px solid #e5cc92",
                                                                },
                                                            }}
                                                        />
                                                    }
                                                    label={t(`register.competitionList.${key}`)}
                                                    sx={{ color: "#e5cc92" }}
                                                />
                                            ))}
                                        </RadioGroup>
                                    )}
                                />
                                {errors.competitionCategory && (
                                    <p style={{ color: "red" }}>{errors.competitionCategory.message}</p>
                                )}
                            </FormControl>


                            {/* Instrument Category (Radio Buttons) */}
                            {Object.keys(instrumentCategoryList).length > 0 && (
                                <FormControl className='mt-4' component="fieldset" error={!!errors.instrumentCategory}>
                                    <FormLabel
                                        className='fontSizeFormTitle'
                                        component="legend"
                                        sx={{
                                            color: "#e5cc92",
                                            "&.Mui-focused": { color: "#e5cc92 !important" },
                                            "&:hover": { color: "#e5cc92 !important" },
                                        }}
                                    >
                                        {t("register.form.instrumentCategory")}
                                    </FormLabel>

                                    <Controller
                                        name="instrumentCategory"
                                        control={control}
                                        rules={{ required: t("register.errors.required") }}
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
                                                                    color: "#e5cc92",
                                                                    "&.Mui-checked": {
                                                                        color: "#e5cc92",
                                                                    },
                                                                    "&.Mui-focusVisible": {
                                                                        outline: "2px solid #e5cc92",
                                                                    },
                                                                    "&.Mui-checked.Mui-focusVisible": {
                                                                        outline: "2px solid #e5cc92",
                                                                    },
                                                                }}
                                                            />
                                                        }
                                                        label={t(`register.instrumentList.${key}`)}
                                                        sx={{ color: "#e5cc92" }}
                                                    />
                                                ))}
                                            </RadioGroup>
                                        )}
                                    />
                                    {errors.instrumentCategory && (
                                        <p style={{ color: "red" }}>{errors.instrumentCategory.message}</p>
                                    )}
                                </FormControl>
                            )}


                            {/* Age Category (Radio Buttons) */}
                            <FormControl className='mt-4' component="fieldset" error={!!errors.ageCategory}>
                                <FormLabel
                                    className='fontSizeFormTitle'
                                    component="legend"
                                    sx={{
                                        color: "#e5cc92",
                                        "&.Mui-focused": { color: "#e5cc92 !important" },
                                        "&:hover": { color: "#e5cc92 !important" },
                                    }}
                                >
                                    {t("register.form.ageCategory")}
                                </FormLabel>

                                <Controller
                                    name="ageCategory"
                                    control={control}
                                    rules={{ required: t("register.errors.required") }}
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
                                                                color: "#e5cc92",
                                                                "&.Mui-checked": {
                                                                    color: "#e5cc92",
                                                                },
                                                                "&.Mui-focusVisible": {
                                                                    outline: "2px solid #e5cc92",
                                                                },
                                                                "&.Mui-checked.Mui-focusVisible": {
                                                                    outline: "2px solid #e5cc92",
                                                                },
                                                            }}
                                                        />
                                                    }
                                                    label={t(`register.ageCategories.${key}`)}
                                                    sx={{ color: "#e5cc92" }}
                                                />
                                            ))}
                                        </RadioGroup>
                                    )}
                                />
                                {errors.ageCategory && (
                                    <p style={{ color: "red" }}>{errors.ageCategory.message}</p>
                                )}
                            </FormControl>


                            {/* Total Performer */}
                            <Box className="row mt-2">
                                <Box className="col-6 col-md-2">
                                    <FormControl component="fieldset" error={!!errors.totalPerformer}>
                                        <FormLabel
                                            className='fontSizeFormTitle'
                                            component="legend"
                                            sx={{
                                                color: "#e5cc92",
                                                "&.Mui-focused": { color: "#e5cc92 !important" },
                                                "&:hover": { color: "#e5cc92 !important" },
                                            }}
                                        >
                                            {t("register.form.performerCount")}
                                        </FormLabel>

                                        <Controller
                                            name="totalPerformer"
                                            control={control}
                                            rules={{ required: t("register.errors.required") }}
                                            render={({ field, fieldState: { error } }) => (
                                                <InputNumber
                                                    suffix={t("register.form.personSuffix")} // Optional, for localization
                                                    min={1}
                                                    max={15}
                                                    onError={!!error}
                                                    defaultValue={1}
                                                    onChange={(value) => {
                                                        field.onChange(value);
                                                        handleChangePerformer(value);
                                                    }}
                                                    style={{ width: '100%' }}
                                                />
                                            )}
                                        />

                                        <small className="note">*{performerExpText}. </small>

                                        {errors.totalPerformer && (
                                            <p style={{ color: "red" }}>{errors.totalPerformer.message}</p>
                                        )}
                                    </FormControl>
                                </Box>
                            </Box>

                            {/* #region Student's Info */}
                            {fields.map((item, index) => (
                                <React.Fragment key={item.id}>
                                    <FormLabel
                                        className='mt-4 fontSizeFormTitle'
                                        component="legend"
                                        sx={{
                                            color: "#e5cc92",
                                            "&.Mui-focused": { color: "#e5cc92 !important" },
                                            "&:hover": { color: "#e5cc92 !important" },
                                            marginBottom: 0,
                                        }}
                                    >
                                        {`${t("register.form.personalInformation")} ${index + 1}`}
                                    </FormLabel>

                                    {/* First & Last Name */}
                                    <Box className="row">
                                        <Box className="col-6">
                                            <Controller
                                                name={`performers.${index}.firstName`}
                                                control={control}
                                                rules={{ required: t("register.errors.required") }}
                                                render={({ field, fieldState: { error } }) => (
                                                    <TextField {...field}
                                                        label={t("register.form.firstName")}
                                                        variant="standard"
                                                        className="custom-textfield-full mb-4"
                                                        error={!!error}
                                                        helperText={error?.message}
                                                    />
                                                )}
                                            />
                                        </Box>
                                        <Box className="col-6">
                                            <Controller
                                                name={`performers.${index}.lastName`}
                                                control={control}
                                                rules={{ required: t("register.errors.required") }}
                                                render={({ field, fieldState: { error } }) => (
                                                    <TextField {...field}
                                                        label={t("register.form.lastName")}
                                                        variant="standard"
                                                        className="custom-textfield-full mb-4"
                                                        error={!!error}
                                                        helperText={error?.message}
                                                    />
                                                )}
                                            />
                                        </Box>
                                    </Box>

                                    {/* Nationality, DOB, Gender */}
                                    <Box className="row mt-2">
                                        <Box className="col-6">
                                            <Controller
                                                name={`performers.${index}.nationality`}
                                                control={control}
                                                rules={{ required: t("register.errors.required") }}
                                                render={({ field, fieldState: { error } }) => (
                                                    <TextField
                                                        {...field}
                                                        placeholder="Indonesia"
                                                        label={t("register.form.nationality")}
                                                        variant="standard"
                                                        className="custom-textfield-full mb-4"
                                                        error={!!error}
                                                        helperText={error?.message}
                                                    />
                                                )}
                                            />
                                        </Box>

                                        <Box className="col-6 col-md-3 align-content-center">
                                            <Box className='d-flex' sx={{ width: "100%", gap: 4 }}>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <Controller
                                                        name={`performers.${index}.dob`}
                                                        control={control}
                                                        rules={{ required: t("register.errors.required") }}
                                                        render={({ field, fieldState: { error } }) => (
                                                            <DatePicker
                                                                {...field}
                                                                label={t("register.form.dob")}
                                                                value={field.value ? dayjs(field.value) : null}
                                                                onChange={(newValue) => field.onChange(newValue)}
                                                                format='DD/MM/YYYY'
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
                                                                        variant: "outlined",
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

                                        <Box className="col-12 col-md-3 align-content-center">
                                            <FormControl component="fieldset" error={!!errors.userType}>
                                                <FormLabel
                                                    component="legend"
                                                    sx={{
                                                        color: "#e5cc92",
                                                        "&.Mui-focused": { color: "#e5cc92 !important" },
                                                        "&:hover": { color: "#e5cc92 !important" },
                                                    }}
                                                >
                                                    {t("register.form.gender")}
                                                </FormLabel>

                                                <Controller
                                                    name={`performers.${index}.gender`}
                                                    control={control}
                                                    rules={{ required: t("register.errors.required") }}
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
                                        </Box>
                                    </Box>

                                    {/* Email & Phone */}
                                    <Box className="row align-items-center">
                                        <Box className="col-12 col-md-6">
                                            <Controller
                                                name={`performers.${index}.email`}
                                                control={control}
                                                rules={{
                                                    required: t("register.errors.required"),
                                                    pattern: {
                                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                                        message: t("register.errors.email")
                                                    }
                                                }}
                                                render={({ field, fieldState: { error } }) => (
                                                    <TextField
                                                        {...field}
                                                        type="email" // Ensure email input type is set
                                                        placeholder="JohnDoe@gmail.com"
                                                        id="standard-basic"
                                                        label={t("register.form.email")}
                                                        variant="standard"
                                                        className="custom-textfield-full mb-4"
                                                        error={!!error}
                                                        helperText={error ? error.message : ""}
                                                    />
                                                )}
                                            />
                                        </Box>
                                        <Box className="col-12 col-md-6">
                                            <Controller
                                                name={`performers.${index}.phoneNumber`}
                                                control={control}
                                                rules={{ required: t("register.errors.required") }}
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
                                                                rules={{ required: t("register.errors.required") }}
                                                                render={({ field }) => (
                                                                    <Cascader
                                                                        {...field}
                                                                        options={countryCodes.map(code => ({ value: code.code, label: code.name }))}

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

                                    {/* City / Country */}
                                    <Box className="row">
                                        <Box className="col-6">
                                            <Controller
                                                name={`performers.${index}.city`}
                                                control={control}
                                                rules={{ required: t("register.errors.required") }}
                                                render={({ field, fieldState: { error } }) => (
                                                    <TextField {...field} label={t("register.form.city")} variant="standard" className="custom-textfield-full mb-4" error={!!error} helperText={error?.message} />
                                                )}
                                            />
                                        </Box>
                                        <Box className="col-6">
                                            <Controller
                                                name={`performers.${index}.country`}
                                                control={control}
                                                rules={{ required: t("register.errors.required") }}
                                                render={({ field, fieldState: { error } }) => (
                                                    <TextField {...field} label={t("register.form.country")} variant="standard" className="custom-textfield-full mb-4" error={!!error} helperText={error?.message} />
                                                )}
                                            />
                                        </Box>
                                    </Box>

                                    {/* Province / Zipcode */}
                                    <Box className="row">
                                        <Box className="col-6">
                                            <Controller
                                                name={`performers.${index}.province`}
                                                control={control}
                                                rules={{ required: t("register.errors.required") }}
                                                render={({ field, fieldState: { error } }) => (
                                                    <TextField {...field} label={t("register.form.province")} variant="standard" className="custom-textfield-full mb-4" error={!!error} helperText={error?.message} />
                                                )}
                                            />
                                        </Box>
                                        <Box className="col-6">
                                            <Controller
                                                name={`performers.${index}.zipCode`}
                                                control={control}
                                                rules={{ required: t("register.errors.required") }}
                                                render={({ field, fieldState: { error } }) => (
                                                    <TextField {...field} label={t("register.form.zipcode")} variant="standard" className="custom-textfield-full mb-4" error={!!error} helperText={error?.message} />
                                                )}
                                            />
                                        </Box>
                                    </Box>

                                    {/* Address */}
                                    <Controller
                                        name={`performers.${index}.addressLine`}
                                        control={control}
                                        rules={{ required: t("register.errors.required") }}
                                        render={({ field, fieldState: { error } }) => (
                                            <TextField {...field} label={t("register.form.address")} variant="standard" className="custom-textfield-full mb-4" error={!!error} helperText={error?.message} />
                                        )}
                                    />
                                </React.Fragment>
                            ))}


                            {/* Exam Certificate Upload */}
                            < FileInput
                                name="examCertificate"
                                control={control}
                                label={t("register.form.examCert")}
                                smallNotes={<small className="note">{t("register.notes.uploadCombined")}</small>}
                                rules={{ required: t("register.errors.required") }}
                                tooltipLabel={t("register.form.examCertTooltip")}
                                inputRef={examInputRef}
                            />

                            {/* Birth Certificate Upload */}
                            <FileInput
                                name="birthCertificate"
                                control={control}
                                label={t("register.form.birthCert")}
                                smallNotes={<small className="note">{t("register.notes.uploadCombined")}</small>}
                                rules={{ required: t("register.errors.required") }}
                                tooltipLabel={t("register.form.birthCertTooltip")}
                                inputRef={birthCertInputRef}
                            />

                            {/* PDF Repertoire Upload */}
                            <FileInput
                                name="pdfRepertoire"
                                control={control}
                                label={t("register.form.repertoire")}
                                smallNotes={<small className="note">{t("register.notes.uploadCombined")}</small>}
                                rules={{ required: t("register.errors.required") }}
                                tooltipLabel={t("register.form.repertoireTooltip")}
                                inputRef={repertoireInputRef}
                            />


                            {/* YouTube Link */}
                            <div className='d-flex'>
                                <Controller
                                    name="youtubeLink"
                                    control={control}
                                    rules={{ required: t("register.errors.required") }}
                                    render={({ field, fieldState: { error } }) => (
                                        <TextField
                                            {...field}
                                            sx={{ mt: 2 }}
                                            label={t("register.form.youtube")}
                                            variant="standard"
                                            className="custom-textfield-full mb-4"
                                            error={!!error}
                                            helperText={error ? error.message : ""}
                                        />
                                    )}
                                />

                                <Tooltip title={
                                    <div>
                                        <p>{t("register.form.youtubeNote")}</p>
                                    </div>
                                }>
                                    <IconButton sx={{ color: "#e5cc92", fontSize: 16, mt: 1 }}>
                                        <QuestionCircleOutlined />
                                    </IconButton>
                                </Tooltip>
                            </div>

                            {/* Agreement */}
                            <Box className="creamText" sx={{ mt: 2 }}>
                                {t("register.form.agreementText")}
                            </Box>

                            <FormControlLabel
                                sx={{
                                    color: "#e5cc92",
                                    "&.Mui-focused": { color: "#e5cc92 !important" },
                                    "&:hover": { color: "#e5cc92 !important" },
                                }}
                                control={
                                    <Controller
                                        name="agreement"
                                        control={control}
                                        rules={{ required: t("register.errors.required") }}
                                        render={({ field }) => (
                                            <Checkbox
                                                {...field}
                                                sx={{
                                                    color: "#e5cc92",
                                                    "&.Mui-checked": {
                                                        color: "#e5cc92",
                                                    },
                                                    "&.Mui-focusVisible": {
                                                        outline: "2px solid #e5cc92",
                                                    },
                                                }}
                                            />
                                        )}
                                    />
                                }
                                label={t("register.form.agree")}
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
                                    {t("register.submitAnotherRegistrant")}
                                </Button>
                            ) : (
                                <Button
                                    disabled={isLoading}
                                    type="submit" variant="contained" color="primary"
                                    sx={{
                                        backgroundColor: "#e5cc92",
                                        padding: "8px",
                                        color: "black",
                                        // Override disabled styles to keep the same background and text color
                                        "&.Mui-disabled": {
                                            backgroundColor: "#e5cc92",
                                            color: "black",
                                            position: 'relative',
                                            opacity: 0.5, // you can adjust the opacity to indicate disabled state
                                        },
                                        "&:hover": { backgroundColor: "#d9a84d" },

                                    }}
                                >
                                    {t("register.submit")}
                                    {/* {isLoading && (
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
                                    )} */}
                                    {isLoading && (
                                        <Box
                                            sx={{
                                                color: "blue",
                                                position: 'absolute',
                                                top: '30%',
                                                left: '50%',
                                                marginTop: '-12px',
                                                marginLeft: '-12px',
                                            }}
                                        >
                                            <CircularProgress variant="determinate" value={progressLoading} />
                                            <Box
                                                sx={{
                                                    top: '50%',
                                                    left: '50%',
                                                    marginTop: '-12px',
                                                    marginLeft: '-14px',
                                                    position: 'absolute',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                {/* <Typography
                                                    variant="caption"
                                                    component="div"
                                                    sx={{ color: 'text.secondary' }}
                                                >
                                                    {`${Math.round(progressLoading)}%`}
                                                </Typography> */}
                                            </Box>
                                        </Box>
                                    )}
                                </Button>
                            )}
                        </form>
                    </div>
                </div>
            </div >
        </div >
    )
}

export default Register;