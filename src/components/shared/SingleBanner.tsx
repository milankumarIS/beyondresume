import { Box, Typography } from "@mui/material";
import color from "../../theme/color";

const SingleBanner = ({ title, height }: any) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        // width: "100%",
        position: "relative",
        // height: height ? height : "150px",
        overflow: "hidden",
        padding: "12px",
        color: "#fff",
        backgroundColor: color.primery,
        borderRadius: "12px",
        mx:2,
      }}
    >
      <Typography variant="h4" sx={{ marginBlock: "auto" }}>
        {title}
      </Typography>
    </Box>
  );
};

export default SingleBanner;
