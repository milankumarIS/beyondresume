import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useHistory } from "react-router";
import {
  BeyondResumeButton,
  BlobAnimation,
} from "../../../components/util/CommonStyle";

const BeyondResumeInterviewSuccess: React.FC = () => {
  const history = useHistory();
  useEffect(() => {
    const unlisten = history.listen((location, action) => {
      if (action === "POP") {
        window.location.href = "/beyond-resume-interviews";
      }
    });

    return () => {
      unlisten();
    };
  }, [history]);
  return (
    <Box
      className="full-screen-div"
      sx={{
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        background: "linear-gradient(145deg, #0d0d0d, #2D3436)",
        color: "white",
        overflow: "hidden",
      }}
    >
      <BlobAnimation />

      <FontAwesomeIcon
        style={{ color: "#50bcf6", height: "104px" }}
        icon={faCheckCircle}
      ></FontAwesomeIcon>

      <Typography variant="h5" my={4} mb={2}>
        Interview Completed Successfully
      </Typography>

      <Typography variant="body1" mb={4}>
        Thank you for your time during the interview.
      </Typography>

      <Box display={"flex"} gap={2} flexWrap={'wrap'}>
        <BeyondResumeButton
          onClick={() => history.push(`/beyond-resume-interview-list`)}
          variant="contained"
          color="primary"
          sx={{ px: 4, py: 1.5, borderRadius: 2, m: 0 }}
        >
          Check Result
        </BeyondResumeButton>
        <BeyondResumeButton
          onClick={() => history.push(`/beyond-resume-interviews`)}
          variant="contained"
          color="primary"
          sx={{ px: 4, py: 1.5, borderRadius: 2, m: 0 }}
        >
          Back to Home
        </BeyondResumeButton>
      </Box>
    </Box>
  );
};

export default BeyondResumeInterviewSuccess;
