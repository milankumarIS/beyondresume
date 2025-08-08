import { faCheck, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Dialog,
  DialogContent,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import React from "react";
import { BeyondResumeButton } from "../../../components/util/CommonStyle";
import { useTheme } from "../../../components/util/ThemeContext";
import color from "../../../theme/color";

interface InterviewModeModalProps {
  open: boolean;
  rawJobData: any;
  noOQuestion?: any;
  duration?: any;
  onSelectMode: (mode: "AI_VIDEO" | "BASIC_EXAM") => void;
}

const InterviewModeModal: React.FC<InterviewModeModalProps> = ({
  open,
  onSelectMode,
  rawJobData,
  noOQuestion,
  duration
}) => {
  const { theme } = useTheme();
  return (
    <Dialog open={open} fullWidth maxWidth="md" disableEscapeKeyDown>
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
              mt: 1,
            }}
          >
            {rawJobData?.jobTitle} Positon at {rawJobData?.companyName}
          </Typography>
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
            Please select how you'd like to proceed with your interview.
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
                background:
                  theme === "dark" ? 'white' : color.jobCardBgLight,
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
                AI Video Interview
              </Typography>
              <Typography variant="body2" mt={1}>
                Simulate a real-world interview with voice input and a talking
                AI. Great for building verbal confidence.
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
                Get Started
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
                background:
                  theme === "dark" ? 'white' : color.jobCardBgLight,
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
              <Typography variant="body2" mt={1}>
                Simulate a real-world interview with voice input and a talking
                AI. Great for building verbal confidence.
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
                Get Started
              </BeyondResumeButton>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default InterviewModeModal;
