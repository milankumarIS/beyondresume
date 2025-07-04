import React from "react";
import { Autocomplete, Box, TextField } from "@mui/material";

export default function FormAutocomplete({
  label,
  options,
  defaultValue,
  filtering,
  errors,
  valueProp,
  labelProp,
  primeryKey,
  setFilteredOption,
  setter,
  readonly,
  register,
  filteringFullOption,
  customLabelFormat,
  sx,
}: any) {
  const [selectedValue, setSelectedValue] = React.useState(
    options.find(
      (option: any) => option[primeryKey] === defaultValue[primeryKey]
    ) || null
  );

  React.useEffect(() => {
    setSelectedValue(
      options.find(
        (option: any) => option[primeryKey] === defaultValue[primeryKey]
      ) || null
    );
  }, [options]);

  return (
    <Box
      className="text_item"
      sx={{
        border: "none",
        marginTop: "15px",
      }}
    >
      {readonly ? (
        <TextField
          label={label}
          value={selectedValue ? selectedValue[labelProp] : ""}
          variant="outlined"
          fullWidth
          InputProps={{
            readOnly: true,
          }}
          error={!!errors[valueProp]}
          helperText={errors[valueProp] ? errors[valueProp].message : ""}
        />
      ) : (
        <Autocomplete
          options={options}
          getOptionLabel={(option: any) =>
            customLabelFormat
              ? `${option.communityName} - ${option.communityCode} - ${option.countryCode}`
              : option[labelProp] || ""
          }
          value={selectedValue}
          onChange={(event: any, newValue: any) => {
            if (newValue) {
              setSelectedValue(newValue);
              setter(valueProp, newValue[valueProp || primeryKey]);
              if (filtering) {
                setFilteredOption(
                  filteringFullOption.filter(
                    (o: any) => o.categoryId === newValue[primeryKey]
                  )
                );
              }
            }
          }}
          renderInput={(params) => (
            <TextField
              sx={sx}
              {...params}
              label={`Search & Select ${label}`}
              variant="outlined"
              fullWidth
              error={!!errors[valueProp]}
              helperText={errors[valueProp] ? errors[valueProp].message : ""}
              // {...register(valueProp)}
            />
          )}
          isOptionEqualToValue={(option, value) =>
            option[labelProp] === value[labelProp]
          }
        />
      )}
    </Box>
  );
}
