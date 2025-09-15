import React, { useRef, useEffect, useState } from "react";
import { Typography, Box, Grid2 } from "@mui/material";
import color from "../../../theme/color";
import { getUserRole } from "../../../services/axiosClient";

const talentPartnerSteps = [
  {
    title: "Post a Job Instantly",
    description:
      "Use AI to generate polished job descriptions in seconds and start attracting candidates.",
 image: "/assets/Vector Smart Object2.png",
  },
  {
    title: "AI-Powered Candidate Evaluation",
    description:
      "Save time with automated scoring and structured feedback on candidate interviews.",
       image: "/assets/Vector Smart Object3.png",

  },
  {
    title: "Hire Smarter, Faster",
    description:
      "Focus on the best-fit candidates and speed up your hiring process with confidence.",
      image: "/assets/Vector Smart Object1.png",

  },
];
const jobSeekerSteps = [
  {
    title: "Choose a Job",
    description:
      "Browse live openings from talent partners or create a custom role for practice.",
    image: "/assets/Vector Smart Object2.png",
  },
  {
    title: "AI Interview Practice",
    description:
      "Take interactive interviews with text or video. Get a real hiring experience before the real thing.",
    image: "/assets/Vector Smart Object3.png",
  },
  {
    title: "Get Instant Feedback",
    description:
      "AI analyzes your answers, scores performance, and shares tips to improve.",
    image: "/assets/Vector Smart Object1.png",
  },
];

const sectionData =
  getUserRole() === "CAREER SEEKER" ? jobSeekerSteps : talentPartnerSteps;

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
        sx={{
          fontFamily: "Custom-Bold",
          width: "fit-content",
          p: 2,
          borderRadius: "12px",
          m: "auto",
          mb: 4,
          textAlign:'center',
          fontSize: { xs: "32px", md: "48px" },

        }}
        fontWeight="bold"
      >
        Quick Steps to Get Into Beyond Resume
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

              background: color.cardBg,
              borderRadius: isImageLeft
                ? "0px 900px 200px 0px"
                : "900px 0px 0px 200px",
              opacity: isVisible ? 1 : 0,
              // transform: isVisible
              //   ? "translateX(0)"
              //   : `translateX(${isImageLeft ? "-100px" : "100px"})`,
              transition: "all 0.8s ease-out",
              ...(isImageLeft ? {} : { marginLeft: "auto" }),
            }}
          >
            <Grid2 size={{ xs: 12, md: 5 }}>
              <Box
                component="img"
                src={item.image}
                alt={item.title}
                sx={{ width: "100%", maxHeight: 200, objectFit: "contain" }}
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
                variant="body1"
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
