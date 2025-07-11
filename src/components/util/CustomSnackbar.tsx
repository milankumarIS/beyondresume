import { Snackbar, Alert as MuiAlert } from "@mui/material";
import React from "react";

export type SnackbarSeverity = "success" | "error" | "info" | "warning";

interface CustomSnackbarProps {
  open: boolean;
  message: string;
  severity?: SnackbarSeverity;
  autoHideDuration?: number;
  onClose: () => void;
}

const CustomSnackbar: React.FC<CustomSnackbarProps> = ({
  open,
  message,
  severity = "info",
  autoHideDuration = 4000,
  onClose,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <MuiAlert
        elevation={6}
        variant="filled"
        severity={severity}
        onClose={onClose}
      >
        {message}
      </MuiAlert>
    </Snackbar>
  );
};

export default CustomSnackbar;
