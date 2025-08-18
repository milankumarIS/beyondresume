import React from "react";
import { Box, Typography } from "@mui/material";

interface LoaderProps {
  height?: string | number; // accepts "40vh" or 400
  message?: string; // optional custom message
}

const JobsLoader: React.FC<LoaderProps> = ({
  height = "40vh",
  message = "Fetching Jobs",
}) => {
  return (
    <Box
      sx={{
        minHeight: height,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <div className="newtons-cradle">
        <div className="newtons-cradle__dot"></div>
        <div className="newtons-cradle__dot"></div>
        <div className="newtons-cradle__dot"></div>
        <div className="newtons-cradle__dot"></div>
      </div>

      <Typography variant="h6" sx={{ mb: 2 }}>
        {message}
      </Typography>
    </Box>
  );
};

export default JobsLoader;
