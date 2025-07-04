import {
  faMicrophone,
  faMicrophoneSlash,
  faVideo,
  faVideoSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, Box, Grid2, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import {
  BeyondResumeButton,
  ListeningAvatar,
} from "../../../components/util/CommonStyle";

interface ExamSessionVideoCamBoxProps {
  isSpeaking: boolean;
  isRecording: boolean;
  micStatus: boolean;
  videoStatus: boolean;
}

const ExamSessionVideoCamBox: React.FC<ExamSessionVideoCamBoxProps> = ({
  isSpeaking,
  isRecording,
  videoStatus,
  micStatus,
}) => {
  const [isMicOn, setIsMicOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);

  useEffect(() => {
    setIsMicOn(micStatus);
  }, [micStatus]);

  useEffect(() => {
    setIsVideoOn(videoStatus);
  }, [videoStatus]);

  const webcamRef = useRef<Webcam>(null);
  const [webcamSize, setWebcamSize] = useState({ width: 0, height: 0 });
  const handleMicToggle = () => {
    setIsMicOn((prev) => !prev);
  };

  const handleVideoToggle = () => {
    setIsVideoOn((prev) => !prev);
  };

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user",
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (webcamRef.current && webcamRef.current.video) {
        const videoElement = webcamRef.current.video as HTMLVideoElement;
        const { offsetWidth, offsetHeight } = videoElement;

        setWebcamSize({
          width: offsetWidth,
          height: offsetHeight,
        });
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);
  return (
    <Grid2
      size={{ xs: 12, md: 8 }}
      sx={{
        height: "maxHeight",
        background: "black",
        gap: "12px",
        borderRadius: "12px",
        p: 2,
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        pb: { xs: "70px", sm: "16px" },
      }}
    >
      <Box
        sx={{
          width: { xs: "100%", sm: "50%" },
        }}
      >
        <Box
          sx={{
            position: "relative",
            borderRadius: "12px",
            overflow: "hidden",
            background: "linear-gradient(145deg, #0d0d0d, #2D3436)",
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
                background: "linear-gradient(145deg, #0d0d0d, #2D3436)",
                position: "relative",
                width: webcamSize.width ? webcamSize.width : "100%",
                height: webcamSize.height ? webcamSize.height : "300px",
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

      <Box
        sx={{
          width: {xs:'100%',sm: "50%" , md: webcamSize.width ? webcamSize.width : "50%"},
          height: webcamSize.height ? webcamSize.height : "300px",
          flexGrow: 1,
          background: "linear-gradient(145deg, #0d0d0d, #2D3436)",
          borderRadius: "12px",
          position: "relative",
        }}
      >
        <FontAwesomeIcon
          style={{ position: "absolute", top: 10, right: 10 }}
          icon={isSpeaking ? faMicrophone : faMicrophoneSlash}
        />

        {isSpeaking ? (
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <ListeningAvatar>AI</ListeningAvatar>
          </Box>
        ) : (
          <Avatar
            style={{
              margin: "auto",
              padding: "6px",
              background: "#2D3436",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              boxShadow: "0px 0px 30px rgba(0, 0, 0, 0.17)",
            }}
          >
            AI
          </Avatar>
        )}

        {isRecording ? (
          <Typography
            sx={{
              position: "absolute",
              bottom: -40,
              left: 10,
            }}
            color="white"
          >
            {" "}
            Listening for answer...
          </Typography>
        ) : (
          <Typography
            sx={{
              position: "absolute",
              bottom: { xs: -50, sm: -60 },
              left: 10,
              fontSize: { xs: "12px", sm: "16px" },
            }}
            color="white"
          >
            {" "}
            Click "Start Answering" Button below to give your answer.
          </Typography>
        )}
      </Box>
    </Grid2>
  );
};

export default ExamSessionVideoCamBox;
