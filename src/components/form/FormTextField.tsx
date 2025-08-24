import {
  faCheckCircle,
  faEye,
  faEyeSlash,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import "./Form.css";

export default function FormTextField({
  label,
  valueProp,
  errors,
  register,
  fieldType,
  defaultValue,
  placeholder,
  readonly,
  required,
  setError,
  clearErrors,
  multiline = false,
  rows = 4,
  px = 2,
  mt = 2,
  sx,
  getValues,
  watch,
  withValidationClass = true,
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

  return (
    <Box sx={{ px}}>
      <FormControl
        fullWidth
        sx={{ mt }}
        variant="outlined"
        error={!!errors[valueProp]}
        className={
          withValidationClass
            ? `text_item ${errors[valueProp] ? "mui-invalid" : "mui-valid"}`
            : ""
        }
      >
        {fieldType === "password" ? (
          <PasswordField
            label={label}
            valueProp={valueProp}
            errors={errors}
            register={register}
            defaultValue={defaultValue}
            readonly={readonly}
            required={required}
            setError={setError}
            clearErrors={clearErrors}
            sx={sx}
            getValues={getValues}
            watch={watch}
          />
        ) : (
          <TextField
            placeholder={placeholder}
            label={label}
            type={fieldType || "text"}
            defaultValue={defaultValue}
            disabled={!!readonly}
            {...register(valueProp)}
            error={!!errors[valueProp]}
            multiline={multiline}
            required={required}
            rows={multiline ? rows : 1}
            onBlur={handleBlur}
            sx={{
              ...sx,
              // "& .MuiInputLabel-root": {
              //   color: "inherit",
              // },
              // "& .Mui-focused .MuiInputLabel-root": {
              //   color: "darkblue",
              // },

              
            }}
            InputLabelProps={{
              shrink: watch ? !!watch(valueProp) : undefined,
            }}
          />
        )}

        {errors[valueProp] &&
          errors[valueProp].message &&
          fieldType !== "password" && (
            <FormHelperText
              sx={{
                display: "flex",
                alignItems: "center",
                color: "red !important",
              }}
              error
            >
              <FontAwesomeIcon
                icon={faXmarkCircle}
                style={{ marginRight: 4, fontSize: "18px" }}
              />
              {errors[valueProp].message}
            </FormHelperText>
          )}
      </FormControl>
    </Box>
  );
}

function PasswordField({
  label,
  valueProp,
  errors,
  register,
  defaultValue,
  readonly,
  required,
  setError,
  clearErrors,
  getValues,
  watch,
  sx,
}: any) {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const value = event.target.value.trim();
    if (!value && required) {
      setError(valueProp, {
        type: "manual",
        message: `${label} is required.`,
      });
    } else {
      if (clearErrors) {
        clearErrors(valueProp);
      }
    }
  };

  // const [password, setPassword] = useState("");
  const [validations, setValidations] = useState({
    minLength: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  const handlePasswordChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    // setPassword(value);

    setValidations({
      minLength: value.length >= 8,
      uppercase: /[A-Z]/.test(value),
      lowercase: /[a-z]/.test(value),
      number: /\d/.test(value),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
    });
  };
  const [hasTyped, setHasTyped] = useState(false);
  const [allValid, setAllValid] = useState(false);

  useEffect(() => {
    if (errors[valueProp]) {
      setHasTyped(true);
    }
    setAllValid(
      validations.minLength &&
        validations.specialChar &&
        validations.lowercase &&
        validations.number &&
        validations.uppercase
    );
    if (watch) {
      watch(valueProp);
    }
  }, [errors, validations, valueProp]);

  return (
    <>
      <TextField
        label={label}
        type={showPassword ? "text" : "password"}
        // defaultValue={defaultValue}
        disabled={!!readonly}
        {...register(valueProp)}
        error={!!errors[valueProp]}
        onBlur={handleBlur}
        onChange={(event) => {
          register(valueProp).onChange(event);
          handlePasswordChange(event);
          setHasTyped(true);
        }}
        sx={sx}
        value={watch ? watch(valueProp) : defaultValue}
        InputLabelProps={{
          shrink: watch ? !!watch(valueProp) : false,
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                edge="end"
              >
                {showPassword ? (
                  <FontAwesomeIcon style={{ fontSize: "24px" }} icon={faEye} />
                ) : (
                  <FontAwesomeIcon
                    style={{ fontSize: "24px" }}
                    icon={faEyeSlash}
                  />
                )}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {!allValid && (errors[valueProp] || hasTyped) && (
        <Box mt={1} ml={1}>
          <Typography
            variant="body2"
            color={validations.minLength ? "green" : "red"}
            style={{ display: "flex", alignItems: "center" }}
          >
            <FontAwesomeIcon
              icon={validations.minLength ? faCheckCircle : faXmarkCircle}
              style={{ marginRight: 4, marginBottom: "2px", fontSize: "18px" }}
            />
            Minimum 8 characters
          </Typography>
          <Typography
            variant="body2"
            color={validations.uppercase ? "green" : "red"}
            style={{ display: "flex", alignItems: "center" }}
          >
            <FontAwesomeIcon
              icon={validations.uppercase ? faCheckCircle : faXmarkCircle}
              style={{ marginRight: 4, marginBottom: "2px", fontSize: "18px" }}
            />
            One uppercase letter
          </Typography>
          <Typography
            variant="body2"
            color={validations.lowercase ? "green" : "red"}
            style={{ display: "flex", alignItems: "center" }}
          >
            <FontAwesomeIcon
              icon={validations.lowercase ? faCheckCircle : faXmarkCircle}
              style={{ marginRight: 4, marginBottom: "2px", fontSize: "18px" }}
            />
            One lowercase letter
          </Typography>
          <Typography
            variant="body2"
            color={validations.number ? "green" : "red"}
            style={{ display: "flex", alignItems: "center" }}
          >
            <FontAwesomeIcon
              icon={validations.number ? faCheckCircle : faXmarkCircle}
              style={{ marginRight: 4, marginBottom: "2px", fontSize: "18px" }}
            />
            One number
          </Typography>
          <Typography
            variant="body2"
            color={validations.specialChar ? "green" : "red"}
            style={{ display: "flex", alignItems: "center" }}
          >
            <FontAwesomeIcon
              icon={validations.specialChar ? faCheckCircle : faXmarkCircle}
              style={{ marginRight: 4, marginBottom: "2px", fontSize: "18px" }}
            />
            One special character
          </Typography>
        </Box>
      )}
    </>
  );
}
