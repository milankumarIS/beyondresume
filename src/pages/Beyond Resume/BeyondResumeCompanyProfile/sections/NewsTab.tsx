import React from "react";
import { Grid, Card, CardContent, CardMedia, Typography, Link } from "@mui/material";

interface NewsItem {
  title: string;
  description: string;
  imageURL: string;
}

export const NewsTab: React.FC<{ news: NewsItem[] }> = ({ news }) => {
  return (
    <Grid container spacing={2} p={2}>
      {news.map((item, idx) => (
        <Grid item xs={12} sm={6} md={4} key={idx}>
          <Card sx={{ borderRadius: 2, height: "100%" }}>
            <CardMedia
              component="img"
              height="180"
              image={item.imageURL}
              alt={item.title}
            />
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {item.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {item.description}
              </Typography>
              <Link href={item.imageURL} target="_blank" rel="noopener">
                Read More
              </Link>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
