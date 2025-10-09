import { faCheckCircle, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Step,
  StepIconProps,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import React, { useState } from "react";
import { useTheme } from "../../../components/context/ThemeContext";
import color from "../../../theme/color";
import {
  BeyondResumeButton,
  CutoffInfo,
} from "../../../components/util/CommonStyle";
import { formatRoundTS } from "../../../components/util/CommonFunctions";

interface Round {
  roundId: string;
  roundName: string;
  roundWindow: number;
}

interface JobTimelineProps {
  job: {
    jobId: string;
    endDate: string;
    rounds: Round[];
  };
  rounds?: any;
}

const CustomStepIcon = (props: StepIconProps) => {
  const { active, completed } = props;

  return (
    <Box
      sx={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        background: completed
          ? color.activeColor
          : active
          ? color.activeButtonBg
          : "#bdbdbd",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontSize: "14px",
      }}
    >
      {completed ? (
        <FontAwesomeIcon
          style={{ height: "32px", color: "white" }}
          icon={faCheckCircle}
        ></FontAwesomeIcon>
      ) : (
        props.icon
      )}
    </Box>
  );
};

const JobTimelineStepper: React.FC<JobTimelineProps> = ({ job, rounds }) => {
  const today = dayjs();
  const applicationDeadline = dayjs(job.endDate);
  let cumulativeDays = 0;

  const steps = [
    {
      label: "Application Deadline",
      date: applicationDeadline,
      isCompleted: today.isAfter(applicationDeadline, "day"),
      window: 0,
    },
    ...rounds?.map((round) => {
      cumulativeDays += round.roundWindow;
      const tentativeEndDate = applicationDeadline
        .clone()
        .add(cumulativeDays, "day");
      const isCompleted = today.isAfter(tentativeEndDate, "day");
      return {
        label: `${formatRoundTS(round.roundId)} - ${round.roundName} ends`,
        date: tentativeEndDate,
        window: round.roundWindow,
        isCompleted,
      };
    }),
  ];

  const finalStepDate = steps[steps.length - 1].date.clone().add(1, "day");
  const finalStepCompleted = steps[steps.length - 1].isCompleted;

  const { theme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <Box
      sx={{
        background: color.cardBg,
        p: 2,
        mt: 2,
        borderRadius: "12px",
        width: "100%",
      }}
    >
      <Box
        display={"flex"}
        gap={2}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Typography variant="h6" gutterBottom>
          Estimated Process Timeline
        </Typography>
        <BeyondResumeButton
          sx={{
            display: "flex",
            m: 0,
            mt: -1,
            minWidth: 0,
            p: 0.5,
          }}
          variant="outlined"
          onClick={() => setOpen(true)}
        >
          <FontAwesomeIcon icon={faInfoCircle}></FontAwesomeIcon>{" "}
        </BeyondResumeButton>
      </Box>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography sx={{ textDecoration: "underline" }} variant="h6">
            Cutoff Settings Guide
          </Typography>
        </DialogTitle>
        <DialogContent dividers>{CutoffInfo()}</DialogContent>
        <DialogActions>
          <BeyondResumeButton onClick={() => setOpen(false)}>
            Close
          </BeyondResumeButton>
        </DialogActions>
      </Dialog>

      <Stepper
        // alternativeLabel
        orientation="vertical"
        activeStep={steps.length}
        sx={{
          "& .MuiStepConnector-line": {
            borderColor: color.activeColor,
            borderWidth: 2,
            ml: 0.4,
          },
        }}
      >
        {steps.map((step, index) => (
          <Step
            sx={{
              "& .MuiStepLabel-label": {
                color:
                  theme === "dark"
                    ? step.isCompleted
                      ? "white"
                      : "#ddddddc0"
                    : step.isCompleted
                    ? "black"
                    : "#000000a8",
              },
            }}
            key={index}
            completed={step.isCompleted}
            active
          >
            <StepLabel StepIconComponent={CustomStepIcon}>
              {step.label}: {step.date.format("DD MMMM YYYY")}
              {step.window > 0 ? ` (${step.window} days window)` : ""}
            </StepLabel>
          </Step>
        ))}

        <Step
          sx={{
            "& .MuiStepLabel-label": {
              color: theme === "dark" ? "#ddddddc0" : "#000000a8",
            },
          }}
          key="final"
          completed={finalStepCompleted}
          active
        >
          <StepLabel StepIconComponent={CustomStepIcon}>
            Final shortlist available: {finalStepDate.format("DD MMMM YYYY")}
          </StepLabel>
        </Step>
      </Stepper>
    </Box>
  );
};

export default JobTimelineStepper;
