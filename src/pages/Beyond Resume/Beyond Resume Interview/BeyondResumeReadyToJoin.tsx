import { Box, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router";
import Webcam from "react-webcam";
import {
  BeyondResumeButton,
  BlobAnimation
} from "../../../components/util/CommonStyle";
import BeyondResumeLoader from "../Beyond Resume Components/BeyondResumeLoader";
import AIProfileInterview from "../BeyondResumeProfile/AIProfileInterview";

const BeyondResumeReadyToJoin = () => {
  const location = useLocation();
  const { brJobId } = useParams<any>();
  const query = new URLSearchParams(location.search);
  const sessionType = query.get("sessionType");
  const history = useHistory();
  const [isManualRead, setIsManualRead] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const [isMicOn, setIsMicOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [micAccessible, setMicAccessible] = useState(true);
  const [micSilent, setMicSilent] = useState(false);

  const webcamRef = useRef(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<number | null>(null);

  const [cameraAccessible, setCameraAccessible] = useState(true);

useEffect(() => {
  const checkCameraAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      stream.getTracks().forEach((track) => track.stop());
      setCameraAccessible(true);
    } catch (err) {
      console.warn("Camera not accessible:", err);
      setCameraAccessible(false);
      // setIsVideoOn(false);
    }
  };

  checkCameraAccess();
}, []);


  useEffect(() => {
    const initMicDetection = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        mediaStreamRef.current = stream;
        const audioContext = new AudioContext();
        audioContextRef.current = audioContext;

        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 512;
        source.connect(analyser);
        analyserRef.current = analyser;

        const data = new Uint8Array(analyser.frequencyBinCount);
        let silentCounter = 0;

        intervalRef.current = window.setInterval(() => {
          analyser.getByteFrequencyData(data);
          const avg = data.reduce((a, b) => a + b, 0) / data.length;

          if (avg < 1) {
            silentCounter++;
            if (silentCounter >= 10) {
              setMicSilent(true);
              setIsMicOn(false);
            }
          } else {
            silentCounter = 0;
            setMicSilent(false);
          }
        }, 500);
      } catch (err) {
        console.warn("Mic not accessible:", err);
        setMicAccessible(false);
        setIsMicOn(false);
        setMicSilent(true);
      }
    };

    initMicDetection();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      audioContextRef.current?.close();
      analyserRef.current?.disconnect();
      mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const handleMicToggle = () => {
    if (!micAccessible || micSilent) {
      alert("Microphone is not accessible or is silent.");
      return;
    }
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
      : history.push(
          `/beyond-resume-jobInterviewSession/${brJobId}?${queryParams}`
        );
  };

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user",
  };

  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);

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

        minHeight: "calc(100vh - 58px)",
      }}
    >
      <BlobAnimation />

      <Box
        display="flex"
        gap={2}
        justifyContent={"space-around"}
        width={"100%"}
      >
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

          {/* <Box
            display="flex"
            justifyContent="center"
            gap={2}
            sx={{
              padding: "8px 10px",
              mt: "25px",
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
          </Box> */}

          {micSilent && (
            <Typography
              sx={{
                textAlign: "center",
                mt: 2,
                color: "#ff5252",
                fontSize: "14px",
              }}
            >
              Mic is not detecting sound. Please check your input device.
            </Typography>
          )}

          {!cameraAccessible && micSilent && (
  <Typography sx={{ mt: 2, color: "#ff5252", fontSize: "14px" }}>
    Camera is not accessible. Please check your device settings.
  </Typography>
)}


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
                  background: isManualRead
                    ? "linear-gradient(145deg, #0d0d0d, #2D3436)"
                    : "rgba(226, 227, 227, 0.18)",
                  color: isManualRead ? "white" : "#cdd5dd",
                  border: "solid 1px",
                }}
                onClick={
                  () => setModalOpen(true)
                  // handleJoin();
                }
                disabled={!isManualRead}
              >
                Proceed
              </BeyondResumeButton>
            </Box>
          </div>
        </Box>

        <Box>
          <Box
            sx={{
              width: "100%",
              maxWidth: 350,
              background: "linear-gradient(145deg, #0d0d0d, #2D3436)",
              p: 2,
              borderRadius: 2,
              height: "fit-content",
              maxHeight: 400,
              overflowY: "auto",
              position: "relative",
              // border: "solid 1px white",
            }}
          >
            <Typography variant="h6" sx={{ color: "#fff", mb: 1 }}>
              Instructions
            </Typography>

            <ul
              style={{
                paddingLeft: "1.2rem",
                color: "#d2dae2",
                fontSize: "14px",
                lineHeight: "1.6",
              }}
            >
              <li>
                Please ensure your <strong>camera</strong> and{" "}
                <strong>microphone</strong> are working.
              </li>
              <li>
                This is an <strong>AI-powered interview</strong>. You will hear
                questions through voice.
              </li>
              <li>
                Click on <strong>“Start Answering”</strong> when you're ready to
                respond to the question.
              </li>
              <li>
                Your answers will be recorded using{" "}
                <strong>speech recognition</strong>.
              </li>
              <li>
                You can skip a question if you're unsure. You cannot return to
                it later.
              </li>
              <li>
                After the last question, your interview will be automatically
                submitted or you can choose to <strong>submit early</strong>.
              </li>
              <li>
                Make sure to stay in a quiet place and avoid interruptions.
              </li>
            </ul>
          </Box>

          <Box
            display="flex"
            alignItems="center"
            gap={1}
            mt={2}
            position={"relative"}
          >
            <input
              disabled={micSilent}
              type="checkbox"
              id="manualRead"
              checked={isManualRead}
              onChange={(e) => setIsManualRead(e.target.checked)}
            />
            <label
              htmlFor="manualRead"
              style={{ fontSize: "14px", color: "#d2dae2" }}
            >
              I acknowledge the above instructions.
            </label>
          </Box>
        </Box>
      </Box>

      <BeyondResumeLoader open={open} progress={progress} />
      {modalOpen && (
        <AIProfileInterview
          open={modalOpen}
          onConversationComplete={() => {
            handleJoin();
          }}
        />
      )}
    </Box>
  );
};

export default BeyondResumeReadyToJoin;
