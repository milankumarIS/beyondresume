import { useState } from "react";
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    Box,
    Chip,
    ListItemText,
    Checkbox,
} from "@mui/material";
import "./Form.css";

export default function MultipleSelectWithAutoComplete({
    label,
    valueProp,
    labelProp,
    errors,
    register,
    options,
    selected = [],
    readonly,
    px = 2,
    mt = 2,
    onChange,
}: any) {
    const handleOptionChange = (value: any) => {
        if (onChange) {
            onChange(value);
        }
    };
    const isChecked = (optionId) => {
        return selected.some((item: any) => (item.value || item.id || item[valueProp] || item) === optionId);
    };

    return (
        <Box sx={{ px }}>
            <FormControl
                sx={{ mt }}
                fullWidth
                variant="outlined"
                error={Boolean(errors[valueProp])}
                className={`text_item ${errors[valueProp] ? "mui-invalid" : "mui-valid"}`}
            >
                <InputLabel id="select-label">{label}</InputLabel>
                <Select
                    labelId="select-label"
                    label={label}
                    id={label}
                    multiple
                    value={selected}
                    onChange={(e) => handleOptionChange(e.target.value)}
                    inputProps={{
                        readOnly: readonly,
                        ...register(valueProp),
                    }}
                    renderValue={(selected: any[]) => (
                        <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                            {selected.map((item: any, index: any) => (
                                <Chip
                                    key={index}
                                    label={item.label || item.name || item[labelProp] || item}
                                    sx={{ margin: 0.5 }}
                                />
                            ))}
                        </Box>
                    )}
                >
                    {options.map((item: any, index: any) => (
                        <MenuItem value={item.value || item.id || item} key={index}>
                            <Checkbox key={index} checked={isChecked(item.value || item.id || item[valueProp] || item)} />
                            <ListItemText primary={item.label || item.name || item[labelProp] || item} />
                        </MenuItem>
                    ))}
                </Select>
                {errors[valueProp] && (
                    <FormHelperText>{errors[valueProp].message}</FormHelperText>
                )}
            </FormControl>
        </Box>
    );
}
