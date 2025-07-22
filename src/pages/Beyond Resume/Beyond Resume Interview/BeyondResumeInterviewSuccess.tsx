import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useHistory } from "react-router";
import {
  BeyondResumeButton,
  BeyondResumeButton2,
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
        background: "transparent",
        overflow: "hidden",
        mt:-4
      }}
    >
      {/* <BlobAnimation /> */}

      <img
        src="/assets/confetti.png"
        alt="Loading illustration"
        style={{ maxWidth: 100 }}
      />
      {/* <FontAwesomeIcon
        style={{ color: "#50bcf6", height: "104px" }}
        icon={faCheckCircle}
      ></FontAwesomeIcon> */}

      <Typography
        fontFamily={"montserrat-regular"}
        fontSize={"35px"}
        my={4}
        mb={2}
      >
        You’ve Completed Your Interview!
      </Typography>

      <Typography fontFamily={"montserrat-regular"} variant="body1" mb={4}>
        You’ve received your results. You can check them now or come back later{" "}
        <br /> from your dashboard.
      </Typography>

      <Box display={"flex"} gap={2} flexWrap={"wrap"}>
        <BeyondResumeButton
          onClick={() => history.push(`/beyond-resume-interview-list`)}
          variant="contained"
          color="primary"
        >
          Check Result
        </BeyondResumeButton>
        <BeyondResumeButton2
          onClick={() => history.push(`/beyond-resume-interviews`)}
          variant="contained"
          color="primary"
        >
          Return To Home
        </BeyondResumeButton2>
      </Box>
    </Box>
  );
};

export default BeyondResumeInterviewSuccess;
