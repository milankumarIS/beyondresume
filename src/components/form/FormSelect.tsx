import { faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useEffect, useState } from "react";
import "./Form.css";

export default function FormSelect({
  label,
  valueProp,
  errors,
  register,
  options,
  defaultValue = "",
  filteringFullOption,
  setFilteredOption,
  filtering,
  readonly,
  labelProp,
  primeryKey,
  px = 2,
  mt = 2,
  sx,
  withValidationClass = true,
}: any) {
  const [selectedOption, setSelectedOption] = useState(defaultValue);

  useEffect(() => {
    setSelectedOption(defaultValue || "");
  }, [defaultValue]);

  const handleOption = (property: any, value: any) => {
    setSelectedOption(value);

    if (filtering) {
      setFilteredOption([
        ...filteringFullOption.filter((o: any) => o.categoryId === value),
      ]);
    }
  };

  return (
    <Box sx={{ px }}>
      <FormControl
        sx={{ mt }}
        fullWidth
        variant="outlined"
        error={Boolean(errors[valueProp])}
        className={
          withValidationClass
            ? `text_item ${errors[valueProp] ? "mui-invalid" : "mui-valid"}`
            : ""
        }
      >
        <InputLabel
          shrink={Boolean(selectedOption)}
          sx={{
            fontSize: "11px !important",
            color: "#7f7f7f",
            textTransform: "uppercase",
            fontFamily: "Montserrat-regular",
            transform: "translate(14px, 14px)",

            "&.Mui-focused, &.MuiInputLabel-shrink": {
              transform: "translate(14px, 2px)",
            },
          }}
        >
          {label}
        </InputLabel>
        <Select
          label={label}
          value={selectedOption}
          onChange={(e) => handleOption(valueProp, e.target.value)}
          inputProps={{
            readOnly: readonly,
            ...register(valueProp),
          }}
          sx={{
            fontFamily: "Montserrat-regular", // 👈 applied to Select
            ...sx,
          }}
        >
          {options?.map((item: any, index: any) => {
            if (item.label) {
              return (
                <MenuItem
                  value={item.value}
                  key={index}
                  sx={{ fontFamily: "Montserrat-regular" }}
                >
                  {item.label}
                </MenuItem>
              );
            } else if (labelProp && item[labelProp]) {
              return (
                <MenuItem
                  value={item[primeryKey]}
                  key={index}
                  sx={{ fontFamily: "Montserrat-regular" }}
                >
                  {item[labelProp]}
                </MenuItem>
              );
            } else if (item.name) {
              return (
                <MenuItem
                  value={item.id}
                  key={index}
                  sx={{ fontFamily: "Montserrat-regular" }}
                >
                  {item.name}
                </MenuItem>
              );
            } else {
              return (
                <MenuItem
                  value={item}
                  key={index}
                  sx={{ fontFamily: "Montserrat-regular" }}
                >
                  {item}
                </MenuItem>
              );
            }
          })}
        </Select>

        {errors[valueProp] && (
          <FormHelperText
            sx={{
              display: "flex",
              alignItems: "center",
              color: "red !important",
            }}
            error
          >
            <FontAwesomeIcon
              icon={faXmarkCircle}
              style={{ marginRight: 4, fontSize: "18px" }}
            />
            {errors[valueProp].message}
          </FormHelperText>
        )}
      </FormControl>
    </Box>
  );
}
