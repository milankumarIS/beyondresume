import {
  faMicrophone,
  faMicrophoneSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, Box, Grid2, Typography } from "@mui/material";
import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import Webcam from "react-webcam";
import { ListeningAvatar } from "../../../components/util/CommonStyle";
import useMediaDevicesStatus from "../../../components/util/useMediaDevicesStatus";
import { insertDataInTable, UploadAuthFile } from "../../../services/services";
import { useProctoringSuite } from "./useProctoringSuite";

export interface ExamSessionVideoCamBoxHandle {
  stopAndGetRecording: () => Promise<Blob | null>;
}

interface ExamSessionVideoCamBoxProps {
  isSpeaking?: boolean;
  isRecording?: boolean;
  onProctoringError?: (error: string | null) => void;
  onProctoringReady?: (ready: boolean) => void;
  jobData?: any;
  roundData?: any;
}

const ExamSessionVideoCamBox = forwardRef<
  ExamSessionVideoCamBoxHandle,
  ExamSessionVideoCamBoxProps
>(
  (
    {
      isSpeaking,
      isRecording,
      onProctoringError,
      onProctoringReady,
      jobData,
      roundData,
    },
    ref
  ) => {
    const isWrittenPage = location.pathname.startsWith(
      "/beyond-resume-jobInterviewSession-written"
    );
    const webcamRef = useRef<Webcam | null>(null);

    const startTimeRef = useRef<number>(Date.now());
    const captureTimerRef = useRef<NodeJS.Timeout | null>(null);

    const captureAndUpload = async (captureIndex: number) => {
      if (!webcamRef.current) return;

      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) return;

      const response = await fetch(imageSrc);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append("file", blob, `capture-${Date.now()}.jpg`);

      try {
        const result = await UploadAuthFile(formData);
        const imageLink = result?.data?.data?.location;

        const elapsedMinutes = Math.floor(
          (Date.now() - startTimeRef.current) / 60000
        );

        const payload = {
          brJobApplicantId: jobData?.[0]?.brJobApplicantId,
          brJobId: jobData?.[0]?.brJobId,
          roundId: roundData?.roundId || "single round",
          artefactType: "image",
          artefactRemark: imageLink,
          auditRemark: `Capture ${captureIndex} at ${elapsedMinutes} min`,
          brProcteringAuditStatus: "ACTIVE",
        };

        // console.log( payload);

        await insertDataInTable("brProcteringAudit", payload);
      } catch (err) {
        console.error("Image upload failed:", err);
      }
    };

    useEffect(() => {
      let captureIndex = 0;

      const firstTimer = setTimeout(() => {
        captureIndex++;
        captureAndUpload(captureIndex);

        captureTimerRef.current = setInterval(() => {
          captureIndex++;
          captureAndUpload(captureIndex);
        }, 15 * 60 * 1000);
      }, 2 * 60 * 1000);

      return () => {
        clearTimeout(firstTimer);
        if (captureTimerRef.current) clearInterval(captureTimerRef.current);
      };
    }, []);

    const videoElementRef = useMemo(() => {
      return {
        current: webcamRef.current?.video ?? null,
      } as React.RefObject<HTMLVideoElement | null>;
    }, [webcamRef.current?.video]);

    const { canvasRef, results, proctoringReady } =
      useProctoringSuite(videoElementRef);
    const [detectionError, setDetectionError] = useState<string | null>(null);

    useEffect(() => {
      let error: string | null = null;
      if (!proctoringReady) {
        return;
      }
      //  else if (results.objects.includes("cell phone")) {
      //   error = "Mobile phone detected! Please remove it from the frame.";
      // }
      else if (results.faces === 0) {
        error = "No face detected. Please ensure your face is clearly visible.";
      } else if (results.faces > 1) {
        error =
          "Multiple faces detected. Only one person is allowed in the frame.";
      }

      setDetectionError(error);
      onProctoringError?.(error);
    }, [results]);

    useEffect(() => {
      onProctoringReady?.(proctoringReady);
    }, [proctoringReady]);

    const [webcamSize, setWebcamSize] = useState({ width: 0, height: 0 });

    const {
      hasCamera,
      cameraAccessible,
      hasMic,
      micAccessible,
      micSilent,
      isMicOn,
    } = useMediaDevicesStatus();

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
      <>
        {isWrittenPage ? (
          <Box
            sx={{
              width: "170px",
              height: "130px",
              position: "relative",
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            <Webcam
              audio={isMicOn}
              ref={webcamRef}
              videoConstraints={videoConstraints}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "fill",
                borderRadius: "12px",
                position: "absolute",
                top: 0,
                left: 0,
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
          </Box>
        ) : (
          <Grid2
            size={{ xs: 12, md: 8 }}
            sx={{
              height: "maxHeight",
              gap: "12px",
              borderRadius: "12px",
              p: 2,
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              pb: { xs: "70px", sm: "70px" },
            }}
          >
            <Box sx={{ width: { xs: "100%", sm: "50%" } }}>
              <Box
                sx={{
                  position: "relative",
                  borderRadius: "12px",
                  overflow: "hidden",
                  height: "250px",
                  // background: "linear-gradient(145deg, #0d0d0d, #2D3436)",
                }}
              >
                {hasCamera || cameraAccessible ? (
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
                        overflow: "hidden",
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

              {(micSilent || !hasMic || !micAccessible) && (
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
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  color: "white",
                }}
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
              >
                {isRecording
                  ? "Listening for answer..."
                  : 'Click "Start Answering" Button below to give your answer.'}
              </Typography>
            </Box>
          </Grid2>
        )}
      </>
    );
  }
);

export default ExamSessionVideoCamBox;
