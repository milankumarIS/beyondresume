import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router";
import Webcam from "react-webcam";
import GradientText, {
  BeyondResumeButton,
  BeyondResumeButton2,
} from "../../../components/util/CommonStyle";
import { useUserData } from "../../../components/util/UserDataContext";
import BeyondResumeLoader from "../Beyond Resume Components/BeyondResumeLoader";
import { useProctoringSuite } from "../Beyond Resume Components/useProctoringSuite";
import AIProfileInterview from "../BeyondResumeProfile/AIProfileInterview";

const BeyondResumeReadyToJoin = () => {
  const location = useLocation();
  const { brJobId } = useParams<any>();
  const query = new URLSearchParams(location.search);
  const noOfQuestions = location?.state?.noOfQuestions;
  const duration = location?.state?.duration;
  const jobTitle = location?.state?.jobTitle;
  const companyName = location?.state?.companyName;
  const examMode = location?.state?.examMode;
  const { userData } = useUserData();

  const sessionType = query.get("sessionType");
  const history = useHistory();
  const [isManualRead, setIsManualRead] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const [isMicOn, setIsMicOn] = useState(false);
  const [micAccessible, setMicAccessible] = useState(true);
  const [micSilent, setMicSilent] = useState(false);

  const webcamRef = useRef<Webcam | null>(null);

  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<number | null>(null);

  const [cameraAccessible, setCameraAccessible] = useState(true);

  const videoElementRef = useMemo(() => {
    return {
      current: webcamRef.current?.video ?? null,
    } as React.RefObject<HTMLVideoElement | null>;
  }, [webcamRef.current?.video]);

  const { canvasRef, results, proctoringReady } =
    useProctoringSuite(videoElementRef);

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

  const [detectionError, setDetectionError] = useState<string | null>(null);

  useEffect(() => {
    let error: string | null = null;
    if (!proctoringReady) {
      return;
    } else if (results.objects.includes("cell phone")) {
      error = "Mobile phone detected! Please remove it from the frame.";
    } else if (results.faces.length === 0) {
      error = "No face detected. Please ensure your face is clearly visible.";
    } else if (results.faces.length > 1) {
      error =
        "Multiple faces detected. Only one person is allowed in the frame.";
    }

    setDetectionError(error);
  }, [results.objects, results.faces]);

  const queryParams = new URLSearchParams({
    sessionType:
      sessionType === "practiceSession"
        ? "practiceSession"
        : "interviewSession",
  }).toString();

  const handleJoin = () => {
    history.push(
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
    return () => unlisten();
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
        position: "relative",
        overflow: "hidden",
        minHeight: "calc(100vh - 58px)",
      }}
    >
      <Box
        display="flex"
        gap={1}
        alignItems="center"
        justifyContent="center"
        width="100%"
      >
        <Typography variant="h4">Hi</Typography>
        <GradientText text={userData?.firstName} variant="h4" />
      </Box>

      <Typography
        textAlign={"center"}
        variant="h5"
        sx={{
          fontFamily: "Montserrat-Regular",
        }}
      >
        Welcome to your online interview!
      </Typography>
      {/* <BlobAnimation /> */}

      <Box
        display="flex"
        gap={2}
        justifyContent={"space-around"}
        width={"100%"}
        mt={4}
      >
        <Box display="flex" alignItems="center" flexDirection="column">
          <Box
            sx={{
              width: { xs: "80vw", sm: "50vw" },
              position: "relative",
              borderRadius: "12px",
              overflow: "hidden",
              background: "black",
            }}
          >
            {!proctoringReady && (
              <Box
                sx={{
                  width: "100%",
                  backgroundColor: "black",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  color: "white",
                }}
              >
                <Typography variant="h6">Setting up your camera </Typography>
                <CircularProgress
                  size={20}
                  style={{ marginLeft: "8px", color: "white" }}
                />
              </Box>
            )}

            <>
              <Webcam
                audio={isMicOn}
                ref={webcamRef}
                videoConstraints={videoConstraints}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "fill",
                  borderRadius: "12px",
                }}
              />
              <canvas
                ref={canvasRef}
                style={{
                  position: "absolute",
                  top: 0,

                  left: 0,
                  width: "100%",
                  height: "100%",
                  pointerEvents: "none",
                }}
              />
            </>
          </Box>

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

          {detectionError && (
            <Typography
              sx={{
                mt: 2,
                color: "#ff5252",
                fontSize: "14px",
                textAlign: "center",
              }}
            >
              {detectionError}
            </Typography>
          )}

          <Box display="flex" gap={2} mb={1} mt={3}>
            <BeyondResumeButton2 onClick={() => history.goBack()}>
              Go Back
            </BeyondResumeButton2>
            <BeyondResumeButton
              onClick={() => {
                sessionType === "writtenExamSession"
                  ? history.push(
                      `/beyond-resume-jobInterviewSession-written/${brJobId}`
                    )
                  : sessionType === "practiceSession"
                  ? history.push(
                      `/beyond-resume-practiceInterviewSession/${brJobId}?${queryParams}`
                    )
                  : //  history.push(
                    //       `/beyond-resume-jobInterviewSession/${brJobId}`
                    //     );
                    setModalOpen(true);
              }}
              disabled={!isManualRead || !!detectionError}
            >
              Proceed
            </BeyondResumeButton>
          </Box>
        </Box>

        <Box>
          <Box
            sx={{
              width: "100%",
              maxWidth: 350,
              background: "rgba(94, 94, 94, 0.15)",
              p: 2,
              borderRadius: 2,
              height: "fit-content",
              maxHeight: 400,
              overflowY: "auto",
              position: "relative",
              color: "inherit",
              // border: "solid 1px white",
            }}
          >
            <Typography variant="h6" sx={{ mb: 1, color: "inherit" }}>
              Instructions
            </Typography>

            <ul
              style={{
                paddingLeft: "1.2rem",
                fontSize: "14px",
                lineHeight: "1.6",
              }}
            >
              <li>
                You are applying for <strong>{jobTitle}</strong> position at{" "}
                <strong> {companyName}</strong>.
              </li>
              <li>
                {examMode === "Adaptive" && (
                  <>
                    It is an <strong>adaptive evaluation</strong> type session
                    and{" "}
                  </>
                )}
                Your interview will have{" "}
                {examMode === "Adaptive" ? (
                  <strong>{duration / 2} Questions</strong>
                ) : (
                  <strong>{noOfQuestions} Questions</strong>
                )}{" "}
                and will last <strong>{duration} minutes</strong> long.
              </li>
              <li>
                Please ensure your <strong>camera</strong> and{" "}
                <strong>microphone</strong> are working.
              </li>

              {sessionType !== "writtenExamSession" && (
                <>
                  <li>
                    This is an <strong>AI-powered interview</strong>. You will
                    hear questions through voice.
                  </li>
                  <li>
                    Click on <strong>“Start Answering”</strong> when you're
                    ready to respond to the question.
                  </li>
                </>
              )}

              {sessionType !== "writtenExamSession" && (
                <>
                  <li>
                    The exam is required to be taken in fullscreen mode. Any
                    attempt to exit fullscreen or switch browser tabs will lead
                    to automatic submission.
                  </li>

                  {examMode !== "Adaptive" && (
                    <li>
                      You can skip a question if you're unsure. You can return
                      to it later.
                    </li>
                  )}
                </>
              )}

              <li>
                After the last question, your interview will be automatically
                submitted.
              </li>

              <li>
                Our system uses <strong>advanced AI-based proctoring </strong>{" "}
                to monitor the interview session. Please maintain proper conduct
                to avoid disruption.
              </li>
              <li>
                Any suspicious activity may result in your session being{" "}
                <strong>blocked</strong> or <strong>terminated</strong>.
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
              style={{ cursor: "pointer" }}
            />
            <label htmlFor="manualRead" style={{ fontSize: "14px" }}>
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
