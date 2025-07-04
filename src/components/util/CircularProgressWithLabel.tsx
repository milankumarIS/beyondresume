import React from "react";
import { CircularProgress, Box, Typography } from "@mui/material";
import color from "../../theme/color";

interface CircularProgressWithLabelProps {
  value: number;
  size: number;
  fontSize: number;
  textcolor: string;
  circlecolor: string;
  label?: string;
}

const CircularProgressWithLabel: React.FC<CircularProgressWithLabelProps> = ({
  value,
  size,
  fontSize,
  textcolor,
  label,
  circlecolor,
}) => {
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress
        size={size}
        sx={{ position: "absolute" }}
        variant="determinate"
        value={100}
        style={{ color: color.secondColor }}
      />
      <CircularProgress
        size={size}
        variant="determinate"
        value={value}
        sx={{ color: circlecolor }}
      />
      <Box
        top={0}
        left={2}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography
          fontWeight={"bold"}
          fontSize={fontSize}
          variant="caption"
          component="div"
          color={textcolor}
        >{`${Math.round(value)}%`}</Typography>
      </Box>

      <Box
        top={0}
        left={1}
        bottom={-40}
        right={0}
        position="absolute"
        display="flex"
        alignItems="end"
        justifyContent="center"
      >
        <Typography
          fontSize={fontSize}
          variant="caption"
          component="div"
          style={{ color: color.firstColor, fontWeight: "bold" }}
        >
          {label}
        </Typography>
      </Box>
    </Box>
  );
};

export default CircularProgressWithLabel;
