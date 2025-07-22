import { Autocomplete, Box, TextField } from "@mui/material";
import React from "react";

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

  const [inputValue, setInputValue] = React.useState<string>(
    typeof defaultValue === "string" ? defaultValue : getLabel(defaultValue)
  );

  const [selectedValue, setSelectedValue] = React.useState<any>(
    typeof defaultValue === "string" ? defaultValue : getLabel(defaultValue)
  );

  React.useEffect(() => {
    const label =
      typeof defaultValue === "string" ? defaultValue : getLabel(defaultValue);
    setSelectedValue(label);
    setInputValue(label);
  }, [defaultValue]);

  const handleOptionChange = (event: any, newValue: any) => {
    const finalValue =
      typeof newValue === "string" ? newValue : getLabel(newValue);

    setSelectedValue(finalValue);
    setter(finalValue);
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
          value={selectedValue}
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
          inputValue={inputValue}
          onInputChange={(e, newInputValue) => {
            setInputValue(newInputValue);
            setter(newInputValue); // 🔥 Optional: send live typed value
          }}
          onChange={handleOptionChange}
          isOptionEqualToValue={(option, value) => getLabel(option) === value}
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
        />
      )}
    </Box>
  );
}
