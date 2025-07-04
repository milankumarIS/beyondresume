import { Autocomplete, Box, FormControl, TextField } from "@mui/material";
import React from "react";

const SelectWithSearch = ({
  label,
  valueProp,
  errors,
  register,
  options,
  defaultValue,
  readonly,
  onSelectionChange,
  filteringFullOption = [],
  setFilteredOption = () => {},
  filtering = false,
}: any) => {
  const [selectedValue, setSelectedValue] = React.useState(
    options.find((option: any) => option.name === defaultValue) || null
  );

  React.useEffect(() => {
    if (filtering) {
      setFilteredOption(filteringFullOption);
    }
  }, [
    defaultValue,
    options,
    filteringFullOption,
    filtering,
    setFilteredOption,
  ]);

  const handleOptionChange = (event: any, newValue: any) => {
    setSelectedValue(newValue);
    onSelectionChange(newValue ? newValue.name : null);

    if (filtering && filteringFullOption && newValue) {
      const filteredOptions = filteringFullOption.filter(
        (option: any) => option.categoryId === newValue.categoryId
      );
      setFilteredOption(filteredOptions);
    }
  };

  return (
    <Box sx={{ px: 2 }}>
      <FormControl
        sx={{ mt: 2, boxShadow: "1px 1px 10px #00000028" }}
        fullWidth
        variant="outlined"
      >
        {readonly ? (
          <TextField
            label={label}
            value={selectedValue ? selectedValue.name : ""}
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
            getOptionLabel={(option: any) => option.name}
            value={selectedValue}
            onChange={handleOptionChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label={`Search & Select ${label}`}
                variant="outlined"
                fullWidth
                error={!!errors[valueProp]}
                helperText={errors[valueProp] ? errors[valueProp].message : ""}
                {...register(valueProp, { required: "This field is required" })}
              />
            )}
            isOptionEqualToValue={(option, value) => option.name === value.name}
          />
        )}
      </FormControl>
    </Box>
  );
};

export default SelectWithSearch;
