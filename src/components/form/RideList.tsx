// src/components/RideList.js
import { Box } from "@mui/material";
import React from "react";

const RideList = ({ rides }: any) => {
  return (
    <Box sx={{ padding: "10px" }}>
      <h5 style={{ fontWeight: "bold", marginBottom: "20px" }}>
        Available Rides
      </h5>
      <ul>
        {rides.map(
          (
            ride: { pickup: any[]; dropoff: any[] },
            index: React.Key | null | undefined
          ) => (
            <li key={index}>
              Pickup: {ride.pickup.join(", ")}, Dropoff:{" "}
              {ride.dropoff.join(", ")}
            </li>
          )
        )}
      </ul>
    </Box>
  );
};

export default RideList;
