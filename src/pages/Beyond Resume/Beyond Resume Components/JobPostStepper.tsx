import {
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  Typography,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { styled } from "@mui/material/styles";
import color from "../../../theme/color";

const CustomStepIcon = (props: any) => {
  const { active, completed, icon } = props;

  if (completed) {
    return (
      <div
        style={{
          background: color.activeButtonBg,
          borderRadius: "50%",
          width: 28,
          height: 28,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FontAwesomeIcon icon={faCheck} color="#fff" size="sm" />
      </div>
    );
  }

  if (active) {
    return (
      <div
        style={{
          border: `2px solid ${color.activeColor}`,
          borderRadius: "50%",
          width: 28,
          height: 28,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        //   background: "transparent",
        //   boxSizing: "border-box",
        }}
      >
        <div
          style={{
            background: color.activeButtonBg,
            borderRadius: "50%",
            width: 22,
            height: 22,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ color: "#fff", fontWeight: "bold", fontSize: "14px" }}>
            {icon}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#ccc",
        borderRadius: "50%",
        width: 28,
        height: 28,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#555",
        fontSize: "14px",
        fontFamily: "custom-regular",
      }}
    >
      {icon}
    </div>
  );
};

const CustomConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 16,
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: "#ccc",
    borderTopWidth: 2,
    borderRadius: 1,
  },
  [`&.${stepConnectorClasses.active} .${stepConnectorClasses.line}`]: {
    borderColor: color.activeColor,
  },
  [`&.${stepConnectorClasses.completed} .${stepConnectorClasses.line}`]: {
    borderColor: color.activeColor,
  },
}));

export default function JobPostStepper({
  steps,
  activeStep,
  theme,
  onStepClick,
}: any) {
  return (
    <Stepper
      activeStep={activeStep}
      alternativeLabel
      connector={<CustomConnector />}
      sx={{ my: 4 }}
    >
      {steps.map((label: string, index: number) => (
        <Step key={label}>
          <StepLabel
            StepIconComponent={CustomStepIcon}
            onClick={() => onStepClick?.(null, index)}
            sx={{
              cursor: "pointer",
              "& .MuiStepLabel-label": {
                fontSize: index === activeStep ? "14px" : "14px",
                color: theme === "dark" ? "#aaaaaac0" : "#555555a8",
                "&.Mui-active": {
                  color:
                    theme === "dark" ? color.titleColor : color.titleLightColor,
                  fontFamily: "custom-bold",
                },
                "&.Mui-completed": {
                  color:
                    theme === "dark" ? color.titleColor : color.titleLightColor,
                },
              },
            }}
          >
            {/* <Typography>Step {index + 1}</Typography> */}
            {label}
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}
