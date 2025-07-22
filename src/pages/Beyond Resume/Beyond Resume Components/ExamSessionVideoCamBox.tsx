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
  const [micAccessible, setMicAccessible] = useState(true);
  const [micSilent, setMicSilent] = useState(false);

  const webcamRef = useRef<Webcam>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const checkIntervalRef = useRef<number | null>(null);

  const [webcamSize, setWebcamSize] = useState({ width: 0, height: 0 });

  useEffect(() => setIsMicOn(micStatus), [micStatus]);
  useEffect(() => setIsVideoOn(videoStatus), [videoStatus]);

  useEffect(() => {
    const initMicCheck = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;
        const audioContext = new AudioContext();
        audioContextRef.current = audioContext;

        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 512;
        analyserRef.current = analyser;

        source.connect(analyser);

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        let silentCount = 0;

        checkIntervalRef.current = window.setInterval(() => {
          if (!analyserRef.current) return;
          analyserRef.current.getByteFrequencyData(dataArray);
          const volume = dataArray.reduce((a, b) => a + b, 0) / bufferLength;

          if (volume < 1) {
            silentCount++;
            if (silentCount >= 10) {
              setMicSilent(true);
              setIsMicOn(false);
            }
          } else {
            silentCount = 0;
            setMicSilent(false);
          }
        }, 500);

        setMicAccessible(true);
      } catch (err) {
        console.error("Mic access failed:", err);
        setMicAccessible(false);
        setIsMicOn(false);
        setMicSilent(true);
      }
    };

    initMicCheck();

    return () => {
      if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
      analyserRef.current?.disconnect();
      audioContextRef.current?.close();
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const handleMicToggle = () => {
    if (!micAccessible || micSilent) {
      alert("Microphone is not working or is muted/disabled.");
      return;
    }
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
      <Box sx={{ width: { xs: "100%", sm: "50%" } }}>
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
                width: webcamSize.width || "100%",
                height: webcamSize.height || "300px",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                Camera Off
              </Typography>
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

        {micSilent && (
          <Typography
            sx={{ textAlign: "center", mt: 2, color: "#ff5252", fontSize: "14px" }}
          >
            Mic is not detecting any sound. Please check if it's muted or disabled.
          </Typography>
        )}
      </Box>

      <Box
        sx={{
          width: { xs: "100%", sm: "50%", md: webcamSize.width || "50%" },
          height: webcamSize.height || "300px",
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

        <Typography
          sx={{
            position: "absolute",
            bottom: { xs: -50, sm: -60 },
            left: 10,
            fontSize: { xs: "12px", sm: "16px" },
          }}
          color="white"
        >
          {isRecording
            ? "Listening for answer..."
            : 'Click "Start Answering" Button below to give your answer.'}
        </Typography>
      </Box>
    </Grid2>
  );
};

export default ExamSessionVideoCamBox;
