import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
import get from "lodash/get";
import PropTypes from 'prop-types';
import React from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const RadioForm = (props) => {
    const { t } = useTranslation()
    const { errors, control, title, name, itemList, dataKey } = props

    return (
        <FormControl className='mt-4' component="fieldset" error={!!get(errors, dataKey)}>
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
                    <RadioGroup {...field} row>
                        {Object.entries(itemList).map(([key, label]) => (
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
                                label={t(`register.${dataKey}.${key}`)}
                                sx={{ color: "#e5cc92" }}
                            />
                        ))}
                    </RadioGroup>
                )}
            />
            {get(errors, dataKey) && (
                <p style={{ color: "red" }}>{get(errors, dataKey).message}</p>
            )}
        </FormControl>
    )
}

RadioForm.propTypes = {
    errors: PropTypes.object.isRequired,
    control: PropTypes.object.isRequired,
    title: PropTypes.string,
    name: PropTypes.string.isRequired,
    itemList: PropTypes.object.isRequired,
    dataKey: PropTypes.string.isRequired,
};

export default RadioForm;