import {
    CloudUploadOutlined,
    QuestionCircleOutlined
} from '@ant-design/icons';
import { Button, IconButton, InputLabel, Tooltip, Typography } from "@mui/material";
import React, { useMemo } from "react";
import { useController } from "react-hook-form";

const FileInput = ({ name, control, label, rules = {}, tooltipLabel }) => {
    // Custom validation function to check for spaces in the file name.
    const customValidate = (value) => {
        if (value && value.length > 0) {
            const fileName = value[0].name;
            // Check if file name contains any whitespace characters.
            if (/\s/.test(fileName)) {
                return "File name should not contain spaces or &. Use underscores (_) instead (e.g. JohnDoe_AlexanderGrahamaBell).";
            }
        }
        return true;
    };

    // Merge parent's rules with custom validation.
    const mergedRules = {
        ...rules,
        required: rules.required || "Upload required",
        validate: (value) => {
            console.log("validation")
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
        <div className='col-md-6 col-sm-12'>
            <input
                id={name}
                type="file"
                accept="application/pdf"
                ref={ref}
                onChange={(e) => onChange(e.target.files)}
                style={{ display: "none" }}
            />
            <label htmlFor={name} style={{ display: "block", marginTop: "15px", width: "fit-content" }}>
                <InputLabel
                    sx={{
                        color: "#e5cc92",
                        mb: 2,
                        "&.Mui-focused": { color: "#e5cc92 !important" },
                    }}
                >
                    <div className='d-flex align-items-center'>
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
        </div>
    );
};

export default FileInput;
