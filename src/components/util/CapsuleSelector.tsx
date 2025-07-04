import { faAdd, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, IconButton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

interface Capsule {
  id: number;
  label: string;
}

interface CapsuleSelectorProps {
  capsules: Capsule[];
  onCapsuleSelect: (selectedCapsules: Capsule[]) => void;
  preselectedCapsules?: Capsule[]; // New Prop for Preselected Capsules
}

const CapsuleSelector: React.FC<CapsuleSelectorProps> = ({
  capsules,
  onCapsuleSelect,
  preselectedCapsules = [], // Default to empty array
}) => {
  const [selectedCapsules, setSelectedCapsules] = useState<Capsule[]>([]);

  // Initialize state with preselected capsules
  useEffect(() => {
    setSelectedCapsules(preselectedCapsules);
  }, [preselectedCapsules]);

  const handleAddCapsule = (capsule: Capsule) => {
    if (!selectedCapsules.some((item) => item.id === capsule.id)) {
      setSelectedCapsules((prev) => [...prev, capsule]);
    }
  };

  const handleRemoveCapsule = (capsuleId: number) => {
    setSelectedCapsules((prev) =>
      prev.filter((capsule) => capsule.id !== capsuleId)
    );
  };

  return (
    <Box>
      {/* Selected Capsules Display */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          mb: 2,
          p: 2,
          border: "1px solid #ccc",
          borderRadius: "8px",
          boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.2)",
        }}
      >
        {selectedCapsules.map((capsule, index) => (
          <Box
            key={capsule.id}
            sx={{
              backgroundColor: "#0a5c6b",
              padding: "8px 16px",
              borderRadius: "5px",
              color: "#fff",
              fontWeight: "bold",
              gap: 1,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {capsule.label}
            <IconButton color="inherit">
              <FontAwesomeIcon
                style={{ fontSize: "1.1rem" }}
                icon={faXmark}
                onClick={() => handleRemoveCapsule(capsule.id)}
              ></FontAwesomeIcon>
            </IconButton>
          </Box>
        ))}
        {selectedCapsules.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            Nothing added yet
          </Typography>
        )}
      </Box>

      {/* Capsule Selection Buttons */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 4 }}>
        {capsules.map((capsule) => (
          <Button
            key={capsule.id}
            onClick={() => handleAddCapsule(capsule)}
            sx={{
              fontSize: "0.8rem",
              backgroundColor: "#0a5c6b",
              color: "#fff",
              padding: "8px 16px",
              borderRadius: "5px",
              gap: 1,
              "&:hover": {
                backgroundColor: "#0a5c6b",
                opacity: 0.8,
              },
            }}
            // disabled={selectedCapsules.some((item) => item.id === capsule.id)}
            disabled={selectedCapsules.some((item) => item.id === capsule.id)}
          >
            {capsule.label}
            <FontAwesomeIcon
              style={{ fontSize: "1.1rem" }}
              icon={faAdd}
            ></FontAwesomeIcon>
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default CapsuleSelector;
