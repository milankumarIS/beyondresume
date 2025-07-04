import { Box, Button, Modal, Rating, Typography } from "@mui/material";
import React, { useState } from "react";
import { updateByIdDataInTable } from "../../services/services";

interface RatingModalProps {
  open: boolean;
  handleClose: () => void;
  givenBy?: string;
  rated?: number;
  primeryKey?: string;
  openSnackBar: (message: string) => void;
  forService?: string;
}

const RatingModal: React.FC<RatingModalProps> = ({
  open,
  handleClose,
  givenBy,
  rated,
  primeryKey,
  openSnackBar,
  forService,
}) => {
  const [value, setValue] = useState<number | null>(rated ? rated : 4);

  const handleSubmit = () => {
    if (forService === "DAILYRIDE") {
      updateByIdDataInTable(
        "trips",
        primeryKey,
        givenBy === "driver"
          ? { customerRating: value }
          : { driverRating: value },
        "tripsId"
      )
        .then((result: any) => {
          openSnackBar(result?.data?.msg);
          handleClose();
        })
        .catch((error) => {
          handleClose();
          openSnackBar(error?.response?.data?.msg);
        });
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        // minHeight="100vh"
        bgcolor="white"
        p={3}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "400px",
          margin: "auto",
          boxShadow: 24,
          borderRadius: 2,
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{ color: "#0a5c6b", fontWeight: "bold", mb: 2 }}
        >
          How would you rate our service?
        </Typography>
        {/* <Typography variant="body1" sx={{ mb: 2,color:color.textColor,mt:1 }}>
          Select rating
        </Typography> */}
        <Rating
          name="course-rating"
          value={value}
          precision={0.5}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
          size="large"
          sx={{ color: "#0a5c6b" }}
        />

        <Button
          id="button"
          variant="contained"
          onClick={handleSubmit}
          style={{
            marginTop: "30px",
            backgroundColor: "#0a5c6b",
          }}
          sx={{
            marginTop: 4,
            ml: "auto",
            color: "white",
            fontWeight: "bold",
            textTransform: "none",
          }}
        >
          Submit
        </Button>
      </Box>
    </Modal>
  );
};

export default RatingModal;
