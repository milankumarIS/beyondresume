import { Box, Typography, List, ListItem } from "@mui/material";
import { AnyCnameRecord } from "dns";
import React from "react";

export const OverviewTab: React.FC<{ companyInfo: any }> = ({
  companyInfo,
}) => {
  return (
    <Box p={2}>
      <Typography variant="body1">{companyInfo.description}</Typography>
      <Typography variant="h6" mt={2}>
        Specializations
      </Typography>
      <List>
        {["Software Development", "Cloud Computing", "Cybersecurity", "AI"].map(
          (s, i) => (
            <ListItem key={i}>{s}</ListItem>
          )
        )}
      </List>
    </Box>
  );
};
