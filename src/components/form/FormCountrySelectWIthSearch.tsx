import React from 'react';
import { Autocomplete, Box, TextField } from '@mui/material';

const FormCountrySelectWithSearch = ({
  label,
  valueProp,
  errors,
  register,
  options,
  defaultValue,
  readonly,
  onSelectionChange
}: any) => {
  const [selectedValue, setSelectedValue] = React.useState(
    options.find((option: any) => option.name === defaultValue) || null
  );

  React.useEffect(() => {

    setSelectedValue(options.find((option: any) => option.name === defaultValue) || null);
  }, [defaultValue, options]);

  return (
    <Box className="text_item" sx={{border:'none',
      marginTop:'15px'
    }}>
      {readonly ? (
        <TextField
          label={label}
          value={selectedValue ? selectedValue.name : ''}
          variant="outlined"
          fullWidth
          InputProps={{
            readOnly: true,
          }}
          error={!!errors[valueProp]}
          helperText={errors[valueProp] ? errors[valueProp].message : ''}
        />
      ) : (
        <Autocomplete
          options={options}
          getOptionLabel={(option: any) => option.name}
          value={selectedValue} 
          onChange={(event: any, newValue: any) => {
            if (newValue) {
              setSelectedValue(newValue); 
              if(onSelectionChange)
              onSelectionChange(newValue.name); 
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label={`Search & select ${label}`}
              variant="outlined"
              fullWidth
              error={!!errors[valueProp]}
              helperText={errors[valueProp] ? errors[valueProp].message : ''}
              {...register(valueProp)}
            />
          )}
          isOptionEqualToValue={(option, value) => option.name === value.name}
        />
      )}
    </Box>
  );
};

export default FormCountrySelectWithSearch;
