import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Slider,
  Autocomplete,
  TextField,
  Stack,
} from "@mui/material";
import { commonFormTextFieldSx } from "../../../components/util/CommonFunctions";

const defaultCategories = [
  "Technical Competence",
  "Cognitive Ability",
  "Communication & Collaboration",
  "Leadership & Initiative",
  "Cultural Fit & Integrity",
];

const allPossibleCategories = [
  ...defaultCategories,
  "Adaptability",
  "Analytical Thinking",
  "Problem Solving",
  "Decision Making",
  "Emotional Intelligence",
  "Teamwork",
  "Time Management",
  "Creativity",
  "Conflict Resolution",
  "Productivity",
  "Strategic Thinking",
  "Motivation",
  "Attention to Detail",
  "Innovation",
  "Ownership",
  "Accountability",
  "Mentoring",
  "Technical Leadership",
  "Stress Management",
  "Customer Orientation",
  "Vision",
  "Learning Agility",
  "Planning",
  "Negotiation",
  "Risk Management",
  "Stakeholder Management",
  "Result Orientation",
  "Business Acumen",
  "Ethical Judgement",
  "Persuasiveness",
  "Prioritization",
  "Collaboration",
  "Open-mindedness",
  "Presentation Skills",
  "Influence",
  "Self-awareness",
  "Drive for Results",
  "Global Mindset",
  "Execution Excellence",
  "Passion for Quality",
  "Process Orientation",
];

const durationTabs = [20, 40, 60] as const;

const marks = [
  { value: 0, label: "0%" },
  { value: 20, label: "20%" },
  { value: 40, label: "40%" },
  { value: 60, label: "60%" },
  { value: 80, label: "80%" },
  { value: 100, label: "100%" },
];

interface CustomEvaluationDriverProps {
  selectedTabIndex: number;
  percentages: Record<string, number>;
  setPercentages: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  setIsTotalValid: (valid: boolean) => void;
}

export default function CustomEvaluationDriver({
  selectedTabIndex,
  percentages,
  setPercentages,
  setIsTotalValid,
}: CustomEvaluationDriverProps) {
  const selectedDuration = durationTabs[selectedTabIndex] ?? 20;

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    Object.keys(percentages)
  );

  const getQuestionCount = (percentage: number) => {
    const maxQuestions = selectedDuration / 2;
    return Math.round((percentage / 100) * maxQuestions);
  };

  // Even distribution helper
  const distributeEvenly = (updated: Record<string, number>) => {
    const categories = Object.keys(updated);
    const base = Math.floor(100 / categories.length);
    const remainder = 100 - base * categories.length;

    const newPercentages: Record<string, number> = {};
    categories.forEach((cat, idx) => {
      newPercentages[cat] = base + (idx < remainder ? 1 : 0);
    });

    setPercentages(newPercentages);
  };

  const handleCategoryChange = (event: any, newCategories: string[]) => {
    if (newCategories.length > 10) return;

    setSelectedCategories(newCategories);

    const updated: Record<string, number> = {};
    newCategories.forEach((cat) => {
      updated[cat] = percentages[cat] ?? 0;
    });

    distributeEvenly(updated);
  };

  const handleSliderChange = (category: string, newValue: number) => {
    setPercentages((prev) => ({
      ...prev,
      [category]: newValue,
    }));
  };

  const totalPercentage = selectedCategories.reduce(
    (sum, cat) => sum + (percentages[cat] ?? 0),
    0
  );

  const isTotalValid = totalPercentage === 100;
  const totalColor = isTotalValid ? "green" : "red";
  const totalMessage =
    totalPercentage < 100
      ? "The total weight is below 100%. Please allocate the remaining percentage across the selected evaluation categories."
      : totalPercentage > 100
      ? "The total weight exceeds 100%. Please reduce the allocation to maintain a valid distribution."
      : "All evaluation weights are correctly distributed. You may proceed.";

  useEffect(() => {
    const total = selectedCategories.reduce(
      (sum, cat) => sum + (percentages[cat] ?? 0),
      0
    );
    setIsTotalValid(total === 100);
  }, [percentages, selectedCategories, setIsTotalValid]);

  return (
    <Box>
      <Typography
        gutterBottom
        align="center"
        fontWeight="bold"
        color="black"
        my={2}
        mt={4}
      >
        Customised Evaluation Driver
      </Typography>

      <Autocomplete
        multiple
        options={allPossibleCategories}
        value={selectedCategories}
        onChange={handleCategoryChange}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select Evaluation Categories (max 10 selections)"
          />
        )}
        sx={{
          ...commonFormTextFieldSx,
          borderRadius: "12px",
          maxWidth: 700,
          margin: "auto",
          my: 3,
        }}
      />

      <Box
        display="flex"
        flexWrap="wrap"
        justifyContent="center"
        gap={2}
        sx={{
          boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.10)",
          borderRadius: "12px",
          p: 2,
        }}
      >
        {selectedCategories.map((category) => (
          <Box
            key={category}
            minWidth={"420px"}
            maxWidth={"400px"}
            sx={{
              p: 3,
              px: 4,
              borderRadius: "12px",
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center" mb={1}>
              <Typography
                fontWeight={600}
                color="white"
                sx={{
                  background: "linear-gradient(180deg, #50bcf6, #5a81fd)",
                  borderRadius: "12px",
                  px: 1,
                  py: 0.5,
                  fontSize: "0.875rem",
                }}
              >
                {category}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                ({getQuestionCount(percentages[category] || 0)} Qs)
              </Typography>
            </Stack>
            <Slider
              value={percentages[category] || 0}
              onChange={(e, val) => handleSliderChange(category, val as number)}
              min={0}
              max={100}
              step={10}
              marks={marks.map((mark) => ({
                ...mark,
                label: (
                  <span
                    style={{
                      padding: "2px 10px",
                      borderRadius: "12px",
                      backgroundColor:
                        percentages[category] === mark.value
                          ? "#50bcf6"
                          : "#ffffff22",
                      color:
                        percentages[category] === mark.value
                          ? "white"
                          : "#50bcf6",
                    }}
                  >
                    {mark.label}
                  </span>
                ),
              }))}
              valueLabelDisplay="auto"
              sx={{ color: "#50bcf6", mt: 1 }}
            />
          </Box>
        ))}
      </Box>
      <Box
        textAlign="center"
        mt={4}
        sx={{
          boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.10)",
          borderRadius: "12px",
          p: 2,
          width: "fit-content",
          mx: "auto",
        }}
      >
        <Typography fontWeight="bold" color={totalColor}>
          Total: {totalPercentage}%
        </Typography>
        <Typography variant="body2" color={totalColor} mt={1}>
          {totalMessage}
        </Typography>
      </Box>
    </Box>
  );
}
