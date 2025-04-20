import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
import get from "lodash/get";
import PropTypes from 'prop-types';
import React from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const RadioForm = (props) => {
    const { t } = useTranslation()
    const { errors, control, title, name, itemList, disabled = false, setValue } = props

    return (
        <FormControl className='mt-4' component="fieldset" error={!!get(errors, name)}>
            <FormLabel
                className='fontSizeFormTitle'
                component="legend"
                sx={{
                    color: "#e5cc92",
                    "&.Mui-focused": { color: "#e5cc92 !important" },
                    "&:hover": { color: "#e5cc92 !important" },
                }}
            >
                {title}
            </FormLabel>

            <Controller
                name={name}
                control={control}
                rules={{ required: t("register.errors.required") }}
                render={({ field }) => (
                    <RadioGroup {...field}
                        onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value); // update form state
                            setValue('instrumentCategory', ''); // reset instrumentCategory
                        }}
                        row>
                        {Object.entries(itemList).map(([key, label]) => (
                            <FormControlLabel
                                id={`${key}-${label}`}
                                key={key}
                                value={key}
                                disabled={disabled}
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
                                label={t(`register.${name}.${key}`)}
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
            {get(errors, name) && (
                <p style={{ color: "red" }}>{get(errors, name).message}</p>
            )}
        </FormControl>
    )
}

RadioForm.propTypes = {
    errors: PropTypes.object.isRequired,
    control: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    itemList: PropTypes.object.isRequired
};

export default RadioForm;