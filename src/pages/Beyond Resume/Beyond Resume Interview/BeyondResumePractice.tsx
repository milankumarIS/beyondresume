import { Box, Button, Grid, Typography } from "@mui/material";
import GradientText, {
  BeyondResumeButton,
} from "../../../components/util/CommonStyle";
import { useHistory } from "react-router";

export default function BeyondResumePractice() {
  const history = useHistory();

  const features = [
    {
      title: (
        <>
          <b>Practice</b> interviews <br /> with <b>AI</b>
        </>
      ),
      button: "Try Now",
      image: "/assets/Pic1_2 1.png",
      link: "/beyond-resume-practicePools",
    },
    {
      title: (
        <>
          <b>Review Feedback</b> <br /> and <b>Improve</b> <br /> over time
        </>
      ),
      button: null,
      image: "/assets/pic2 1.png",
      link: "/beyond-resume-interview-list",
    },
    {
      title: (
        <>
          <b>View</b> and <b>Manage</b> upcoming{" "}
          <b>
            {" "}
            <br />
            Job Interviews
          </b>
          <br /> you’ve applied to
        </>
      ),
      button: "View Interviews",
      link: "/beyond-resume-interview-list",

      image: "/assets/pic3 1.png",
    },
  ];
  const steps = [
    {
      title: (
        <>
          Pick a job role and format <br /> (text or video)
        </>
      ),
      image: "/assets/step (1).png",
    },
    {
      title: (
        <>
          Answer job-relevant <br /> questions from our AI
        </>
      ),
      image: "/assets/step (2).png",
    },
    {
      title: (
        <>
          Get instant feedback <br /> strengths, improvement <br /> areas, and a
          score
        </>
      ),
      image: "/assets/step (3).png",
    },
  ];

  return (
    <Box>
      <Box
        sx={{
          minHeight: "70vh",
          textAlign: "center",
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography
          variant="h3"
          textAlign={"center"}
          sx={{
            fontFamily: "montserrat-regular",
          }}
        >
          Welcome to <br /> your{" "}
          <GradientText text={"Interview Hub"} variant="h3" />
        </Typography>

        <Typography
          mt={2}
          sx={{ fontFamily: "montserrat-regular", fontSize: "22px" }}
        >
          This is your space to practice interviews, track real ones, and grow
          your confidence.
        </Typography>
      </Box>

      <Box sx={{ px: 8, py: 6 }}>
        <Grid container spacing={12}>
          {features.map((feature, index) => (
            <Grid
              key={index}
              item
              xs={12}
              md={12}
              display="flex"
              alignItems="center"
              justifyContent="space-around"
              flexDirection={index % 2 === 0 ? "row" : "row-reverse"}
            >
              <Box sx={{ maxWidth: "400px" }}>
                <Typography
                  variant="h4"
                  sx={{
                    mb: 2,
                    fontFamily: "montserrat-regular",
                    "& b": {
                      fontFamily: "custom-bold",
                    },
                  }}
                >
                  {feature.title}
                </Typography>
                {feature.button && (
                  <BeyondResumeButton
                    onClick={() => history.push(`${feature.link}`)}
                    variant="contained"
                    size="small"
                  >
                    {feature.button}
                  </BeyondResumeButton>
                )}
              </Box>

              <Box
                component="img"
                src={feature.image}
                alt="feature"
                sx={{ width: "300px", height: "auto" }}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Typography
        my={4}
        mt={8}
        textAlign={"center"}
        sx={{ fontFamily: "montserrat-regular", fontSize: "16px" }}
      >
        Practicing with AI helps you improve your interview skills with
        real-time feedback. Ready to try your first one?
      </Typography>

      <Box sx={{ px: 8, py: 6 }}>
        <Grid container spacing={12}>
          {steps.map((feature, index) => (
            <Grid
              key={index}
              item
              xs={12}
              md={4}
              display="flex"
              alignItems="center"
              justifyContent="space-around"
              flexDirection={"column-reverse"}
            >
              <Box sx={{ maxWidth: "400px" }}>
                <Typography
                  mt={2}
                  sx={{
                    fontFamily: "custom-bold",
                  }}
                >
                  Step {index + 1}:
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: "montserrat-regular",
                    "& b": {
                      fontFamily: "custom-bold",
                    },
                  }}
                >
                  {feature.title}
                </Typography>
              </Box>

              <Box
                component="img"
                src={feature.image}
                alt="feature"
                sx={{ width: "100px", height: "auto" }}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      <BeyondResumeButton
        onClick={() => history.push("/beyond-resume-practicePools")}
        sx={{ m: "auto", display: "block", my: 4 }}
      >
        Try Free Practice
      </BeyondResumeButton>
    </Box>

  );
}
