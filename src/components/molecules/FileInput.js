import {
    CloudUploadOutlined
} from '@ant-design/icons';
import { Button, InputLabel, Typography } from "@mui/material";
import React, { useMemo } from "react";
import { useController } from "react-hook-form";

const FileInput = ({ name, control, label, rules, labelUploaded }) => {
    const {
        field: { ref, onChange, ...inputProps },
        fieldState: { error },
        formState: { touchedFields },
    } = useController({
        name,
        control,
        rules,
    });

    // Watch the field value through the controller
    const file = inputProps.value;

    const fileName = useMemo(() => {
        if (file?.length > 0) {
            return file[0].name
        }
        return null
    }, [file])

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
                        color: "#EBBC64", // Gold label text
                        mb: 2,
                        "&.Mui-focused": { color: "#EBBC64 !important" }, // Keep label gold when focused
                    }}
                >
                    {label}
                </InputLabel>
                <div className='d-flex align-items-center'>
                    <Button
                        variant="outlined"
                        component="span"
                        sx={{
                            // backgroundColor: file ? "#4caf50" : "#EBBC64",
                            // color: "black",
                            // borderRadius: "20px",
                            padding: "10px 20px",
                            // textTransform: "none",
                            // fontWeight: "bold",
                            // display: "flex",
                            // alignItems: "center",
                            gap: "8px",
                            // "&:hover": { backgroundColor: file ? "#43a047" : "#d9a84d" },
                        }}
                    >
                        <>
                            <CloudUploadOutlined /> Input File
                        </>
                    </Button>
                    <InputLabel
                        sx={{
                            color: "#EBBC64",
                            ml: 2,
                        }}
                    >
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
