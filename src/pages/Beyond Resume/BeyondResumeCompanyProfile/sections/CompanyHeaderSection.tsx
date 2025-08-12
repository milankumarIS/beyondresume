import { Box, Typography, Avatar } from "@mui/material";
import React from "react";

interface Props {
  companyInfo: any;
}

export const CompanyHeaderSection: React.FC<Props> = ({ companyInfo }) => {
  return (
    <Box>
      {/* <Box
        sx={{
          height: 200,
          backgroundImage: `url(${companyInfo.bannerUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      /> */}
      <Box sx={{ display: "flex", alignItems: "center", p: 2 }}>
        <Avatar
          src={companyInfo.logoUrl}
          sx={{ width: 100, height: 100, mr: 2, border: "2px solid white" }}
        />
        <Box>
          <Typography variant="h5">{companyInfo.industryName}</Typography>
          <Typography variant="body2" color="text.secondary">
            {companyInfo.headquarters.city}, {companyInfo.headquarters.state},{" "}
            {companyInfo.headquarters.country}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
