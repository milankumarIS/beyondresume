import { Box, Typography } from "@mui/material";
import React from "react";
import { useTheme } from "../../../../components/util/ThemeContext";
import color from "../../../../theme/color";

export const OverviewTab: React.FC<{ companyInfo: any }> = ({
  companyInfo,
}) => {
  const jobStats = [
    {
      value: 24,
      label: "Active Jobs",
      background: "linear-gradient(135deg, #42a5f5, #478ed1)",
    },
    {
      value: 28,
      label: "Pending Jobs",
      background: "linear-gradient(135deg, #ffb74d, #f57c00)",
    },
    {
      value: 12,
      label: "Closed Jobs",
      background: "linear-gradient(135deg, #ab47bc, #7b1fa2)",
    },
  ];

  const { theme } = useTheme();

  return (
    <Box p={2}>
      <Box sx={{ display: "flex", gap: 2, justifyContent: "space-around" }}>
        {jobStats.map((stat, index) => (
          <Box
            sx={{
              // background:
              //   theme === "dark" ? color.jobCardBg : color.jobCardBgLight,
              background: "#2d3436",

              p: 2,
              px: 4,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              gap: 2,
              cursor: "pointer",
                    border: "1px solid #ffffff44",

              // boxShadow: "0px 0px 10px #00000021",
              position: "relative",
            }}
          >
            <Box
              key={index}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                color: "white",
              }}
            >
              <Typography
                sx={{
                  fontFamily: "custom-bold",
                  fontSize: "20px",
                  borderRadius: "50%",
                  background: color.cardBg,
                  width: "40px",
                  height: "40px",
                  textAlign: "center",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  // boxShadow: "0px 0px 20px #00000021",
                  // border: "solid 1px white",
                }}
              >
                {stat.value}
              </Typography>
              <Typography mt={0.5}>{stat.label}</Typography>
            </Box>

            {/* <FontAwesomeIcon icon={faAnglesRight} /> */}
          </Box>
        ))}
      </Box>

      <Typography variant="h6" mb={1} mt={2}>
        About
      </Typography>
      <Typography variant="body1" sx={{ fontFamily: "montserrat-regular" }}>
        {companyInfo.description}
      </Typography>
    </Box>
  );
};
