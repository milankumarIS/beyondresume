import {
  faCheck,
  faCheckCircle,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import React from "react";
import { BeyondResumeButton } from "../../../components/util/CommonStyle";
import { useTheme } from "../../../components/context/ThemeContext";
import color from "../../../theme/color";
import { formatRoundTS } from "../../../components/util/CommonFunctions";

interface InterviewModeModalProps {
  open: boolean;
  rawJobData: any;
  noOQuestion?: any;
  duration?: any;
  roundId?: any;
  roundName?: any;
  onSelectMode: (mode: "AI_VIDEO" | "BASIC_EXAM") => void;
  disableOutsideClick?: boolean;
  onClose?: () => void;
}

const InterviewModeModal: React.FC<InterviewModeModalProps> = ({
  open,
  onSelectMode,
  rawJobData,
  noOQuestion,
  duration,
  disableOutsideClick = true,
  onClose,
  roundName,
  roundId
}) => {
  const { theme } = useTheme();

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="md"
      onClose={(event, reason) => {
        if (reason === "backdropClick" || reason === "escapeKeyDown") {
          return;
        }
      }}
    >
      {!disableOutsideClick && (
        <FontAwesomeIcon
          icon={faXmarkCircle}
          onClick={onClose}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            fontSize: "1.5rem",
            cursor: "pointer",
            color: theme === "dark" ? color.titleColor : color.titleLightColor,
          }}
        />
      )}

      <DialogContent
        style={{
          background: theme === "dark" ? color.newbg : "white",
          color: theme === "dark" ? "white" : "black",
          borderRadius: "12px",
        }}
      >
        <Box textAlign="center" mb={3} p={2}>
          {/* <Typography
            variant="h5"
            align="center"
            sx={{
              width: "fit-content",
              m: "auto",
              fontFamily: "montserrat-regular",
              fontSize: "20px",
            }}
          >
            You are applying for
          </Typography> */}
          <Typography
            variant="h6"
            sx={{
              fontFamily: "custom-regular",
              color:
                theme === "dark" ? color.titleColor : color.titleLightColor,
              background:
                theme === "dark" ? color.jobCardBg : color.jobCardBgLight,
              borderRadius: "8px",
              width: "fit-content",
              px: 2,
              m: "auto",
            }}
          >
            {rawJobData?.jobTitle} Positon at {rawJobData?.companyName}
          </Typography>

          {roundId && roundName &&
          <Typography
            variant="body1"
            sx={{
              fontFamily: "custom-regular",
              color:
                theme === "dark" ? color.titleColor : color.titleLightColor,
              background:
                theme === "dark" ? color.jobCardBg : color.jobCardBgLight,
              borderRadius: "8px",
              width: "fit-content",
              px: 2,
              m: "auto",
              mt: 2,
            }}
          > {formatRoundTS(roundId)}: {''}
             {roundName}
          </Typography>}
          <Typography
            variant="h5"
            align="center"
            sx={{
              width: "fit-content",
              m: "auto",
              mt: 2,
              fontFamily: "Custom-regular",
            }}
          >
            Choose Interview Mode
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontFamily: "montserrat-regular",
            }}
          >
            Pick the interview mode that works best for you.
          </Typography>
        </Box>

        <Grid container spacing={2} pb={1} px={1}>
          <Grid item xs={12} md={6} p={4}>
            <Paper
              elevation={3}
              sx={{
                p: 2,
                borderRadius: 3,
                transition: "all 0.3s ease",
                boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.10)",
                border: "solid 2px transparent",
                background: theme === "dark" ? "white" : color.jobCardBgLight,
                "&:hover": {
                  // border: "solid 2px #50bcf6",
                  transform: "scale(1.03)",
                },
              }}
            >
              <img
                style={{
                  margin: "auto",
                  display: "block",
                }}
                src="/assets/ai base.png"
              />

              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{
                  mt: 1,
                  fontFamily: "Custom-bold",
                  textAlign: "center",
                }}
              >
                Video Based Interview
              </Typography>

              {/* <Typography textAlign={"center"}>
                Show your personality and communication skills on camera.
              </Typography> */}

              <Typography
                variant="body2"
                mt={1}
                textAlign={"center"}
                fontFamily={"montserrat-regular"}
              >
                Simulate a real interview with voice + video. Perfect for
                building confidence and leaving a lasting impression.
              </Typography>
              {/* <Box
                mt={2}
                component="ul"
                sx={{
                  pl: 1,
                  fontFamily: "Custom-Regular",
                  fontSize: "16px",
                  lineHeight: "1.8",
                }}
              >
                <span>
                  <FontAwesomeIcon
                    style={{ color: "#559cf9" }}
                    icon={faCheckCircle}
                  />{" "}
                  <strong> Narrated questions</strong>
                  <br />
                </span>
                <span>
                  <FontAwesomeIcon
                    style={{ color: "#559cf9" }}
                    icon={faCheckCircle}
                  />{" "}
                  <strong> Voice input</strong>
                  <br />
                </span>
                <span>
                  <FontAwesomeIcon
                    style={{ color: "#559cf9" }}
                    icon={faCheckCircle}
                  />{" "}
                  <strong> Real-time interaction</strong>
                </span>
              </Box> */}
              <BeyondResumeButton
                fullWidth
                variant="contained"
                color="secondary"
                sx={{
                  mt: 2,
                  py: 1,
                  fontSize: "1rem",
                  background: theme === "dark" ? "black" : "white",
                  color: theme === "dark" ? "white" : "black",
                }}
                onClick={() => onSelectMode("AI_VIDEO")}
              >
                Start Video Interview
              </BeyondResumeButton>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6} p={4}>
            <Paper
              elevation={3}
              sx={{
                p: 2,
                borderRadius: 3,
                transition: "all 0.3s ease",
                boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.10)",
                border: "solid 2px transparent",
                background: theme === "dark" ? "white" : color.jobCardBgLight,
                "&:hover": {
                  // border: "solid 2px #50bcf6",
                  transform: "scale(1.03)",
                },
              }}
            >
              <img
                style={{
                  margin: "auto",
                  display: "block",
                }}
                src="/assets/web base.png"
              />
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{
                  mt: 1,
                  fontFamily: "Custom-bold",
                  textAlign: "center",
                }}
              >
                Text Based Evaluation
              </Typography>

              <Typography
                variant="body2"
                mt={1}
                textAlign={"center"}
                fontFamily={"montserrat-regular"}
              >
                Answer questions in writing at your own pace. Great for
                structured thinkers who prefer clarity over spontaneity.
              </Typography>
              {/* <Box
                mt={2}
                component="ul"
                sx={{
                  pl: 1,
                  fontFamily: "Custom-Regular",
                  fontSize: "16px",
                  lineHeight: "1.8",
                }}
              >
                <span>
                  <FontAwesomeIcon
                    style={{ color: "#559cf9" }}
                    icon={faCheckCircle}
                  />{" "}
                  Text-based questions <br />
                </span>
                <span>
                  <FontAwesomeIcon
                    style={{ color: "#559cf9" }}
                    icon={faCheckCircle}
                  />{" "}
                  <strong> Answer in textbox</strong>
                  <br />
                </span>
                <span>
                  <FontAwesomeIcon
                    style={{ color: "#559cf9" }}
                    icon={faCheckCircle}
                  />{" "}
                  <strong> Flexible pacing</strong>
                </span>
              </Box> */}
              <BeyondResumeButton
                fullWidth
                variant="contained"
                color="secondary"
                sx={{
                  mt: 2,
                  py: 1,
                  fontSize: "1rem",
                  background: theme === "dark" ? "black" : "white",
                  color: theme === "dark" ? "white" : "black",
                }}
                onClick={() => onSelectMode("BASIC_EXAM")}
              >
                Start Text Evaluation
              </BeyondResumeButton>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default InterviewModeModal;
