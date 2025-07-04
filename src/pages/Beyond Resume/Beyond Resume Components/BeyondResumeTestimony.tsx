import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Stack,
  Grid,
} from "@mui/material";

const responsive = {
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 1 },
  tablet: { breakpoint: { max: 1024, min: 640 }, items: 1 },
  mobile: { breakpoint: { max: 640, min: 0 }, items: 1 },
};

function chunkArray<T>(array: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

const BeyondResumeTestimony = () => {
  const testimonialChunks = chunkArray(testimonials, 6);

  return (
    <Box my={6} px={2}>
      <Typography
        variant="h3"
        sx={{
          fontFamily: "Custom-Bold",
          color: "black",
          width: "fit-content",
          p: 2,
          borderRadius: "12px",
          m: "auto",
        }}
      >
        What Our Users Say
      </Typography>

      <Box sx={{ position: "relative" }}>
        <Carousel
          responsive={responsive}
          //   autoPlay
          infinite
          arrows={false}
          showDots
          containerClass="carousel-container"
          dotListClass="custom-dot-list-style"
          itemClass="carousel-item-padding-40-px"
          //   renderDotsOutside={false}
        >
          {testimonialChunks.map((chunk, chunkIndex) => (
            <Box key={chunkIndex} p={2} pb={6}>
              <Grid container spacing={2}>
                {chunk.map((item, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card
                      elevation={3}
                      sx={{
                        borderRadius: 3,
                        backgroundColor: "#fafafa",
                        height: "100%",
                        transition: "all 0.6s",
                        boxShadow: "4px 4px 15px rgba(0, 0, 0, 0.11)",
                        "&:hover": {
                          background: "black",
                          color: "white",
                        },
                      }}
                    >
                      <CardContent>
                        <Typography
                          variant="body1"
                          sx={{
                            mb: 2,
                            fontFamily: "montserrat-regular",
                          }}
                        >
                          {item.feedback}
                        </Typography>

                        <Stack
                          direction="row-reverse"
                          justifyContent="space-between"
                          alignItems="center"
                          spacing={2}
                          mt={2}
                        >
                          <Avatar>{item.name[0]}</Avatar>
                          <Box>
                            <Typography variant="subtitle2">
                              {item.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ fontFamily: "montserrat-regular" }}
                            >
                              {item.role}
                            </Typography>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
        </Carousel>
      </Box>

      <style>
        {`
        .custom-dot-list-style {
        display: flex !important;
        justify-content: center;
        align-items: center;
        gap: 2px;
        padding: 0px 0;
        z-index: 10;
        bottom:-20
        }
        `}
      </style>
    </Box>
  );
};

export default BeyondResumeTestimony;

const testimonials = [
  {
    name: "Debasmita Nayak",
    role: "B.Tech Student, CET Bhubaneswar",
    feedback:
      "The mock interviews felt so real! I feel more confident now during actual placements.",
  },
  {
    name: "Sourav Mohanty",
    role: "MCA Student, Utkal University",
    feedback:
      "This platform helped me improve my speaking skills with voice-based AI feedback.",
  },
  {
    name: "Rinki Behera",
    role: "BSc Student, Ravenshaw University",
    feedback:
      "The interview analytics gave me deep insights into my performance. Highly recommended!",
  },
  {
    name: "Alok Das",
    role: "MBA Aspirant, KIIT",
    feedback:
      "Cracked 2 interviews back-to-back after practicing on this platform. Super helpful!",
  },
  {
    name: "Shreya Sen",
    role: "B.Tech Student, ITER",
    feedback:
      "The platform simulated real interview pressure. Helped me a lot to overcome anxiety.",
  },
  {
    name: "Rajat Sahu",
    role: "MTech Student, NIT Rourkela",
    feedback:
      "Loved the clean UI and detailed analytics of the interview session!",
  },
  {
    name: "Rajat Sahu",
    role: "MTech Student, NIT Rourkela",
    feedback:
      "Loved the clean UI and detailed analytics of the interview session!",
  },
];
