import {
    CloudUploadOutlined,
    QuestionCircleOutlined
} from '@ant-design/icons';
import { Box, Button, IconButton, InputLabel, Tooltip, Typography } from "@mui/material";
import { useMemo } from "react";
import { useController } from "react-hook-form";

const FileInput = ({ name, control, label, rules = {}, tooltipLabel, smallNotes = null, extraSmallNotes = null, extraExtraSmallNotes = null, inputRef, setValue }) => {
    // Custom validation function to check for spaces in the file name.
    const customValidate = (value) => {
        if (value && value.length > 0) {
            const file = value[0]; // define file here
            const fileName = value[0].name;
            // Check if file name contains any whitespace characters.
            if (/\s/.test(fileName)) {
                return "File name should not contain spaces or &. Use underscores (_) instead (e.g. JohnDoe_AlexanderGrahamaBell).";
            }

            // Check MIME type
            if (file.type !== "application/pdf") {
                return "Only PDF files are allowed.";
            }

            // Optional: check file extension too (extra safety)
            if (!fileName.toLowerCase().endsWith(".pdf")) {
                return "File must have a .pdf extension.";
            }
        }
        return true;
    };

    // Merge parent's rules with custom validation.
    const mergedRules = {
        ...rules,
        required: rules.required || "Upload required",
        validate: (value) => {
            if (rules.validate) {
                const result = rules.validate(value);
                if (result !== true) return result;
            }
            return customValidate(value);
        },
    };

    const {
        field: { ref, onChange, ...inputProps },
        fieldState: { error },
    } = useController({
        name,
        control,
        rules: mergedRules,
    });

    const file = inputProps.value;
    const fileName = useMemo(() => {
        if (file?.length > 0) {
            return file[0].name;
        }
        return null;
    }, [file]);

    return (
        <Box
            id={`file-input-wrapper-${name}`}
            className='col-md-12 col-sm-12'>
            <input
                id={name}
                name={name}
                type="file"
                accept="application/pdf"
                // ref={ref}
                ref={(e) => {
                    ref(e); // react-hook-form ref
                    inputRef.current = e; // your manual ref
                }}
                onChange={(e) => {
                    const files = e.target.files;
                    if (!files || files.length === 0) {
                        // user clicked "cancel"
                        setValue(name, null, { shouldValidate: true }); // ✅ ensure RHF state is updated
                    } else {
                        onChange(files);
                    }
                }}
                style={{ display: "none" }}
            />
            <label htmlFor={name} style={{ display: "block", marginTop: "25px", width: "fit-content" }}>
                <InputLabel
                    sx={{
                        color: "#e5cc92",
                        mb: 2,
                        "&.Mui-focused": { color: "#e5cc92 !important" },
                    }}
                >
                    <div className='d-flex align-items-center' style={{ height: '16px' }}>
                        {label}
                        <div>
                            <Tooltip
                                title={
                                    <div>
                                        <p>{tooltipLabel}</p>
                                    </div>
                                }
                            >
                                <IconButton sx={{ color: "#e5cc92", fontSize: 16 }}>
                                    <QuestionCircleOutlined />
                                </IconButton>
                            </Tooltip>
                        </div>
                    </div>
                    <div className='d-flex flex-column'>
                        {smallNotes}
                        {extraExtraSmallNotes}
                        {extraSmallNotes}
                    </div>
                </InputLabel>
                <div className='d-flex align-items-center'>
                    <Button
                        variant="outlined"
                        component="span"
                        sx={{
                            padding: "10px 20px",
                            gap: "8px",
                        }}
                    >
                        <CloudUploadOutlined /> Input File
                    </Button>
                    <InputLabel sx={{ color: "#e5cc92", ml: 2 }}>
                        {fileName}
                    </InputLabel>
                </div>
            </label>
            {error && (
                <Typography color="red" variant="body2">
                    {error.message}
                </Typography>
            )}
        </Box>
    );
};

export default FileInput;
