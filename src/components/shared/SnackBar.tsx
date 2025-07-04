import { Box, Snackbar } from "@mui/material";
import React from "react";

export const SnackBar = ({ title, isOpen, setIsOen }: any) => {
  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setIsOen(false);
  };

  return (
    <Box sx={{ width: 500 }}>
      <Snackbar
        open={isOpen}
        onClose={handleClose}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        message={title}
        sx={{
          marginTop: "8vh",
        }}
      />
    </Box>
  );
};
