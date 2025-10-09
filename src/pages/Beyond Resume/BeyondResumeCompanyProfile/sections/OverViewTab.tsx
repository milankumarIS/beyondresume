import { Box, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTheme } from "../../../../components/context/ThemeContext";
import { getUserId, getUserName } from "../../../../services/axiosClient";
import { brAnalytics } from "../../../../services/services";

export const OverviewTab: React.FC<{ companyInfo: any }> = ({
  companyInfo,
}) => {
  const [jobsData, setJobsData] = useState<any>({});

  useEffect(() => {
    const fetchJobsData = async () => {
      try {
        const res1 = await brAnalytics({ userName: getUserName() });
        setJobsData(res1?.data?.data);
        
      } catch (error) {
        console.error("Error fetching job stats:", error);
      }
    };

    fetchJobsData();
  }, []);

  // Map API response to jobStats
  const jobStats = [
    {
      value: jobsData?.totalActiveJobPostedByUser ?? 0,
      label: "Active Jobs",
      background: "linear-gradient(135deg, #42a5f5, #478ed1)",
    },
    {
      value: jobsData?.totalJobPostedByUser ?? 0,
      label: "Total Jobs",
      background: "linear-gradient(135deg, #ffb74d, #f57c00)",
    },
    {
      value: jobsData?.totalApplicant ?? 0,
      label: "Total Candidates",
      background: "linear-gradient(135deg, #ab47bc, #7b1fa2)",
    },
  ];

  const { theme } = useTheme();

  return (
    <Box p={2} pt={0}>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          justifyContent: "space-around",
          p: 2,
          borderRadius: "12px",
        }}
      >
        {jobStats.map((stat, index) => (
          <Box
            sx={{
              border: "solid 1px white",
              boxShadow: "0px 0px 10px #00000021",
              p: 2,
              px: 4,
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              gap: 2,
              cursor: "pointer",
              position: "relative",
            }}
          >
            <Box
              key={index}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                color: "inherit",
              }}
            >
              <Button
                sx={{
                  fontFamily: "custom-bold",
                  fontSize: "20px",
                  borderRadius: "50%",
                  border: "1px solid #ffffffff",
                  minWidth: 0,
                  width: "40px",
                  height: "40px",
                  textAlign: "center",
                  color: "inherit",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0px 0px 10px #00000021",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    border: "none",
                    transform: "translateY(-4px) scale(1.05)",
                    background: "black",
                    color: "white",
                  },
                }}
              >
                {stat.value}
              </Button>
              <Typography mt={0.5}>{stat.label}</Typography>
            </Box>
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
