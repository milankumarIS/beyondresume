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

interface InterviewModeModalProps {
  open: boolean;
  onSelectMode: (mode: "AI_VIDEO" | "BASIC_EXAM") => void;
}

const InterviewModeModal: React.FC<InterviewModeModalProps> = ({
  open,
  onSelectMode,
}) => {
  return (
    <Dialog open={open} fullWidth maxWidth="md" disableEscapeKeyDown>
      <DialogContent>
        <Box textAlign="center" mb={3}>
          <Typography
            variant="h5"
            align="center"
            sx={{
              width: "fit-content",
              m: "auto",
              mb: 2,
              fontFamily: "Custom-Bold",
              background: "linear-gradient(180deg, #50bcf6, #50bcf6)",
              color: "white",
              p: 2,
              px: 4,
              borderRadius: "44px",
              boxShadow: "0px 4px 10px rgba(90, 128, 253, 0.49)",
            }}
          >
            Choose Interview Mode
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Please select how you'd like to proceed with your interview.
          </Typography>
        </Box>

        <Grid container spacing={3} py={2} px={1}>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 3,
                transition: "all 0.3s ease",
                boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.10)",
                border: "solid 2px transparent",

                "&:hover": {
                  border: "solid 2px #50bcf6",                  
                  transform: "scale(1.03)",
                },
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                AI Video Interview
              </Typography>
              <Typography variant="body2" mt={1}>
                You’ll be guided by an AI narrator. Questions will be read aloud
                and you’ll answer using your voice.
              </Typography>
              <Box
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
              </Box>
              <BeyondResumeButton
                fullWidth
                variant="contained"
                color="secondary"
                sx={{ mt: 2, py: 1, fontSize: "1rem" }}
                onClick={() => onSelectMode("AI_VIDEO")}
              >
                Get Started
              </BeyondResumeButton>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 3,
                transition: "all 0.3s ease",
                boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.10)",
                border: "solid 2px transparent",

                "&:hover": {
                  border: "solid 2px #50bcf6",                  
                  transform: "scale(1.03)",
                },
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                Web Based Evaluation
              </Typography>
              <Typography variant="body2" mt={1}>
                Questions will be shown on screen. You’ll write your answers in
                a text box at your own pace.
              </Typography>
              <Box
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
              </Box>
              <BeyondResumeButton
                fullWidth
                variant="contained"
                color="secondary"
                sx={{ mt: 2, py: 1, fontSize: "1rem" }}
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
