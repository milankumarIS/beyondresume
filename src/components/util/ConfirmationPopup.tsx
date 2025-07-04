import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import React from "react";

interface ConfirmationPopupProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  actionText?: string;
  color?: string;
  icon?: React.ReactNode;
  warningMessage?: string;
  message?: string;
}

const ConfirmationPopup: React.FC<ConfirmationPopupProps> = ({
  open,
  onClose,
  onConfirm,
  actionText,
  color,
  icon: Icon,
  warningMessage = "This action can be undone.",
  message = `Are you sure you want to ${actionText} this item?`,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      {Icon}
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          gap: 2,
          mt: 2,
          textAlign: "center",
        }}
      >
        {message}
      </DialogTitle>
      <DialogContent
        sx={{
          maxWidth: "400px",
        }}
      >
        <Typography variant="body2" textAlign="center">
          {warningMessage}
        </Typography>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: "center",
          mb: 3,
        }}
      >
        <Button
          id="button"
          onClick={onClose}
          variant="contained"
          style={{
            background: "grey",
            color: "white",
            borderRadius: "999px",
            textTransform: "none",
          }}
        >
          No
        </Button>
        <Button
          id="button"
          onClick={onConfirm}
          variant="contained"
          style={{
            backgroundColor: color || "#1976d2",
            color: "#fff",
            borderRadius: "999px",

          }}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationPopup;
