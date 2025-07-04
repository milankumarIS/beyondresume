import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import React from "react";

interface CustomDatePickerProps {
  label?: string;
  value: Dayjs | null;
  onChange: (date: Dayjs | null) => void;
  minDate?: Dayjs;
  maxDate?: Dayjs;
  disableFuture?: boolean;
  disablePast?: boolean;
}

const makeStyles = {
  border:'solid 2px #0a5c6b',
  borderRadius:'8px',
  width:'180px',
  "& .MuiInputBase-root": {
    "& fieldset": {
      borderWidth: "0px",
    },
    "&.Mui-focused fieldset": {
      borderWidth: "0px",
    },
  },
};

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  label = "Select Date",
  value,
  onChange,
  minDate,
  maxDate,
  disableFuture = false,
  disablePast = false,
}) => {
  const handleDateChange = (newDate: Dayjs | null) => {
    if (newDate) {
      const formattedDate = newDate.format("D MMM YYYY");
      console.log(`Selected Date: ${formattedDate}`);
    }
    onChange(newDate);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        sx={{ ...makeStyles }}
        value={value}
        onChange={handleDateChange}
        minDate={minDate}
        maxDate={maxDate}
        disableFuture={disableFuture}
        disablePast={disablePast}
        format="D MMM YYYY"
      
      />
    </LocalizationProvider>
  );
};

export default CustomDatePicker;
