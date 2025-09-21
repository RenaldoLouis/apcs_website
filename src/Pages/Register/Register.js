import {
    QuestionCircleOutlined
} from '@ant-design/icons';
import {
    Box,
    Button,
    Checkbox,
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
import { addDoc, collection, doc, getDoc, serverTimestamp } from 'firebase/firestore';
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from 'react-toastify';
import apis from '../../apis';
import banner from "../../assets/images/banner.png";
import FileInput from '../../components/molecules/FileInput';
import RadioForm from '../../components/molecules/Form/RadioForm';
import LoadingOverlay from '../../components/molecules/LoadingOverlay';
import YoutubeDurationFetcher from '../../components/molecules/YoutubeVideoFetcher';
import { countryCodes } from '../../constant/CountryCodePhone';
import { PaymentStatus } from '../../constant/PaymentStatus';
import { ageCategories, brassAgeCategoriesEnsemble, brassAgeCategoriesSolo, BrassInstrumentListEnsemble, BrassInstrumentListSolo, competitionList, ensembleAgeCategories, guitarAgeCategoriesEnsemble, guitarAgeCategoriesSolo, GuitarInstrumentListEnsemble, GuitarInstrumentListSolo, HarpInstrumentListEnsemble, HarpInstrumentListSolo, PercussionAgeCategoriesEnsemble, percussionAgeCategoriesSolo, PercussionInstrumentListEnsemble, PercussionInstrumentListSolo, PerformanceCategory, PianoInstrumentListEnsemble, PianoInstrumentListSolo, stringAgeCategoriesEnsemble, stringAgeCategoriesSolo, StringsInstrumentListEnsemble, StringsInstrumentListSolo, vocalAgeCategoriesEnsemble, vocalAgeCategoriesSolo, VocalInstrumentListEnsembleElaborated, VocalInstrumentListSolo, woodwinAgeCategoriesEnsemble, woodwinAgeCategoriesSolo, WoodwindInstrumentListEnsemble, WoodwindInstrumentListSolo } from '../../constant/RegisterPageConst';
import { useAuth } from '../../context/DataContext';
import { db } from '../../firebase';
import SubmissionConfirmationModal from './SubmissionConfirmationModal';
import WelcomeModalRegister from './WelcomeModalRegister';

const Register = () => {
    const { t } = useTranslation();
    const examInputRef = useRef();
    const paymentProofInputRef = useRef();
    const profilePhotoInputRef = useRef();
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

    const { isSmallMobileAndSmaller } = useAuth();

    const [isLoading, setIsLoading] = useState(false);
    const [isSaveSuccess, setIsSaveSuccess] = useState(false);
    const [totalPerformer, setTotalPerformer] = useState(1);
    const [progressLoading, setProgressLoading] = useState(10);
    const [youtubeDuration, setYoutubeDuration] = useState(0);
    const [isWarningModalOpen, setIsWarningModalOpen] = useState(true);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    const { unregister, setValue, watch, register, control, formState: { errors }, handleSubmit, reset, clearErrors } = useForm({
        defaultValues: {
            ageCategory: null,
            userType: "Teacher",
            competitionCategory: "",
            instrumentCategory: "",
            traditionalInstrument: "",
            name: "",
            youtubeLink: "",
            remark: "",
            performers: [{
                firstName: "",
                lastName: "",
                email: "",
                phoneNumber: "",
                countryCode: ["+62"],
                city: "",
                country: "",
                province: "",
                zipCode: "",
                addressLine: "",
                dob: null
            }],
            totalPerformer: 1,
            PerformanceCategory: PerformanceCategory.Solo,
            sameAddress: false
        },
        mode: "onBlur", // or "onBlur"
        shouldUnregister: false,
    })

    const selectedCompetition = watch("competitionCategory");
    const userTypeValue = watch("userType");
    const instrumentCategoryValue = watch("instrumentCategory");
    const PerformanceCategoryValue = watch("PerformanceCategory");
    const sameAddressValue = watch("sameAddress");
    const youtubeLinkValue = watch("youtubeLink");
    const watchedFieldsPerformer = watch("performers");
    const performersValue = useWatch({ control, name: "performers" });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "performers"
    });

    const extractVideoId = (url) => {
        try {
            const parsed = new URL(url);
            return parsed.searchParams.get("v") || parsed.pathname.split("/").pop();
        } catch {
            return null;
        }
    };

    const getFirstErrorKey = (errorObj, path = '') => {
        for (const key in errorObj) {
            const newPath = path ? `${path}.${key}` : key;
            const val = errorObj[key];
            if (val?.message) {
                return newPath;
            } else if (typeof val === 'object') {
                const nested = getFirstErrorKey(val, newPath);
                if (nested) return nested;
            }
        }
        return null;
    };

    const onError = (errors) => {
        const fullErrorKey = getFirstErrorKey(errors);
        if (!fullErrorKey) return;

        const errorElement = document.querySelector(`[name="${fullErrorKey}"]`);
        const errorElementID = document.getElementById(fullErrorKey);

        // Check if this is a file input by checking tagName + type
        const isHiddenFileInput =
            errorElement?.tagName === "INPUT" &&
            errorElement?.type === "file" &&
            getComputedStyle(errorElement).display === "none";

        let targetElement = null;

        if (isHiddenFileInput) {
            // Prefer scrolling to a visible wrapper for file inputs
            targetElement = document.getElementById(`file-input-wrapper-${fullErrorKey}`);
        }

        // Fallbacks if not a hidden file input
        targetElement = targetElement || errorElement || errorElementID;

        if (targetElement) {
            targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
            targetElement.focus?.({ preventScroll: true }); // preventScroll so it doesn't jump after scrolling
            setIsConfirmModalOpen(false)
        }
    };

    const handleCloseWarning = () => setIsWarningModalOpen(false);
    const handleOpenConfirmationModal = (event) => {
        if (!isSaveSuccess) {
            event.preventDefault()
            setIsConfirmModalOpen(true)
        }
    }

    const calculatePrice = async (data, isInternational) => {
        try {
            // 1. Determine the document ID (e.g., "Piano" -> "piano")
            const categoryId = data.competitionCategory.toLowerCase();

            // 2. Fetch the pricing rules for the entire category
            const priceDocRef = doc(db, 'Registration2025Fee', categoryId);

            const priceDocSnap = await getDoc(priceDocRef);

            if (!priceDocSnap.exists()) {
                throw new Error(`Pricing info for category "${categoryId}" not found.`);
            }
            const pricingData = priceDocSnap.data();
            let selectedTier = null;

            // 3. Find the correct pricing tier based on performance type
            if (data.PerformanceCategory === PerformanceCategory.Solo) {
                selectedTier = pricingData.fees.find(
                    tier => tier.category.toLowerCase() === data.ageCategory.toLowerCase()
                );
            }
            else if (data.PerformanceCategory === PerformanceCategory.Ensemble) {
                // For ensembles, we need to match both category and age group
                selectedTier = pricingData.fees.find(tier => {
                    // First, the main category must always match.
                    const categoryMatch = tier.category.toLowerCase() === data.instrumentCategory.toLowerCase();

                    // If the main category doesn't match, this isn't the right tier.
                    if (!categoryMatch) {
                        return false;
                    }

                    // Now, check the age group conditionally.
                    // If the pricing data in Firestore does NOT have an age_group, it's a match (e.g., for Piano).
                    if (!tier.age_group) {
                        return true;
                    }

                    // If it DOES have an age_group, then it must match the one from the form.
                    return tier.age_group.toLowerCase() === data.ageCategory.toLowerCase();
                });
            }

            if (!selectedTier) {
                throw new Error(`Could not find a matching price for the selected options.`);
            }

            // 4. Determine currency and final price
            let amount = 0;
            let currency = '';

            // SPECIAL LOGIC for Vocal/Choir ensemble pricing
            if (categoryId === 'vocalchoir' && data.PerformanceCategory === PerformanceCategory.Ensemble) {
                // Check if the number of performers qualifies for the special price
                const useSpecialPrice = data.totalPerformer === selectedTier.maxPerformers;

                if (isInternational) {
                    amount = useSpecialPrice ? selectedTier.internationalPriceSpecial : selectedTier.internationalPriceRegular;
                    currency = 'USD';
                } else {
                    amount = useSpecialPrice ? selectedTier.nationalPriceSpecial : selectedTier.nationalPriceRegular;
                    currency = 'IDR';
                }
            } else {
                // Standard logic for all other categories
                if (isInternational) {
                    amount = selectedTier.internationalPrice;
                    currency = 'USD';
                } else {
                    amount = selectedTier.nationalPrice;
                    currency = 'IDR';
                }
            }

            // 5. Return a structured price object
            return {
                amount: amount,
                currency: currency,
                formattedAmount: `${currency} ${amount.toLocaleString(currency === 'IDR' ? 'id-ID' : 'en-US')}`
            };

        } catch (error) {
            console.error("Price calculation failed:", error);
            return { amount: 0, currency: 'N/A', formattedAmount: 'Not Available' };
        }
    };

    const onSubmit = async (data) => {
        try {
            setIsConfirmModalOpen(false)
            setIsLoading(true)
            const formattedDatePerformers = data?.performers.map((performer) => {
                const formattedDate = performer?.dob?.format("DD/MM/YYYY") ?? null;

                return { ...performer, dob: formattedDate, countryCode: performer.countryCode[0] }
            })

            if (formattedDatePerformers.length <= 0) {
                throw new Error('No valid performer data found to process.');
            }

            const now = new Date();
            const timestamp = now.toISOString().replace(/[-:.TZ]/g, "").slice(0, 14); // e.g. "20250512134501"

            //save ProfilePhoto
            const profilePhoto = data.profilePhoto[0]
            const baseName = profilePhoto.name.replace(/\s/g, "").replace(/\.[^/.]+$/, "");
            const directoryName = `${baseName}_${timestamp}`;

            const res = await apis.aws.postSignedUrl(directoryName, "profilePhoto")
            const signedUrl = res.data.link
            await axios.put(signedUrl, profilePhoto, {
                headers: {
                    'Content-Type': profilePhoto.type, // Ensure this matches the file type
                },
            });
            const profilePhotoS3Link = `s3://registrants2025/${directoryName}/profilePhoto.pdf`;
            setProgressLoading(10)

            //save PaymentProof
            const paymentProof = data.paymentProof[0]
            const res1 = await apis.aws.postSignedUrl(directoryName, "paymentProof")
            const signedUrl1 = res1.data.link
            await axios.put(signedUrl1, paymentProof, {
                headers: {
                    'Content-Type': paymentProof.type, // Ensure this matches the file type
                },
            });
            const paymentProofS3Link = `s3://registrants2025/${directoryName}/paymentProof.pdf`;
            setProgressLoading(20)

            //save exam cert
            const pdfRepertoire = data.pdfRepertoire[0]
            // const directoryName2 = pdfRepertoire.name.replace(/\s/g, "").replace(/\.[^/.]+$/, "");
            const res2 = await apis.aws.postSignedUrl(directoryName, "pdfRepertoire")
            const signedUrl2 = res2.data.link
            await axios.put(signedUrl2, pdfRepertoire, {
                headers: {
                    'Content-Type': pdfRepertoire.type, // Ensure this matches the file type
                },
            });
            const pdfRepertoireS3Link = `s3://registrants2025/${directoryName}/pdfRepertoire.pdf`;
            setProgressLoading(30)

            //save birth cert first
            const birthCert = data.birthCertificate[0]
            // const directoryName3 = birthCert.name.replace(/\s/g, "").replace(/\.[^/.]+$/, "");
            const res3 = await apis.aws.postSignedUrl(directoryName, "birthCert")
            const signedUrl3 = res3.data.link
            await axios.put(signedUrl3, birthCert, {
                headers: {
                    'Content-Type': birthCert.type, // Ensure this matches the file type
                },
            });
            const birthCertS3Link = `s3://registrants2025/${directoryName}/birthCert.pdf`;
            setProgressLoading(50)

            //save pdf report
            const examCertificate = data.examCertificate[0]
            // const directoryName4 = examCertificate.name.replace(/\s/g, "").replace(/\.[^/.]+$/, "");
            const res4 = await apis.aws.postSignedUrl(directoryName, "examCertificate")
            const signedUrl4 = res4.data.link
            await axios.put(signedUrl4, examCertificate, {
                headers: {
                    'Content-Type': examCertificate.type, // Ensure this matches the file type
                },
            });
            const examCertificateS3Link = `s3://registrants2025/${directoryName}/examCertificate.pdf`;
            setProgressLoading(70)

            const HUNGARY_COUNTRY_CODE = '+36';
            const IdCode = '+62';
            const isHungaryParticipant = watchedFieldsPerformer?.some(
                performer => performer?.countryCode?.[0] === HUNGARY_COUNTRY_CODE
            );

            const isInternational = watchedFieldsPerformer?.some(
                performer => performer?.countryCode?.[0] !== IdCode
            );

            const payload = {
                ageCategory: data.ageCategory,
                totalPerformer: data.totalPerformer,
                agreement: data.agreement,
                competitionCategory: data.competitionCategory,
                PerformanceCategory: data.PerformanceCategory,
                instrumentCategory: data.instrumentCategory,
                traditionalInstrument: data?.traditionalInstrument ?? "",
                userType: data.userType,
                performers: formattedDatePerformers,
                name: data.name,
                youtubeLink: data.youtubeLink,
                remark: data.remark,
                videoDuration: youtubeDuration ?? 0,
                profilePhotoS3Link: profilePhotoS3Link,
                pdfRepertoireS3Link: pdfRepertoireS3Link,
                paymentProofS3Link: paymentProofS3Link,
                birthCertS3Link: birthCertS3Link,
                examCertificateS3Link: examCertificateS3Link,
                createdAt: serverTimestamp(),
                ...(data.teacherName && { teacherName: data.teacherName }),
                ...(isInternational && { paymentStatus: PaymentStatus.PENDING })
            };

            await addDoc(collection(db, "Registrants2025"), payload);

            const price = await calculatePrice(data, isInternational);

            const dataEmail = formattedDatePerformers.map(({ email, firstName, lastName }) => ({
                email,
                name: `${firstName} ${lastName}`,
                competitionCategory: data.competitionCategory,
                instrumentCategory: data.instrumentCategory,
                price: price.formattedAmount
            }))

            setProgressLoading(90)
            // send email welcome to Indonesia registrant after register
            if (!isInternational) {
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
            }

            //send email to notify APCS
            apis.email.sendEmailNotifyApcs(dataEmail).then((res) => {
                if (res.status === 200) {
                    setIsSaveSuccess(true)
                } else {
                    throw new Error("Email notificaion sending failed with status " + res.status);
                }
                setIsLoading(false)
            })

            // send email for International Client ask for payment
            if (isInternational) {
                apis.email.sendEmailPaymentRequest(dataEmail).then((res) => {
                    if (res.status === 200) {
                        setIsSaveSuccess(true)
                    } else {
                        throw new Error("Email payment sending failed with status " + res.status);
                    }
                    setIsLoading(false)
                })
            }

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
        setTotalPerformer(1)
        // Clear file input
        if (examInputRef.current) {
            examInputRef.current.value = null;
        }
        if (paymentProofInputRef.current) {
            paymentProofInputRef.current.value = null;
        }
        if (birthCertInputRef.current) {
            birthCertInputRef.current.value = null;
        }
        if (profilePhotoInputRef.current) {
            profilePhotoInputRef.current.value = null;
        }
        if (repertoireInputRef.current) {
            repertoireInputRef.current.value = null;
        }
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
        setProgressLoading(0)
    }

    // Sync the fields with `totalPerformer`
    useEffect(() => {
        const timer = setTimeout(() => {
            const currentLength = watchedFieldsPerformer.length;
            if (totalPerformer > currentLength) {
                for (let i = currentLength; i < totalPerformer; i++) {
                    append({
                        firstName: "",
                        lastName: "",
                        email: "",
                        phoneNumber: "",
                        countryCode: ["+62"],
                        city: "",
                        country: "",
                        province: "",
                        zipCode: "",
                        addressLine: "",
                        dob: null
                    });
                }
            } else if (totalPerformer < currentLength) {
                for (let i = currentLength; i > totalPerformer; i--) {
                    remove(i - 1);
                }
            }
        }, 0)
        return () => clearTimeout(timer);

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
        setValue('totalPerformer', value)
    }

    const instrumentCategoryList = useMemo(() => {
        switch (selectedCompetition) {
            case competitionList.Piano:
                if (PerformanceCategoryValue === PerformanceCategory.Solo) {
                    return PianoInstrumentListSolo
                } else {
                    return PianoInstrumentListEnsemble
                }

            case competitionList.Woodwinds:
                if (PerformanceCategoryValue === PerformanceCategory.Solo) {
                    return WoodwindInstrumentListSolo
                } else {
                    return WoodwindInstrumentListEnsemble
                }

            case competitionList.Percussions:
                if (PerformanceCategoryValue === PerformanceCategory.Solo) {
                    return PercussionInstrumentListSolo
                } else {
                    return PercussionInstrumentListEnsemble
                }

            case competitionList.Guitar:
                if (PerformanceCategoryValue === PerformanceCategory.Solo) {
                    return GuitarInstrumentListSolo
                } else {
                    return GuitarInstrumentListEnsemble
                }

            case competitionList.Harp:
                if (PerformanceCategoryValue === PerformanceCategory.Solo) {
                    return HarpInstrumentListSolo
                } else {
                    return HarpInstrumentListEnsemble
                }

            case competitionList.Brass:
                if (PerformanceCategoryValue === PerformanceCategory.Solo) {
                    return BrassInstrumentListSolo
                } else {
                    return BrassInstrumentListEnsemble
                }

            case competitionList.Strings:
                if (PerformanceCategoryValue === PerformanceCategory.Solo) {
                    return StringsInstrumentListSolo
                } else {
                    return StringsInstrumentListEnsemble
                }

            case competitionList.VocalChoir:
                if (PerformanceCategoryValue === PerformanceCategory.Solo) {
                    return VocalInstrumentListSolo
                } else {
                    return VocalInstrumentListEnsembleElaborated
                }

            default:
                return {}
        }
    }, [selectedCompetition, PerformanceCategoryValue])

    const filteredAgeCategories = useMemo(() => {
        switch (selectedCompetition) {
            case competitionList.Piano:
                if (PerformanceCategoryValue === PerformanceCategory.Solo) {
                    return ageCategories
                } else {
                    return ensembleAgeCategories
                }

            case competitionList.Woodwinds:
                if (PerformanceCategoryValue === PerformanceCategory.Solo) {
                    return woodwinAgeCategoriesSolo
                } else {
                    return woodwinAgeCategoriesEnsemble
                }

            case competitionList.Percussions:
                if (PerformanceCategoryValue === PerformanceCategory.Solo) {
                    return percussionAgeCategoriesSolo
                } else {
                    return PercussionAgeCategoriesEnsemble
                }
            case competitionList.Guitar:
                if (PerformanceCategoryValue === PerformanceCategory.Solo) {
                    return guitarAgeCategoriesSolo
                } else {
                    return guitarAgeCategoriesEnsemble
                }
            case competitionList.Harp:
                if (PerformanceCategoryValue === PerformanceCategory.Solo) {
                    return guitarAgeCategoriesSolo
                } else {
                    return guitarAgeCategoriesEnsemble
                }
            case competitionList.Brass:
                if (PerformanceCategoryValue === PerformanceCategory.Solo) {
                    return brassAgeCategoriesSolo
                } else {
                    return brassAgeCategoriesEnsemble
                }

            case competitionList.Strings:
                if (PerformanceCategoryValue === PerformanceCategory.Solo) {
                    return stringAgeCategoriesSolo
                } else {
                    return stringAgeCategoriesEnsemble
                }

            case competitionList.VocalChoir:
                if (PerformanceCategoryValue === PerformanceCategory.Solo) {
                    return vocalAgeCategoriesSolo
                } else {
                    return vocalAgeCategoriesEnsemble
                }

            default:
                return {}
        }
    }, [selectedCompetition, PerformanceCategoryValue])

    const minimalPerformer = useMemo(() => {
        if (PerformanceCategoryValue === PerformanceCategory.Solo) {
            return 1
        } else {
            return 2
        }
    }, [PerformanceCategoryValue])

    const maximalPerformer = useMemo(() => {
        if (PerformanceCategoryValue === PerformanceCategory.Solo) {
            return 1
        } else {
            switch (selectedCompetition) {
                case competitionList.Piano:
                    if (PerformanceCategoryValue === PerformanceCategory.Solo) {
                        return 1
                    } else {
                        return 9
                    }

                case competitionList.Woodwinds:
                    if (PerformanceCategoryValue === PerformanceCategory.Solo) {
                        return 1
                    } else {
                        const maxPerformersByCategory = {
                            woodwind_two_five_performer: 5,
                            woodwind_six_nine_performer: 9,
                            woodwind_ten_fifteen_performer: 15,
                        };
                        return maxPerformersByCategory[instrumentCategoryValue] || 15;
                    }

                case competitionList.Percussions:
                    if (PerformanceCategoryValue === PerformanceCategory.Solo) {
                        return 1
                    } else {
                        const maxPerformersByCategory = {
                            Duo: 2,
                            Trio: 3,
                            Quartet: 4,
                        };
                        return maxPerformersByCategory[instrumentCategoryValue] || 4;
                    }

                case competitionList.Guitar:
                    if (PerformanceCategoryValue === PerformanceCategory.Solo) {
                        return 1
                    } else {
                        const maxPerformersByCategory = {
                            twoToFive: 5,
                            sixToNine: 9,
                            tenToFifteen: 15,
                        };
                        return maxPerformersByCategory[instrumentCategoryValue] || 15;
                    }

                case competitionList.Brass:
                    if (PerformanceCategoryValue === PerformanceCategory.Solo) {
                        return 1
                    } else {
                        const maxPerformersByCategory = {
                            twoToFive: 5,
                            sixToNine: 9,
                            tenToFifteen: 15,
                        };
                        return maxPerformersByCategory[instrumentCategoryValue] || 15;
                    }

                case competitionList.Strings:
                    if (PerformanceCategoryValue === PerformanceCategory.Solo) {
                        return 1
                    } else {
                        const maxPerformersByCategory = {
                            twoToFive: 5,
                            sixToNine: 9,
                            tenToFifteen: 15,
                        };
                        return maxPerformersByCategory[instrumentCategoryValue] || 15;
                    }

                case competitionList.VocalChoir:
                    if (PerformanceCategoryValue === PerformanceCategory.Solo) {
                        return 1
                    } else {
                        const maxPerformersByCategory = {
                            smallEnsemble: 5,
                            bigEnsemble: 30
                        };
                        return maxPerformersByCategory[instrumentCategoryValue] || 5;
                    }

                case competitionList.Harp:
                    if (PerformanceCategoryValue === PerformanceCategory.Solo) {
                        return 1
                    } else {
                        const maxPerformersByCategory = {
                            twoToFive: 5,
                            sixToNine: 9,
                            tenToFifteen: 15,
                        };
                        return maxPerformersByCategory[instrumentCategoryValue] || 15;
                    }

                default:
                    return 2
            }
        }
    }, [PerformanceCategoryValue, selectedCompetition, instrumentCategoryValue])

    useEffect(() => {
        if (PerformanceCategoryValue === PerformanceCategory.Solo) {
            setTotalPerformer(1)
            setValue('totalPerformer', 1)
        } else {
            setTotalPerformer(2)
            setValue('totalPerformer', 2)
        }
    }, [PerformanceCategoryValue, selectedCompetition])

    const copyAddressFields = (from, to) => {
        setValue(`performers.${to}.addressLine`, from.addressLine);
        setValue(`performers.${to}.city`, from.city);
        setValue(`performers.${to}.country`, from.country);
        setValue(`performers.${to}.province`, from.province);
        setValue(`performers.${to}.zipCode`, from.zipCode);
    };

    useEffect(() => {
        if (!sameAddressValue) return;
        const source = performersValue?.[0];
        if (!source) return;

        for (let i = 1; i < performersValue.length; i++) {
            copyAddressFields(source, i);
        }
    }, [sameAddressValue, performersValue, setValue]);

    const sameAddressCheckbox = useMemo(() => {
        return (
            <FormControlLabel
                key="sameAddressCheckbox"
                sx={{
                    color: "#e5cc92",
                    "&.Mui-focused": { color: "#e5cc92 !important" },
                    "&:hover": { color: "#e5cc92 !important" },
                }}
                control={
                    <Controller
                        name="sameAddress"
                        control={control}
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
                label={t("register.SameAddress")}
            />
        );
    }, [control, t]);

    const isCategoryDisabled = (key) => {
        switch (key) {
            case competitionList.Piano:
                return true
            case competitionList.Percussions:
                return false
            case competitionList.Woodwinds:
                return true
            case competitionList.Guitar:
                return true
            case competitionList.VocalChoir:
                return false
            case competitionList.Brass:
                return false
            case competitionList.Harp:
                return false
            case competitionList.Strings:
                return false
            default:
                return true
        }
    }

    const videoExampleFormatText = useMemo(() => {
        // switch (selectedCompetition) {
        //     case competitionList.Piano:
        //         if (PerformanceCategoryValue === PerformanceCategory.Solo) {
        //             return "*APCSTSOA2025 - PIANO - OPEN AGE - JEREMY GLENN KENNEDY - Scarlatti: Sonata in B Minor, K 27, L 449: Allegro"
        //         } else {
        //             return "*APCSTSOA2025 - PIANO - Any 2-5 instruments with one piano - TIMOTHY’S CHAMBER -FLIGHT OF THE BUMBLEBEE"
        //         }
        //     case competitionList.Woodwinds:
        //         if (PerformanceCategoryValue === PerformanceCategory.Solo) {
        //             return "*APCSTSOA2025 - FLUTE - OPEN AGE - JEREMY GLENN KENNEDY - Scarlatti: Sonata in B Minor, K 27, L 449: Allegro"
        //         } else {
        //             return "*APCSTSOA2025 - Any 2-5 instruments - TIMOTHY’S CHAMBER - FLIGHT OF THE BUMBLEBEE"
        //         }
        //     case competitionList.Percussions:
        //         if (PerformanceCategoryValue === PerformanceCategory.Solo) {
        //             return "*APCSTSOA2025 - MARIMBA - OPEN AGE - JEREMY GLENN KENNEDY - Scarlatti: Sonata in B Minor, K 27, L 449: Allegro"
        //         } else {
        //             return "*APCSTSOA2025 - MULTI PERCUSSION - OPEN AGE - TIMOTHY’S CHAMBER - FLIGHT OF THEBUMBLEBEE"
        //         }
        //     default:
        //         return {}
        // }
        return "*https://youtu.be/FrVWHSeIXnY?si=8moHC_g6ncNZdAZO"
    }, [selectedCompetition, PerformanceCategoryValue])

    useEffect(() => {
        if (userTypeValue !== "Personal") {
            unregister("teacherName");
        }
    }, [userTypeValue, unregister]);

    const tncPdfLink = useMemo(() => {
        switch (selectedCompetition) {
            case competitionList.Piano:
                return "https://drive.google.com/file/d/1lVNvlKz8pwqr1UJmgNxE0JcT2T9FDsGg/view?usp=drive_link"
            case competitionList.Percussions:
                return "https://drive.google.com/file/d/1FmkzzfzpH8RiVRqKLCORLdUSI2Ldrf6N/view?usp=drive_link"
            case competitionList.Woodwinds:
                return "https://drive.google.com/file/d/1RLiRkGbCbSXEmv8ZhsoE8uuariWLvoOJ/view?usp=drive_link"
            case competitionList.Guitar:
                return "https://drive.google.com/file/d/1csQ7oLgx3RPsM0wgEj3ZJ59akmTM0Z3K/view?usp=drive_link"
            case competitionList.VocalChoir:
                return "https://drive.google.com/file/d/1GbdTZ9stbKujYK1unMh6hC0fKoGOyvt_/view?usp=drive_link"
            case competitionList.Brass:
                return "https://drive.google.com/file/d/1_Baord6xZI3WSS-P9RB2Mpsd5Sk-6xF0/view?usp=drive_link"
            case competitionList.Harp:
                return "https://drive.google.com/file/d/1Og9GQdnj9ANyAhFwdBJmVxQAQ_NlNV2G/view?usp=drive_link"
            case competitionList.Strings:
                return "https://drive.google.com/file/d/1m3Wpzw2liWdK-Kh7oRaoq97gj3JTg0nO/view?usp=drive_link"
            default:
                return "https://drive.google.com/file/d/1lVNvlKz8pwqr1UJmgNxE0JcT2T9FDsGg/view?usp=drive_link"
        }
    }, [selectedCompetition]);

    const pricePdfLink = useMemo(() => {
        switch (selectedCompetition) {
            case competitionList.Piano:
                return "https://drive.google.com/file/d/1y8zCdACvBfuWafIxOaJPqaBS-LHftSDP/view?usp=drive_link"
            case competitionList.Percussions:
                return "https://drive.google.com/file/d/19bSQmC_VFEcqYaGnurN3b0d0nR9O2roi/view?usp=drive_link"
            case competitionList.Woodwinds:
                return "https://drive.google.com/file/d/1brsGZ77X2p1s1U34qWBS9rjYu1BCnq3R/view?usp=drive_link"
            case competitionList.Guitar:
                return "https://drive.google.com/file/d/1vSNQXTJufxy0xt9ZiGER7X5IUM4RVyfj/view?usp=drive_link"
            case competitionList.VocalChoir:
                return "https://drive.google.com/file/d/1BT9MQp5KXD68qQxbmPESvWAEP8lRuI1g/view"
            case competitionList.Brass:
                return "https://drive.google.com/file/d/1Y50K8H4Z5d3VcrxmYnqmQuoZRzw2pAY4/view?usp=drive_link"
            case competitionList.Harp:
                return "https://drive.google.com/file/d/1GkyWWVxwaikW2yN0UhoPM6ksRYeV_cKF/view?usp=drive_link"
            case competitionList.Strings:
                return "https://drive.google.com/file/d/1T6Aka3iK3EHdYeJrw2S8owN8NKfj-YK_/view?usp=drive_link"
            default:
                return "https://drive.google.com/file/d/1y8zCdACvBfuWafIxOaJPqaBS-LHftSDP/view?usp=drive_link"
        }
    }, [selectedCompetition]);

    const warningPerformenceSchedule = useMemo(() => {
        switch (selectedCompetition) {
            case competitionList.Piano:
                return "Performers with 2 Pianos is for the performance of the upcoming year, 2026. For detailed information, please refer to the Terms and Conditions."
            case competitionList.Percussions:
                return "This registration is for the performance season of the upcoming year, 2026. For detailed timelines and schedules, please refer to the Terms and Conditions"
            case competitionList.Woodwinds:
                return "This registration for ensemble is for the performance season of the upcoming year, 2026. For detailed timelines and schedules, please refer to the Terms and Conditions"
            case competitionList.Guitar:
                return "This registration for ensemble guitar with 2 pianos is for the performance season of the upcoming year, 2026. For detailed timelines and schedules, please refer to the Terms and Conditions"
            case competitionList.VocalChoir:
                return "For detailed timelines and schedules, please refer to the Terms and Conditions"
            case competitionList.Brass:
                return "This registration is for the performance season of the upcoming year, 2026. For detailed timelines and schedules, please refer to the Terms and Conditions"
            case competitionList.Harp:
                return "This registration is for the performance season of the upcoming year, 2026. For detailed timelines and schedules, please refer to the Terms and Conditions"
            case competitionList.Strings:
                return "For detailed timelines and schedules, please refer to the Terms and Conditions"
            default:
                return "This registration is for the performance season of the upcoming year, 2026. For detailed timelines and schedules, please refer to the Terms and Conditions"
        }
    }, [selectedCompetition]);

    useEffect(() => {
        setValue('instrumentCategory', Object.keys(instrumentCategoryList)[0])
    }, [selectedCompetition])

    const isTraditionalInstrumentSelected = useMemo(() => {
        // First, ensure the value is a string to prevent errors
        if (typeof instrumentCategoryValue !== 'string') {
            return false;
        }

        // Convert the value to lowercase once for efficiency
        const lowercasedValue = instrumentCategoryValue.toLowerCase();

        // Check if the lowercase string includes either the English or Indonesian word
        return lowercasedValue.includes('traditional') || lowercasedValue.includes('tradisional');
    }, [instrumentCategoryValue]);

    useEffect(() => {
        if (!isTraditionalInstrumentSelected) {
            unregister("traditionalInstrument");
        }
    }, [isTraditionalInstrumentSelected, unregister]);


    return (
        <div className="primaryBackgroundBlack" style={{ padding: "128px 0px 48px 0px" }}>
            <div className="container" style={{ marginBottom: 30 }}>
                <div className="row">
                    <div className="col-sm">
                        <div className="mb-4 mangolaineFont creamText d-flex align-items-center justify-center" style={{ fontSize: isSmallMobileAndSmaller ? "8vmin" : "6vmin" }}>
                            {t("register.title")}
                        </div>
                        <img
                            className='mb-4'
                            src={banner} // Replace with your actual path
                            alt="Banner"
                            style={{ width: "100%", borderRadius: "3%" }}
                        // style={posterStyle}
                        />

                        <div className="creamText" style={{ color: '#e5cc92' }}>
                            {/* <div>
                                <strong>
                                    {t("register.description.line1")}
                                </strong>
                            </div> */}

                            <strong className='fontSizeFormTitle'>{t("register.description.importantNotes")}</strong>
                            <ul>
                                <li>{t("register.description.ageInfo")}</li>
                                <li>
                                    <strong>APCS Music </strong>{t("register.description.disclaimer")}
                                </li>
                            </ul>
                        </div>
                        <form className="d-flex flex-column" onSubmit={handleOpenConfirmationModal}>
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
                                // Add the new rules for minLength and pattern here
                                rules={{
                                    required: t("register.errors.required"),
                                    minLength: {
                                        value: 3,
                                        message: t("register.errors.nameMinLength") // New error message
                                    },
                                    pattern: {
                                        value: /^[A-Za-z\s'-]+$/, // Regex to allow letters, spaces, apostrophes, hyphens
                                        message: t("register.errors.nameMinLength") // New error message
                                    }
                                }}
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
                                            placeholder={t('register.form.placeholder_register_self')}
                                        />

                                        <Tooltip
                                            enterTouchDelay={0}
                                            title={t("register.form.teacherNameNote")}>
                                            <IconButton sx={{ color: "#e5cc92", fontSize: 16, mt: 1 }}>
                                                <QuestionCircleOutlined />
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                )}
                            />
                            {userTypeValue === "Personal" && (
                                <Controller
                                    name="teacherName"
                                    control={control}
                                    // Add the new rules inside the existing ternary operator
                                    rules={userTypeValue === "Personal" ? {
                                        required: t("register.errors.required"),
                                        minLength: {
                                            value: 3,
                                            message: t("register.errors.nameMinLength")
                                        },
                                        pattern: {
                                            value: /^[A-Za-z\s'-]+$/,
                                            message: t("register.errors.nameMinLength")
                                        }
                                    } : {}}
                                    render={({ field, fieldState: { error } }) => (
                                        userTypeValue === "Personal" && (
                                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                <TextField
                                                    {...field}
                                                    label={t("register.form.teacherName")}
                                                    variant="standard"
                                                    className="custom-textfield-full mb-4"
                                                    error={!!error}
                                                    helperText={error ? error.message : ""}
                                                />
                                            </div>
                                        )
                                    )}
                                />
                            )}

                            {/* Competition Category (Radio Button) */}
                            <FormControl className='mt-2' component="fieldset" error={!!errors.competitionCategory}>
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
                                                    disabled={isCategoryDisabled(key)}
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
                                                                "&.Mui-disabled": {
                                                                    color: "#a18f65", // Custom color when disabled
                                                                },
                                                            }}
                                                        />
                                                    }
                                                    label={t(`register.competitionList.${key}`)}
                                                    sx={{
                                                        color: "#e5cc92",
                                                        "&.Mui-disabled": {
                                                            color: "#a18f65", // Disabled label color
                                                            ".MuiTypography-root": {
                                                                color: "#a18f65", // Text node inside the label
                                                            },
                                                        },
                                                    }}
                                                />
                                            ))}
                                        </RadioGroup>
                                    )}
                                />
                                {errors.competitionCategory && (
                                    <p style={{ color: "red" }}>{errors.competitionCategory.message}</p>
                                )}
                            </FormControl>

                            <div className="text-white whitespace-nowrap" style={{ fontSize: 14 }}>
                                Terms and Conditions can be found{" "}
                                <a href={tncPdfLink}
                                    target='_blank'
                                    style={{ color: '#FBBF24' }}
                                    className="font-medium underline decoration-amber-400/50 underline-offset-4 transition-colors hover:text-amber-300 hover:decoration-amber-300"
                                >
                                    here
                                </a>
                                , and pricing details are available{" "}
                                <a href={pricePdfLink}
                                    target='_blank'
                                    style={{ color: '#FBBF24' }}
                                    className="font-medium underline decoration-amber-400/50 underline-offset-4 transition-colors hover:text-amber-300 hover:decoration-amber-300"
                                >
                                    here
                                </a>
                                .
                            </div>

                            {warningPerformenceSchedule !== null && (
                                <p style={{ color: '#FBBF24', marginTop: '12px', fontSize: '14px', maxWidth: '100%' }}>
                                    <strong>Important Notice:</strong> {warningPerformenceSchedule}
                                </p>
                            )}

                            {/* Performance Category */}
                            <RadioForm
                                errors={errors}
                                control={control}
                                title={t("register.PerformanceCategoryTitle")}
                                name='PerformanceCategory'
                                itemList={PerformanceCategory}
                                setValue={setValue}
                            />
                            {selectedCompetition === competitionList.Guitar && PerformanceCategoryValue === PerformanceCategory.Solo && (
                                <small className="note">*{t("register.noElectric")}. </small>
                            )}


                            {/* Instrument Category (Radio Buttons) */}
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
                                        <RadioGroup {...field}
                                            value={field.value || ""}
                                            row>
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
                            {selectedCompetition === competitionList.Harp && PerformanceCategoryValue === PerformanceCategory.Ensemble && (
                                <small className="note">*Solo Pedal with Ensemble/Piano, Lever Harp with Ensemble/
                                    Piano, Harp Ensemble. </small>
                            )}

                            {isTraditionalInstrumentSelected && (
                                <Controller
                                    name="traditionalInstrument"
                                    control={control}
                                    rules={isTraditionalInstrumentSelected ? {
                                        required: t("register.errors.required"),
                                        minLength: {
                                            value: 3,
                                            message: t("register.errors.nameMinLength")
                                        }
                                    } : {}}
                                    render={({ field, fieldState: { error } }) => (
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <TextField
                                                {...field}
                                                label={t("register.form.traditionalInstrument")}
                                                variant="standard"
                                                className="custom-textfield-full mb-4"
                                                error={!!error}
                                                helperText={error ? error.message : ""}
                                            />
                                        </div>
                                    )}
                                />
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
                                            {Object.entries(filteredAgeCategories).map(([key, label]) => (
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
                                                    key={"totalPerformerInput"}
                                                    suffix={t("register.form.personSuffix")} // Optional, for localization
                                                    min={minimalPerformer}
                                                    max={maximalPerformer}
                                                    onError={!!error}
                                                    defaultValue={minimalPerformer}
                                                    value={field.value} // <-- Controlled value
                                                    onChange={(value) => {
                                                        if (PerformanceCategoryValue !== PerformanceCategory.Solo) {
                                                            field.onChange(value);
                                                            handleChangePerformer(value);
                                                        }
                                                    }}
                                                    style={{ width: '100%' }}
                                                    controls={true}
                                                    keyboard={PerformanceCategoryValue === PerformanceCategory.Solo ? false : true}
                                                    onKeyDown={(e) => PerformanceCategoryValue === PerformanceCategory.Solo ? e.preventDefault() : null} // ⛔ prevent manual typing
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

                            {/* #region Student's Personal Information*/}
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
                                                                defaultValue={['+62']}
                                                                rules={{ required: t("register.errors.required") }}
                                                                render={({ field }) => (
                                                                    <Cascader
                                                                        {...field}
                                                                        value={field.value} // Explicitly bind the value
                                                                        onChange={field.onChange} // Make sure changes are captured
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
                                            {errors.performers?.[index]?.phoneNumber && (
                                                <p style={{ color: "red", marginTop: "4px" }}>
                                                    {errors.performers[index].phoneNumber.message}
                                                </p>
                                            )}
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
                                                    <TextField {...field}
                                                        // key={`${sameAddressValue ? field.value : `city-${index}`}`} // 👈 force rerender when value changes
                                                        // value={field.value ?? ''}
                                                        key={`${`city-${index}`}`}
                                                        InputLabelProps={{ shrink: Boolean(field.value) }} // 👈 Optional: forces label to float when value exists
                                                        label={t("register.form.city")}
                                                        variant="standard"
                                                        className="custom-textfield-full mb-4"
                                                        error={!!error}
                                                        helperText={error?.message} />
                                                )}
                                            />
                                        </Box>
                                        <Box className="col-6">
                                            <Controller
                                                name={`performers.${index}.country`}
                                                control={control}
                                                rules={{ required: t("register.errors.required") }}
                                                render={({ field, fieldState: { error } }) => (
                                                    <TextField {...field}
                                                        // key={`${sameAddressValue ? field.value : `country-${index}`}`} // 👈 force rerender when value changes
                                                        // value={field.value ?? ''}
                                                        key={`${`country-${index}`}`}
                                                        InputLabelProps={{ shrink: Boolean(field.value) }} // 👈 Optional: forces label to float when value exists
                                                        label={t("register.form.country")} variant="standard" className="custom-textfield-full mb-4" error={!!error} helperText={error?.message} />
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
                                                    <TextField {...field}
                                                        // key={`${sameAddressValue ? field.value : `province-${index}`}`} // 👈 force rerender when value changes
                                                        // value={field.value ?? ''}
                                                        key={`${`province-${index}`}`}
                                                        InputLabelProps={{ shrink: Boolean(field.value) }} // 👈 Optional: forces label to float when value exists
                                                        label={t("register.form.province")} variant="standard" className="custom-textfield-full mb-4" error={!!error} helperText={error?.message} />
                                                )}
                                            />
                                        </Box>
                                        <Box className="col-6">
                                            <Controller
                                                name={`performers.${index}.zipCode`}
                                                control={control}
                                                rules={{ required: t("register.errors.required") }}
                                                render={({ field, fieldState: { error } }) => (
                                                    <TextField {...field}
                                                        // key={`${sameAddressValue ? field.value : `zipCode-${index}`}`} // 👈 force rerender when value changes
                                                        // value={field.value ?? ''}
                                                        key={`${`zipCode-${index}`}`}
                                                        InputLabelProps={{ shrink: Boolean(field.value) }} // 👈 Optional: forces label to float when value exists
                                                        label={t("register.form.zipcode")} variant="standard" className="custom-textfield-full mb-4" error={!!error} helperText={error?.message} />
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
                                            <TextField {...field}
                                                // key={`${sameAddressValue ? field.value : `addressLine-${index}`}`} // 👈 force rerender when value changes
                                                // value={field.value ?? ''}
                                                key={`${`addressLine-${index}`}`}
                                                InputLabelProps={{ shrink: Boolean(field.value) }} // 👈 Optional: forces label to float when value exists
                                                label={t("register.form.address")} variant="standard" className="custom-textfield-full mb-4" error={!!error} helperText={error?.message} />
                                        )}
                                    />

                                    {index === 0 && (
                                        sameAddressCheckbox
                                    )}
                                </React.Fragment>
                            )
                            )}


                            {/* Payment Proof */}
                            <FileInput
                                name="paymentProof"
                                control={control}
                                label={t("register.form.paymentProof")}
                                smallNotes={<small className="note">{t("register.notes.paymentProof")}</small>}
                                extraSmallNotes={<small className="note">{t("register.notes.paymentProof2")}</small>}
                                rules={{ required: t("register.errors.required") }}
                                tooltipLabel={t("register.form.paymentProofTooltip")}
                                inputRef={paymentProofInputRef}
                                setValue={setValue}
                            />

                            {/* Remarks */}
                            <Box className="row">
                                <Box sx={{
                                    width: { xs: '83.33%', md: '33.33%' }, // 10/12 on mobile, 4/12 on desktop
                                    paddingRight: 0
                                }}>
                                    <Controller
                                        name="remark"
                                        control={control}
                                        rules={{ required: t("register.errors.required") }}
                                        render={({ field, fieldState: { error } }) => (
                                            <TextField
                                                {...field}
                                                sx={{ mt: 2 }}
                                                label={t("register.form.remark")}
                                                variant="standard"
                                                className="custom-textfield-full mb-4"
                                                error={!!error}
                                                helperText={error ? error.message : ""}
                                            />
                                        )}
                                    />
                                </Box>
                                <Box sx={{
                                    width: { xs: '16.67%', md: '66.67%' }, // 2/12 on mobile, 8/12 on desktop
                                    alignContent: "center",
                                    paddingLeft: 0
                                }}>
                                    <Tooltip title={
                                        <div>
                                            <p>{t("register.form.remarksNote")}</p>
                                        </div>
                                    }>
                                        <IconButton sx={{ color: "#e5cc92", fontSize: 16, mt: 1 }}>
                                            <QuestionCircleOutlined />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Box>

                            {/* Profile Picture Upload */}
                            <FileInput
                                name="profilePhoto"
                                control={control}
                                label={t("register.form.profilePhoto")}
                                smallNotes={<small className="note">{t("register.notes.uploadCombined")}</small>}
                                extraSmallNotes={<small className="note">{t("register.notes.profilePhoto")}</small>}
                                extraExtraSmallNotes={<small className="note">{t("register.notes.profilePhoto2")}</small>}
                                rules={{ required: t("register.errors.required") }}
                                tooltipLabel={t("register.form.profilePhotoTooltip")}
                                inputRef={profilePhotoInputRef}
                                setValue={setValue}
                            />

                            {/* Exam Certificate Upload */}
                            <FileInput
                                name="examCertificate"
                                control={control}
                                label={t("register.form.examCert")}
                                smallNotes={<small className="note">{t("register.notes.uploadCombined")}</small>}
                                extraSmallNotes={<small className="note">{t("register.notes.fileFormatExam")}</small>}
                                rules={{ required: t("register.errors.required") }}
                                tooltipLabel={t("register.form.examCertTooltip")}
                                inputRef={examInputRef}
                                setValue={setValue}
                            />

                            {/* Birth Certificate Upload */}
                            <FileInput
                                name="birthCertificate"
                                control={control}
                                label={t("register.form.birthCert")}
                                smallNotes={<small className="note">{t("register.notes.uploadCombined")}</small>}
                                extraSmallNotes={<small className="note">{t("register.notes.fileFormatBirthCert")}</small>}
                                rules={{ required: t("register.errors.required") }}
                                tooltipLabel={t("register.form.birthCertTooltip")}
                                inputRef={birthCertInputRef}
                                setValue={setValue}
                            />

                            {/* PDF Repertoire Upload */}
                            <FileInput
                                name="pdfRepertoire"
                                control={control}
                                label={t("register.form.repertoire")}
                                smallNotes={<small className="note">{t("register.notes.uploadCombined")}</small>}
                                extraSmallNotes={<small className="note">{t("register.notes.fileFormatRepertoire")}</small>}
                                rules={{ required: t("register.errors.required") }}
                                tooltipLabel={t("register.form.repertoireTooltip")}
                                inputRef={repertoireInputRef}
                                setValue={setValue}
                            />


                            {/* YouTube Link */}
                            <div className='d-flex' style={{ height: 86 }}>
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

                            <small className="note">
                                {videoExampleFormatText}
                            </small>

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
                                            </Box>
                                        </Box>
                                    )} */}
                                </Button>
                            )}
                            <LoadingOverlay open={isLoading} progress={progressLoading} />

                            <SubmissionConfirmationModal
                                open={isConfirmModalOpen}
                                onCancel={() => setIsConfirmModalOpen(false)}
                                onConfirm={handleSubmit(onSubmit, onError)}
                            />
                        </form>
                    </div>
                </div>
            </div >
            <YoutubeDurationFetcher
                videoId={extractVideoId(youtubeLinkValue)}
                onDurationFetched={(duration) => {
                    setYoutubeDuration(duration);
                }}
            />
            <WelcomeModalRegister
                open={isWarningModalOpen}
                handleClose={handleCloseWarning}
            />
        </div >

    )
}

export default Register;