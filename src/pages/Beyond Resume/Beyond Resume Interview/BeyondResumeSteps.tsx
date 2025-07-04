import React, { useRef, useEffect, useState } from "react";
import { Typography, Box, Grid2 } from "@mui/material";

const sectionData = [
  {
    title: "Choose or Create a Job Description",
    description:
      "Select from our ready-made job descriptions or craft your own tailored to the role.",
    image: "/assets/Vector Smart Object2.png",
  },
  {
    title: "Start Your Interview Practice",
    description:
      "Kick off your mock interview with our AI-powered interviewer for a realistic experience.",
    image: "/assets/Vector Smart Object3.png",
  },
  {
    title: "Get Instant, Actionable Feedback",
    description:
      "Receive a comprehensive analysis of your interview to highlight strengths and areas for improvement.",
    image: "/assets/Vector Smart Object1.png",
  },
];

const BeyondResumeSteps = () => {
  const [visible, setVisible] = useState<boolean[]>([]);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const updated = [...visible];
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute("data-index"));
          updated[index] = entry.isIntersecting;
        });
        setVisible(updated);
      },
      { threshold: 0.3 }
    );

    refs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [visible]);

  return (
    <Box>
      <Typography
        variant="h3"
        sx={{
          fontFamily: "Custom-Bold",
          color: "black",
          width: "fit-content",
          p: 2,
          borderRadius: "12px",
          m: "auto",
          mb: 4,
        }}
        fontWeight="bold"
      >
        Quick Steps to Give Winning Interviews
      </Typography>

      {sectionData.map((item, index) => {
        const isImageLeft = index % 2 === 0;
        const isVisible = visible[index];

        return (
          <Grid2
            container
            key={index}
            direction={isImageLeft ? "row" : "row-reverse"}
            alignItems="center"
            data-index={index}
            ref={(el) => {
              refs.current[index] = el;
            }}
            sx={{
              mb: 8,
              p: 2,
              maxWidth: "90vw",
              background: "linear-gradient(145deg, #0d0d0d, #2D3436)",
              borderRadius: isImageLeft
                ? "0px 200px 200px 0px"
                : "200px 0px 0px 200px",
              opacity: isVisible ? 1 : 0,
              transform: isVisible
                ? "translateX(0)"
                : `translateX(${isImageLeft ? "-100px" : "100px"})`,
              transition: "all 0.8s ease-out",
              ...(isImageLeft ? {} : { marginLeft: "auto" }),
            }}
          >
            <Grid2 size={{ xs: 12, md: 5 }}>
              <Box
                component="img"
                src={item.image}
                alt={item.title}
                sx={{ width: "100%", maxHeight: 300, objectFit: "contain" }}
              />
            </Grid2>

            <Grid2 size={{ xs: 12, md: 6 }} sx={{ p: 4 }}>
              <Typography
                variant="h3"
                fontWeight="bold"
                sx={{ fontFamily: "Custom-Bold" }}
                mt={-2}
              >
                0{index + 1}
              </Typography>
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ fontFamily: "Custom-Bold" }}
                gutterBottom
              >
                {item.title}
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontFamily: "Montserrat-Regular" }}
                gutterBottom
              >
                {item.description}
              </Typography>
            </Grid2>
          </Grid2>
        );
      })}
    </Box>
  );
};

export default BeyondResumeSteps;
