import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import * as React from "react";

interface YearPickerProps {
  label: string;
  setYear: (year: number | null) => void;
  value: string | null;
  secondaryFunction?: (date: Dayjs | null) => void;
}

export default function YearPicker({
  label,
  setYear,
  value,
  secondaryFunction,
}: YearPickerProps) {
  React.useEffect(() => {
    if (value) {
      const year = dayjs(value).isValid() ? dayjs(value).year() : null;
      setYear(year);
    }
  }, [value, setYear]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={["DatePicker"]} sx={{ m: 2 }}>
        <DatePicker
          label={label}
          views={["year"]}
          sx={{
            fontWeight: 600,
            width: "100%",
            boxShadow: "1px 1px 10px #00000028",
          }}
          format={"YYYY"}
          defaultValue={value ? dayjs(value) : null}
          onChange={(date: Dayjs | null) => {
            const year = date && date.isValid() ? date.year() : null;
            setYear(year);

            if (secondaryFunction) {
              secondaryFunction(date);
            }
          }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
