import { Box } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import * as React from "react";
import "./Form.css";

const makeStyles = {
  "& .MuiInputBase-root": {
    "& fieldset": {
      borderWidth: "0px",
    },
    "&.Mui-focused fieldset": {
      borderWidth: "0px",
    },
  },
};

export default function BasicDatePicker({
  label,
  setDate,
  minimum,
  value,
  scondaryFunction,
  allowedDays,
  sx,
  marginTop = 2,
}: any) {
  React.useEffect(() => {
    setDate(value ? dayjs(value) : null);
  }, []);

  const isDayAllowed = (date: any) => {
    if (!date || !allowedDays) return true;
    const dayName = date.format("dddd");
    return allowedDays.includes(dayName);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={["DatePicker"]}
        sx={{
          marginInline: 2,
          marginTop,
          borderRadius: "44px",
          overflow:'hidden',
          // boxShadow: "1px 1px 10px #00000028",
          ...sx,
           paddingTop:'0px'  
        }}
      >
        <Box width={'100%'}>
          {minimum ? (
            <DatePicker
              label={label}
              sx={{ fontWeight: 600, width: "100%", ...makeStyles,}}
              minDate={minimum ? dayjs(minimum) : dayjs()}
              defaultValue={value ? dayjs(value) : null}
              shouldDisableDate={(date: any) => !isDayAllowed(date)}
              onChange={(date: any) => {
                setDate(date?.isValid ? date : "");
                if (scondaryFunction) {
                  scondaryFunction(date);
                }
              }}
              format={"DD/MM/YYYY"}
            />
          ) : (
            <DatePicker
              label={label}
              sx={{ fontWeight: 600, width: "100%", ...makeStyles}}
              defaultValue={value ? dayjs(value) : null}
              shouldDisableDate={(date: any) => !isDayAllowed(date)}
              onChange={(date: any) => {
                setDate(date?.isValid ? date : "");
                if (scondaryFunction) {
                  scondaryFunction(date);
                }
              }}
              format={"DD/MM/YYYY"}
            />
          )}
        </Box>
      </DemoContainer>
    </LocalizationProvider>
  );
}
