import React from "react";
import { Grid, Card, CardMedia } from "@mui/material";

export const GalleryTab: React.FC<{ images: string[] }> = ({ images }) => {
  return (
    <Grid container spacing={2} p={2}>
      {images.map((img, idx) => (
        <Grid item xs={12} sm={6} md={4} key={idx}>
          <Card sx={{ borderRadius: 2, overflow: "hidden" }}>
            <CardMedia
              component="img"
              height="200"
              image={img}
              alt={`Gallery ${idx + 1}`}
            />
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
