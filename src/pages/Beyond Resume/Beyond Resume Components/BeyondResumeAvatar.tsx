import React, { useEffect, useRef, useState } from "react";
import { Box, Typography, Paper, IconButton } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { BeyondResumeButton } from "../../../components/util/CommonStyle";
import color from "../../../theme/color";
import GLBViewer from "./GLBViewer";
import { faChevronCircleRight, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { syncDataInTable } from "../../../services/services";
import { getUserId } from "../../../services/axiosClient";

interface BeyondResumeAvatarProps {
  scriptLines: string[];
  open: boolean;
  onClose: () => void;
}

const BeyondResumeAvatar: React.FC<BeyondResumeAvatarProps> = ({
  scriptLines,
  open,
  onClose,
}) => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const avatarIframeRef = useRef<HTMLIFrameElement>(null);

  const speakText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    setIsSpeaking(true);

    utterance.onstart = () => {
      postAvatarMessage("start_talking");
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      postAvatarMessage("stop_talking");

      if (currentLineIndex < scriptLines.length - 1) {
        setCurrentLineIndex((prev) => prev + 1);
      }
    };

    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  };

  const postAvatarMessage = (action: "start_talking" | "stop_talking") => {
    avatarIframeRef.current?.contentWindow?.postMessage({ type: action }, "*");
  };

  const handleSkip = () => {
    syncDataInTable(
      "userAvatar",
      {
        userId: getUserId(),
        avatarStatus: "CLOSED",
      },
      "userId"
    );
    handleClose();
  };

  // Optional ElevenLabs Integration (commented)
  // const elevenLabsSpeak = async (text: string) => {
  //   const audioBlob = await fetch("/api/elevenlabs-speak", {
  //     method: "POST",
  //     body: JSON.stringify({ text }),
  //   }).then((res) => res.blob());

  //   const audio = new Audio(URL.createObjectURL(audioBlob));
  //   audio.play();
  // };

  useEffect(() => {
    if (open && currentLineIndex < scriptLines.length) {
      speakText(scriptLines[currentLineIndex]);
    }
  }, [currentLineIndex, open]);

  useEffect(() => {
    if (!open) {
      speechSynthesis.cancel();
      postAvatarMessage("stop_talking");
    }
  }, [open]);

  const handleClose = () => {
    speechSynthesis.cancel();
    postAvatarMessage("stop_talking");
    onClose();
  };

  if (!open) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0)",
        backdropFilter: "blur(4px)",
        zIndex: 1300,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <AnimatePresence>
        <motion.div
          key="ai-profile"
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.95 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            sx={{
              width: { xs: "90vw", sm: "700px" },
              maxHeight: "85vh",
              p: 4,
              borderRadius: 4,
              background: "transparent",
              boxShadow: "none",
              //   background: color.background2,
              //   border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "white",
              //   boxShadow: "0 8px 32px 0 rgba(11, 14, 48, 0.37)",
              position: "relative",
            }}
          >
            <IconButton
              onClick={handleClose}
              sx={{ position: "absolute", top: 12, right: 12, color: "#fff" }}
            >
             <FontAwesomeIcon icon={faXmarkCircle}/>
            </IconButton>

            <Typography variant="h4" align="center" gutterBottom>
              AI Assistant
            </Typography>

            <Box
              sx={{
                width: "300px",
                height: "300px",
                borderRadius: "999px",
                overflow: "hidden",
                mb: 2,
                // border:'solid 2px white',
                background: color.background2,
                mx: "auto",
                boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.29)",
              }}
            >
              <GLBViewer isSpeaking={isSpeaking} />
            </Box>

            <Typography variant="body1" align="center" color="black" mb={3}>
              {scriptLines[currentLineIndex]}
            </Typography>
            {/* <BeyondResumeButton
                onClick={handleClose}
                sx={{
                  background: "transparent",
                  border: "solid 1px black",
                  color: "black",
                }}
              >
                Skip <FontAwesomeIcon style={{marginLeft:'4px'}} icon={faChevronCircleRight}/>
              </BeyondResumeButton> */}

            <Box textAlign="center" mt={2}>
              <BeyondResumeButton onClick={handleSkip}>
                Skip
                <FontAwesomeIcon
                  style={{ marginLeft: "4px" }}
                  icon={faChevronCircleRight}
                />
              </BeyondResumeButton>
            </Box>
          </Paper>
        </motion.div>
      </AnimatePresence>
    </Box>
  );
};

export default BeyondResumeAvatar;
