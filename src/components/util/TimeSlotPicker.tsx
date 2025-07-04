import React, { useState } from "react";
import { Box, Button, Grid } from "@mui/material";

interface TimeSlotPickerProps {
  takenSlots: string[];
  onSlotSelect: (slot: string) => void;
  availability: any
}

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  takenSlots,
  onSlotSelect,
  availability
}) => {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  // console.log('dfgb', selectedSlot)


  const generateTimeSlots = (): string[] => {
    const slots: string[] = [];
  
    if (!availability?.availableFrom || !availability?.availableTo) {
      // console.error("Invalid availability data");
      return slots;
    }

    // console.log('nb', takenSlots)
  
    const [fromHours, fromMinutes, fromSeconds] = (availability?.availableFrom || "00:00:00").split(":").map(Number);
    const [toHours, toMinutes, toSeconds] = (availability?.availableTo || "00:00:00").split(":").map(Number);
  
    let currentTime = new Date();
    currentTime.setHours(fromHours, fromMinutes, fromSeconds || 0, 0);
  
    const endTime = new Date();
    endTime.setHours(toHours, toMinutes, toSeconds || 0, 0);
  
    while (currentTime <= endTime) {
      const slotTime = currentTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      slots.push(slotTime);
      currentTime.setMinutes(currentTime.getMinutes() + 30);
    }
  
    return slots;
  };
  
  

  const timeSlots = generateTimeSlots();

  const handleSlotClick = (slot: string) => {
    if (!takenSlots.includes(slot)) {
      setSelectedSlot(slot);
      onSlotSelect(slot);
    }
  };

  return (
    <Grid
      container
      spacing={1}
      sx={{ display: "flex", gap: 2, my: 1, justifyContent: "center" }}
    >
      {timeSlots.map((slot) => (
        <Box key={slot}>
          <Button
            // variant="contained"
            style={{
              color:
                selectedSlot === slot
                  ? "white"
                  : !takenSlots.includes(slot)
                    ? "black"
                    : "white",
              background:
                selectedSlot === slot
                  ? "#0a5c6b"
                  : !takenSlots.includes(slot)
                    ? "white"
                    : "#d7d7d7",
              border:
                selectedSlot === slot
                  ? "solid 1.5px #0a5c6b"
                  : !takenSlots.includes(slot)
                    ? "solid 1.5px #0a5c6b"
                    : "none",
            }}
            onClick={() => handleSlotClick(slot)}
            disabled={takenSlots.includes(slot)}
          >
            {slot}
          </Button>
        </Box>
      ))}
    </Grid>
  );
};

export default TimeSlotPicker;
