import {
    Box,
    Checkbox,
    Chip,
    FormControl,
    InputLabel,
    ListItemText,
    MenuItem,
    Select,
} from "@mui/material";
import "./Form.css";
import { commonFormTextFieldSx } from "../util/CommonFunctions";

export default function MultipleSelectWithAutoComplete({
  label,
  valueProp,
  labelProp,
  options,
  selected = [],
  readonly,
  mt = 2,
  onChange,
}: any) {
  const handleOptionChange = (value: any) => {
    if (onChange) {
      onChange(value);
    }
  };

  const isChecked = (optionId: any) => {
    return selected.some(
      (item: any) =>
        (item.value || item.id || item[valueProp] || item) === optionId
    );
  };

  return (
    <Box >
      <FormControl sx={{ mt }} fullWidth variant="outlined">
        <InputLabel id="select-label">{label}</InputLabel>
        <Select
        sx={{...commonFormTextFieldSx}}
          labelId="select-label"
          label={label}
          id={label}
          multiple
          value={selected}
          onChange={(e) => handleOptionChange(e.target.value)}
          inputProps={{ readOnly: readonly }}
          renderValue={(selected: any[]) => (
            <Box sx={{ display: "flex", flexWrap: "wrap" }}>
              {selected.map((item: any, index: number) => (
                <Chip
                  key={index}
                  label={item.label || item.name || item[labelProp] || item}
                  sx={{ margin: 0.5 }}
                />
              ))}
            </Box>
          )}
        >
          {options.map((item: any, index: number) => {
            const optionValue = item.value || item.id || item;
            const labelValue =
              item.label || item.name || item[labelProp] || item;

            return (
              <MenuItem value={optionValue} key={index}>
                <Checkbox checked={isChecked(optionValue)} />
                <ListItemText primary={labelValue} />
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
}
