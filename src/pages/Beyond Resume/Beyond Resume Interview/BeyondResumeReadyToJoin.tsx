import {
  faMicrophone,
  faMicrophoneSlash,
  faRobot,
  faVideo,
  faVideoSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router";
import Webcam from "react-webcam";
import {
  BeyondResumeButton,
  BlobAnimation,
  BlobComponent,
} from "../../../components/util/CommonStyle";
import BeyondResumeLoader from "../Beyond Resume Components/BeyondResumeLoader";

const BeyondResumeReadyToJoin = () => {
  const location = useLocation();
  const { brJobId } = useParams<any>();
  const query = new URLSearchParams(location.search);
  const sessionType = query.get("sessionType");
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const webcamRef = useRef(null);
  const history = useHistory();

  const handleMicToggle = () => {
    setIsMicOn((prev) => !prev);
  };

  const handleVideoToggle = () => {
    setIsVideoOn((prev) => !prev);
  };

  const handleJoin = () => {
    const queryParams = new URLSearchParams({
      mic: isMicOn ? "true" : "false",
      video: isVideoOn ? "true" : "false",
      sessionType:
        sessionType === "practiceSession"
          ? "practiceSession"
          : "interviewSession",
    }).toString();

    sessionType === "practiceSession"
      ? history.push(
          `/beyond-resume-practiceInterviewSession/${brJobId}?${queryParams}`
        )
      : history.push(`/beyond-resume-jobInterviewSession/${brJobId}?${queryParams}`);
  };

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user",
  };
  const blobPaths = [
    "M33.6,-38.2C45.5,-30,58.4,-21.3,63,-9C67.6,3.2,64,19,55.2,29.7C46.4,40.3,32.6,45.8,18.7,50.6C4.8,55.4,-9.2,59.4,-21.8,56.4C-34.5,53.3,-45.9,43.2,-52.5,30.8C-59,18.4,-60.6,3.7,-59.1,-11.4C-57.6,-26.5,-53,-42.1,-42.6,-50.5C-32.3,-59,-16.1,-60.3,-2.6,-57.2C10.8,-54,21.7,-46.4,33.6,-38.2Z",
    "M56.2,-52.2C72.2,-40.3,84.1,-20.1,82,-2.1C79.9,16,63.9,32,47.9,47.8C32,63.6,16,79.3,-1.8,81.1C-19.6,82.9,-39.2,70.8,-55.4,55C-71.7,39.2,-84.7,19.6,-83.9,0.7C-83.2,-18.1,-68.7,-36.2,-52.5,-48.2C-36.2,-60.2,-18.1,-66,1,-67.1C20.1,-68.1,40.3,-64.2,56.2,-52.2Z",
  ];

  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setProgress((prev) => {
  //       if (prev >= 100) {
  //         clearInterval(interval);
  //         setOpen(false);
  //         return 100;
  //       }
  //       return prev + 5;
  //     });
  //   }, 300);
  // }, []);


  useEffect(() => {
    const unlisten = history.listen((location, action) => {
      if (action === "POP") {
        // Force page reload and redirect
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
      display="flex"
      sx={{
        alignItems: "center",
        backgroundSize: "110%",
        backgroundPosition: "center",
        backgroundRepeat: "repeat",
        gap: "2%",
        flexDirection: { xs: "column", lg: "column" },
        justifyContent: "center",

        background: "linear-gradient(145deg, #0d0d0d, #2D3436)",
        position: "relative",
        overflow: "hidden",
        color: "white",
      }}
    >
      <BlobAnimation />
      <BlobComponent
        right="-20px"
        bottom="-20px"
        width={300}
        height={250}
        path={blobPaths[0]}
        text="AI Powered Interview"
        textColor="#fff"
        fontSize={18}
        icon={
          <FontAwesomeIcon
            icon={faRobot}
            style={{ color: "#fff", fontSize: 28 }}
          />
        }
      />
      <Box display="flex" alignItems="center" flexDirection="column">
        <Box
          sx={{
            width: { xs: "80vw", sm: "50vw" },
            position: "relative",
            borderRadius: "12px",
            overflow: "hidden",
            background: "black",
            // minHeight: { xs: "25vh", sm: "55vh" },
          }}
        >
          {isVideoOn ? (
            <Webcam
              audio={isMicOn}
              ref={webcamRef}
              mirrored={true}
              videoConstraints={videoConstraints}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "fill",
                borderRadius: "12px",
              }}
            />
          ) : (
            <Box
              sx={{
                width: "100%",
                backgroundColor: "black",
                position: "relative",
                height: "300px",
              }}
            >
              <div
                style={{
                  position: "absolute" as "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <Typography variant="h6">Camera Off</Typography>
              </div>
            </Box>
          )}
        </Box>

        <Box
          display="flex"
          justifyContent="center"
          gap={2}
          sx={{
            padding: "8px 10px",

            mt: "35px",
            borderRadius: "26px",
          }}
        >
          <BeyondResumeButton
            onClick={handleMicToggle}
            style={{
              color: "white",
              background: "linear-gradient(145deg, #0d0d0d, #2D3436)",
              border: "solid 1px white",
            }}
          >
            <FontAwesomeIcon
              style={{ width: "20px", height: "20px" }}
              icon={isMicOn ? faMicrophone : faMicrophoneSlash}
            />
          </BeyondResumeButton>

          <BeyondResumeButton
            onClick={handleVideoToggle}
            style={{
              color: "white",
              background: "linear-gradient(145deg, #0d0d0d, #2D3436)",
              border: "solid 1px white",
            }}
          >
            <FontAwesomeIcon
              style={{ width: "20px", height: "20px" }}
              icon={isVideoOn ? faVideo : faVideoSlash}
            />
          </BeyondResumeButton>
        </Box>
      </Box>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <Box display="flex" gap={2} mb={1} mt={3}>
          <BeyondResumeButton
            sx={{
              background: "linear-gradient(145deg, #0d0d0d, #2D3436)",
              border: "solid 1px white",
            }}
            onClick={() => handleJoin()}
          >
            Start Interview
          </BeyondResumeButton>
        </Box>
      </div>
      <BeyondResumeLoader open={open} progress={progress} />
    </Box>
  );
};

export default BeyondResumeReadyToJoin;
