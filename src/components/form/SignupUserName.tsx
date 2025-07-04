import {
  faCheckCircle,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, FormControl, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { profileAvailability } from "../../services/services";

export default function FormUserName({
  label,
  valueProp,
  errors,
  register,
  watch,
  getValues,
  defaultValue,
  readonly,
  required,
  setError,
  clearErrors,
  multiline = false,
  rows = 4,
  px = 2,
  mt = 2,
  sx,
}: any) {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const value = event.target.value.trim();
    if (!value && required) {
      setError(valueProp, {
        type: "manual",
        message: `${label} is required.`,
      });
    } else {
      if (clearErrors) clearErrors(valueProp);
    }
  };

  const [validations, setValidations] = useState({
    minLength: false,
  });

  const handleUserNameChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    setValidations({
      minLength: value.length >= 8,
    });
  };

  const [hasTyped, setHasTyped] = useState(false);
  const [allValid, setAllValid] = useState(false);

  useEffect(() => {
    if (errors[valueProp]) {
      setHasTyped(true);
    }
    setAllValid(validations.minLength);
    if (watch) {
      watch(valueProp);
    }
  }, [errors, validations, valueProp]);

  useEffect(() => {
    if (getValues(valueProp) !== "" && getValues(valueProp) !== undefined) {
      profileAvailability({ [valueProp]: getValues(valueProp) }).then(
        (result: any) => {
          if (result?.data?.status === 404) {
            setIsAvailable(true);
          } else {
            setIsAvailable(false);
          }
        }
      );
    }
  }, [getValues(valueProp)]);

  return (
    <Box sx={{ px }}>
      <FormControl
        fullWidth
        sx={{ mt }}
        variant="outlined"
        error={!!errors[valueProp]}
        className={`text_item ${
          errors[valueProp] ? "mui-invalid" : "mui-valid"
        }`}
      >
        <TextField
          label={label}
          // defaultValue={defaultValue}
          disabled={!!readonly}
          {...register(valueProp)}
          error={!!errors[valueProp]}
          multiline={multiline}
          rows={multiline ? rows : 1}
          onBlur={handleBlur}
          onChange={(event) => {
            register(valueProp).onChange(event);
            handleUserNameChange(event);
            setHasTyped(true);
          }}
          sx={sx}
          value={watch ? watch(valueProp) : defaultValue}
          InputLabelProps={{
            shrink: watch ? !!watch(valueProp) : false,
          }}
        />
        {isAvailable !== null && (
          <Box mt={1} ml={1}>
            <Typography
              variant="body2"
              style={{ display: "flex", alignItems: "center" }}
              color={
                isAvailable && getValues(valueProp) !== "" ? "green" : "red"
              }
            >
              <FontAwesomeIcon
                icon={
                  isAvailable && getValues(valueProp) !== ""
                    ? faCheckCircle
                    : faXmarkCircle
                }
                style={{ marginRight: 4, fontSize: "18px" }}
              />

              {isAvailable === null || getValues(valueProp) === ""
                ? "Enter a username"
                : isAvailable
                ? "Username is available"
                : "Username is taken"}
            </Typography>
          </Box>
        )}

        {!allValid && (errors[valueProp] || hasTyped) && (
          <Box mt={1} ml={1}>
            <Typography
              style={{ display: "flex", alignItems: "center" }}
              variant="body2"
              color={validations.minLength ? "green" : "red"}
            >
              <FontAwesomeIcon
                icon={validations.minLength ? faCheckCircle : faXmarkCircle}
                style={{ marginRight: 4, fontSize: "18px" }}
              />
              Minimum 8 characters
            </Typography>
          </Box>
        )}
      </FormControl>
    </Box>
  );
}
