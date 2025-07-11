// hooks/useSnackbar.ts
import { useState, useCallback } from "react";
import { SnackbarSeverity } from "../util/CustomSnackbar";

export const useNewSnackbar = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<SnackbarSeverity>("info");

  const showSnackbar = useCallback(
    (msg: string, type: SnackbarSeverity = "info") => {
      setMessage(msg);
      setSeverity(type);
      setOpen(true);
    },
    []
  );

  const handleClose = useCallback(() => setOpen(false), []);

  return {
    snackbarProps: {
      open,
      message,
      severity,
      onClose: handleClose,
    },
    showSnackbar,
  };
};
