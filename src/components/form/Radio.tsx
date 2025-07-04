import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { useEffect } from "react";
import color from "../../theme/color";

export default function FormRadio({
  label,
  setValue,
  isModal,
  secondarySetValue,
  value,
  options,
}: any) {
  useEffect(() => {}, [value]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
    if (isModal) {
      secondarySetValue(true);
    }
  };

  return (
    <RadioGroup
      aria-labelledby={label}
      value={value}
      name={label}
      onChange={handleChange}
      sx={{ borderRadius: color.secondaryRadius }}
    >
      {options.map((item: any, index: any) => {
        return (
          <FormControlLabel
            sx={{ color: "#000" }}
            key={index}
            value={item.value}
            control={<Radio />}
            label={item.label}
          />
        );
      })}
    </RadioGroup>
  );
}
