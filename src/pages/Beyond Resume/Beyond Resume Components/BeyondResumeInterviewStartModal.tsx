import React from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  Dialog,
  Stepper,
  Step,
  StepLabel,
  Paper,
} from "@mui/material";
import {
  faCheckCircle,
  faCircle,
  faCircleDot,
  faInfoCircle,
  faRadio,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  BeyondResumeButton,
  BeyondResumeButton2,
} from "../../../components/util/CommonStyle";
import color from "../../../theme/color";
import { useTheme } from "../../../components/context/ThemeContext";

const steps = ["Job Application", "Interview Confirmation", "AI Interview"];

interface Props {
  rawJobData: any;
  open: boolean;
  onStart: () => void;
  onLater: () => void;
}

export default function BeyondResumeInterviewStartModal({
  open,
  onStart,
  rawJobData,
  onLater,
}: Props) {
  const { theme } = useTheme();
  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="md"
      onClose={() => {}}
      PaperProps={{
        sx: { borderRadius: 3, p: { xs: 3, md: 5 }, overflow: "visible" },
      }}
    >
      {/* <Box mb={4}>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#111" }}>
          BEYOND RESUME
        </Typography>
      </Box> */}

      <Paper elevation={0} sx={{ borderRadius: 3, boxShadow: "none" }}>
        <Grid container spacing={4} alignItems="center">
          {/* Left Content */}
          <Grid item xs={12} md={7}>
            {/* <Typography
              variant="body2"
              fontWeight="bold"
              sx={{
                mb: 2,
                background: "#16a34a",
                color: "white",
                px: 1,
                borderRadius: "12px",
                width: "fit-content",
              }}
            >
              <FontAwesomeIcon
                icon={faCheckCircle}
                style={{ marginRight: "4px", fontSize: "14px" }}
              />
              You've Successfully applied for the job
            </Typography> */}

            {/* <Typography
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
                my: 1,
                mb:2
              }}
            >
              {rawJobData?.jobTitle} Positon at {rawJobData?.companyName}
            </Typography> */}

            <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
              Ready to Begin Your Interview?
            </Typography>

            {/* <Typography mt={-1.5} mb={2} variant="body2">
              This is your opportunity to demonstrate your skills in a live,
              AI-powered interview.
            </Typography> */}

            <Typography
              variant="body2"
              sx={{
                color: "#555",
                mb: 3,
                lineHeight: 1.3,
                // fontFamily: "montserrat-regular",
              }}
            >
              You are about to enter a live AI-powered interview session. This
              is not a practice round. your responses will be recorded and
              shared with the hiring team.
            Don’t worry this isn’t about perfection, it’s about
              showing your true potential.
            </Typography>

            <Box
              display="flex"
              alignItems="flex-start"
              sx={{
                backgroundColor: color.jobCardBgLight,
                p: 2,
                borderRadius: 2,
                mb: 3,
              }}
            >
              {/* <FontAwesomeIcon
            style={{
              marginRight: "4px",
              marginTop: "2px",
              color: color.activeColor,
              //   fontSize:'12px'
            }}
            icon={faInfoCircle}
          /> */}

              <Typography variant="body2" sx={{ color: "#333" }}>
                If you are not fully prepared, you may save your application and
                return at a later time to complete your interview.
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={5} display="flex" justifyContent="center">
            <Box
              component="img"
              src="/assets/interview.svg"
              alt="Interview Illustration"
              sx={{ width: "100%", maxWidth: 280 }}
            />
          </Grid>
        </Grid>

        {/* Buttons */}
        <Box display="flex" gap={2}>
          <BeyondResumeButton variant="contained" onClick={onStart}>
            I'm Ready, Let's Start
          </BeyondResumeButton>
          <BeyondResumeButton2 variant="outlined" onClick={onLater}>
            I’ll Come Back Later
          </BeyondResumeButton2>
        </Box>
      </Paper>

      {/* <Box mt={5} display="flex" justifyContent="center">
        <Stepper activeStep={2} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box> */}
    </Dialog>
  );
}
