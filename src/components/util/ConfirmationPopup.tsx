import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import React from "react";
import { BeyondResumeButton, BeyondResumeButton2 } from "./CommonStyle";

interface ConfirmationPopupProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  actionText?: string;
  color?: string;
  icon?: React.ReactNode;
  warningMessage?: string;
  message?: string;
  yesText?: string;
  noText?: string;
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
  yesText = "Yes",
  noText = "No",
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDialog-paper": {
          p: 2,
          px: 5,
          borderRadius: "32px",
        },
      }}
    >
      {Icon}
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          gap: 2,
          mt: 2,
          textAlign: "center",
          fontFamily: "custom-bold",
        }}
      >
        {message}
      </DialogTitle>
      <DialogContent
        sx={{
          maxWidth: "450px",
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
          gap:2
        }}
      >
        <BeyondResumeButton2 onClick={onClose} variant="contained">
          {noText}
        </BeyondResumeButton2>
        <BeyondResumeButton onClick={onConfirm} variant="contained">
          {yesText}
        </BeyondResumeButton>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationPopup;
