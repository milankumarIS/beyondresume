import { Box, Button, Typography } from "@mui/material";
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
      <Box
        sx={{
          display: "flex",
          gap: 2,
          justifyContent: "space-around",
              // boxShadow: "0px 0px 10px #00000021",

          // boxShadow:
          //   "5px 5px 10px rgb(25, 25, 25), -2px -2px 10px rgba(95, 95, 95, 1)",
          p: 2,
          borderRadius: "12px",
          // background: "#2d3436",
          // border: "1px solid #07070744",
        }}
      >
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
              <Button
                sx={{
                  fontFamily: "custom-bold",
                  fontSize: "20px",
                  borderRadius: "50%",
                  background: "#2d3436",
                  minWidth: 0,
                  width: "40px",
                  height: "40px",
                  textAlign: "center",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow:
                    "5px 5px 10px rgb(25, 25, 25), -2px -2px 10px rgba(95, 95, 95, 1)",
                  transition: "all 0.3s ease",

                  "&:hover": {
                    // background: '#ebebeb',
                    // color: "#000000ff",
                    transform: "translateY(-4px) scale(1.05)",
                    // boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
                  },
                  // border: "solid 1px white",
                }}
              >
                {stat.value}
              </Button>
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
