import React from "react";
import { Modal, Box, Typography, LinearProgress } from "@mui/material";

const BeyondResumeLoader = ({
  open,
  progress,
}: {
  open: boolean;
  progress?: number;
}) => {
  return (
    <Modal open={open}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        bgcolor="white"
        flexDirection="column"
      >
         <img
          src="/assets/Vector Smart Object3.png" 
          alt="Loading illustration"
          style={{ maxWidth: 250, marginBottom: 30 }}
        />

        <div className="newtons-cradle">
          <div className="newtons-cradle__dot"></div>
          <div className="newtons-cradle__dot"></div>
          <div className="newtons-cradle__dot"></div>
          <div className="newtons-cradle__dot"></div>
        </div>

        <Typography variant="h6" sx={{ mb: 2, color: "black" }}>
          Processing your Interview
        </Typography>

        <Box width="60%" mb={2}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              borderRadius: "44px",
              "& .MuiLinearProgress-bar": {
                backgroundColor: "#50bcf6",
              },
              height: "6px",
            }}
          />
        </Box>

        <Typography variant="subtitle1" color="textSecondary">
          {progress}% Completed
        </Typography>
      </Box>
    </Modal>
  );
};

export default BeyondResumeLoader;
