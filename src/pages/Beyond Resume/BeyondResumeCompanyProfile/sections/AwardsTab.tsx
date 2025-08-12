import React from "react";
import { Grid, Card, CardContent, CardMedia, Typography } from "@mui/material";

interface Award {
  title: string;
  description: string;
  imageURL: string;
}

export const AwardsTab: React.FC<{ awards: Award[] }> = ({ awards }) => {
  return (
    <Grid container spacing={2} p={2}>
      {awards.map((award, idx) => (
        <Grid item xs={12} sm={6} md={4} key={idx}>
          <Card sx={{ borderRadius: 2, height: "100%" }}>
            <CardMedia
              component="img"
              height="180"
              image={award.imageURL}
              alt={award.title}
            />
            <CardContent>
              <Typography variant="h6">{award.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {award.description}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
