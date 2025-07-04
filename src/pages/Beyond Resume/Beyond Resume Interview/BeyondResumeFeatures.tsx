import { Box, Grid, Paper, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { useRef, useState, useEffect, forwardRef } from "react";

const categories = [
  {
    icon: "Shape 3",
    title: "Personalized Interview Prep",
    desc: "With Beyond Resume, select your career path or a specific job listing to practice questions that are truly relevant. Our intelligent system ensures your prep is focused and effective.",
  },
  {
    icon: "Shape 7",
    title: "Immersive Interview Experience",
    desc: "Beyond Resume offers a real-world interview simulation through an intuitive interface, helping you build confidence and perform at your best when it matters most.",
  },
  {
    icon: "Shape 4",
    title: "AI-Powered Performance Feedback",
    desc: "Receive instant, intelligent feedback from Beyond Resume’s AI coach — analyzing your answers for clarity, impact, and delivery so you can continuously improve.",
  },
];

const HighlightedPaper = styled(Paper)({
  background: "linear-gradient(to bottom, #3BA9FD, #6B60EC)",
  color: "#fff",
  transition: "0.3s",
  "& svg": {
    color: "#fff",
  },
});

const NormalPaper = styled(Paper)(({ theme }) => ({
  position: "relative",
  background: "linear-gradient(145deg, #0d0d0d, #2D3436)",

  color: "white",
  transition: "all 0.3s, box-shadow 0.3s",

  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    // background: "linear-gradient(180deg, #50bcf6, #5a81fd)",
    // boxShadow: "-4px -4px 20px rgba(1, 1, 1, 0.19) inset",

    opacity: 0,
    transition: "opacity 0.3s",
    zIndex: 0,
    borderRadius: "12px",
    color: "#fff",
  },

  "&:hover::before": {
    opacity: 1,
  },

  "&:hover": {
    color: "#fff",
    // boxShadow: "0px 4px 10px rgba(90, 128, 253, 0.49)",
    transform: "scale(1.02)",
  },

  "& svg": {
    position: "relative",
    zIndex: 1,
    transition: "color 0.3s",
  },

  "&:hover svg": {
    color: "#fff",
  },
}));

const CategoryCard = ({ icon, title, highlight, desc }: any) => {
  const Component = highlight ? HighlightedPaper : NormalPaper;

  return (
    <Component
      elevation={highlight ? 8 : 3}
      sx={{
        p: 6,
        textAlign: "left",
        borderRadius: 3,
        width: "70%",
        height: "300px",
        boxShadow: "0 8px 24px rgba(29, 28, 39, 0.07)",
      }}
    >
      <Box position={"relative"} mb={2}>
        {/* <FontAwesomeIcon
          icon={icon}
          size="6x"
          style={{ marginBottom: "20px" }}
        /> */}
        <img style={{ width: "80px" }} src={`/assets/${icon}.png`}></img>
        <Typography mt={2} variant="h6" sx={{ fontFamily: "custom-bold", lineHeight:1.2 }}>
          {title}
        </Typography>
        <Typography
          sx={{ fontFamily: "Montserrat-Regular" }}
          variant="body2"
          mt={1}
        >
          {desc}
        </Typography>
      </Box>
    </Component>
  );
};

const BeyondResumeFeatures = forwardRef<HTMLDivElement>((props, ref) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref || typeof ref === "function") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [ref]);

  return (
    <Box
      ref={ref}
      className={`slide-in ${isVisible ? "visible" : ""}`}
      sx={{
        py: 8,
        px: 4,
        maxWidth: 1200,
        mx: "auto",
        textAlign: "left",
        overflow: "hidden",
        color: "white",
      }}
    >
      <Typography
        variant="h3"
        sx={{
          fontFamily: "Custom-Bold",
          maxWidth: "70%",
          color: "black",
          width: "fit-content",
          p: 2,
          borderRadius: "12px",
          m: "auto",
          mb: 2,
        }}
        fontWeight="bold"
      >
        Why Choose Beyond Resume?
      </Typography>

      <Grid container spacing={4} p={2} justifyContent="center">
        {categories.map((cat, index) => (
          <Grid
            sx={{ display: "flex", justifyContent: "center" }}
            item
            xs={12}
            sm={6}
            md={4}
            key={index}
          >
            <CategoryCard {...cat} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
});

export default BeyondResumeFeatures;

{
  /* <BlobComponent
        right="-20px"
        top="0"
        width={250}
        height={250}
        path={blobPaths[0]}
      />
      <BlobComponent
        right="-120px"
        bottom="-140px"
        width={450}
        height={450}
        path={blobPaths[0]}
      />
      <BlobComponent
        left="-130px"
        top="-80px"
        width={350}
        height={350}
        path={blobPaths[1]}
      />
      <BlobComponent
        left="-130px"
        bottom="-80px"
        width={350}
        height={350}
        path={blobPaths[1]}
      /> */
}
{
  /* <BlobComponent
        top="-150px"
        right="-100px"
        width={300}
        height={300}
        path={blobPaths[1]}
      />
      <BlobComponent
        bottom="-100px"
        left="50%"
        width={400}
        height={400}
        path={blobPaths[0]}
      /> */
}
