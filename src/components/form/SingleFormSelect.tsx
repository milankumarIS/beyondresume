import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import color from "../../theme/color";

export const SingleFormSelect = ({ options, value, setValue, label }: any) => {
  const handleChange = (event: SelectChangeEvent) => {
    setValue(event.target.value as string);
  };

  return (
    <FormControl fullWidth sx={{ marginBottom: "1rem" }}>
      <InputLabel id={label}>{label}</InputLabel>
      <Select
        labelId={label}
        id={label}
        value={value}
        label={label}
        onChange={handleChange}
        sx={{ borderRadius: color.secondaryRadius }}
      >
        {options.map((item: any, index: any) => (
          <MenuItem key={index} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
