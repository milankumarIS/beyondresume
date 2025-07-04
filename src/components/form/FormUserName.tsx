import {
  faCheckCircle,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, FormControl, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import "./Form.css";
export default function FormUserName({
  label,
  valueProp,
  errors,
  register,
  fieldType,
  defaultValue,
  readonly,
  required,
  setError,
  clearErrors,
  multiline = false,
  rows = 4,
  px = 2,
  mt = 2,
}: any) {
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

  const [username, setUsername] = useState("");

  const [validations, setValidations] = useState({
    minLength: false,
    // number: false,
  });

  const handleUserNameChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    setUsername(value);

    setValidations({
      minLength: value.length >= 8,
      // number: /\d/.test(value),
    });
  };
  const [hasTyped, setHasTyped] = useState(false);
  const [allValid, setAllValid] = useState(false);

  useEffect(() => {
    if (errors[valueProp]) {
      setHasTyped(true);
    }
    setAllValid(validations.minLength);
  }, [errors, validations, valueProp]);

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
          //   type={fieldType || "text"}
          defaultValue={defaultValue}
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
        />

        {/* {errors[valueProp] && errors[valueProp].message && (
          <FormHelperText error>{errors[valueProp].message}</FormHelperText>
        )} */}

        {!allValid && (errors[valueProp] || hasTyped) && (
          <Box mt={1} ml={1}>
            <Typography
              variant="body2"
              color={validations.minLength ? "green" : "red"}
              style={{ display: "flex", alignItems: "center" }}
            >
              <FontAwesomeIcon
                icon={validations.minLength ? faCheckCircle : faXmarkCircle}
                style={{
                  marginRight: 4,
                  marginBottom: "2px",
                  fontSize: "18px",
                }}
              />
              Minimum 8 characters
            </Typography>
          </Box>
        )}
      </FormControl>
    </Box>
  );
}
