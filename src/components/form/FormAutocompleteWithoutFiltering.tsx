import React from "react";
import { Autocomplete, Box, TextField } from "@mui/material";

export default function FormAutocomplete2({
  label,
  options,
  defaultValue,
  labelProp,
  primeryKey,
  readonly,
  setter,
  px = 0,
  mt = 2,
  sx,
  search = "Search & Select",
}: any) {
  const getLabel = (option: any) =>
    typeof option === "string" ? option : option?.[labelProp] ?? "";

  const getPrimaryKey = (option: any) =>
    typeof option === "string" ? option : option?.[primeryKey] ?? option;

  const [selectedValue, setSelectedValue] = React.useState<any>(
    options.find((option: any) =>
      primeryKey
        ? getPrimaryKey(option) === getPrimaryKey(defaultValue)
        : option === defaultValue
    ) || defaultValue || null
  );

  React.useEffect(() => {
    setSelectedValue(
      options.find((option: any) =>
        primeryKey
          ? getPrimaryKey(option) === getPrimaryKey(defaultValue)
          : option === defaultValue
      ) || defaultValue || null
    );
  }, [options, defaultValue, primeryKey]);

  const handleOptionChange = (event: any, newValue: any) => {
    setSelectedValue(newValue);
    setter(newValue);
  };

  return (
    <Box
      sx={{
        border: "none",
        px: px,
        mt: mt,
      }}
    >
      {readonly ? (
        <TextField
          label={label}
          value={
            typeof selectedValue === "string"
              ? selectedValue
              : selectedValue?.[labelProp] || ""
          }
          variant="outlined"
          fullWidth
          InputProps={{
            readOnly: true,
          }}
        />
      ) : (
        <Autocomplete
          freeSolo
          options={options}
          getOptionLabel={(option: any) => getLabel(option)}
          value={selectedValue}
          onChange={handleOptionChange}
          renderInput={(params) => (
            <TextField
              sx={sx}
              style={{
                backgroundColor: "#f5f5f5",
              }}
              {...params}
              placeholder={`${search} ${label}`}
              variant="outlined"
              fullWidth
              label={label}
            />
          )}
          isOptionEqualToValue={(option, value) =>
            primeryKey
              ? getPrimaryKey(option) === getPrimaryKey(value)
              : option === value
          }
        />
      )}
    </Box>
  );
}
