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
import color from "../../../theme/color";

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
  const totalColor = isTotalValid ? "inherit" : "red";
  const totalMessage =
    totalPercentage < 100
      ? "The total weight is below 100%. Please allocate the remaining percentage across the selected evaluation categories."
      : totalPercentage > 100
      ? "The total weight exceeds 100%. Please reduce the allocation to maintain a valid distribution."
      : "Weights are balanced, You're good to go";

  useEffect(() => {
    const total = selectedCategories.reduce(
      (sum, cat) => sum + (percentages[cat] ?? 0),
      0
    );
    setIsTotalValid(total === 100);
  }, [percentages, selectedCategories, setIsTotalValid]);

  const size = 120;
  const progress = totalPercentage / 100;
  const strokeWidth = 22;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  return (
    <Box textAlign={"center"}>
      <Typography
        gutterBottom
        align="center"
        fontWeight="bold"
        mb={0}
        mt={4}
        fontFamily={"montserrat-regular"}
      >
        Pick the areas our AI should focus on while evaluating candidates. (Max
        10 selections)
      </Typography>

      <Autocomplete
        multiple
        options={allPossibleCategories}
        value={selectedCategories}
        onChange={handleCategoryChange}
        renderInput={(params) => <TextField {...params} />}
        sx={{
          ...commonFormTextFieldSx,
          borderRadius: "12px",
          maxWidth: 700,
          margin: "auto",
          mb: 6,
          mt: 2,
        }}
      />

      <Typography>
        Here's the suggested weights for each evaluation category.
      </Typography>

      <Typography gutterBottom fontFamily={"montserrat-regular"}>
        You can adjust them as needed — just make sure the total adds up to 100%
      </Typography>

      <Box display={'flex'} gap={4} alignItems={'center'} justifyContent={'center'}>

      <Box
      width={'100%'}
        display="flex"
        flexWrap="wrap"
        flexDirection={"column"}
        justifyContent="center"
        sx={{
          borderRadius: "12px",
          p: 2,
        }}
      >
        {selectedCategories.map((category) => (
          <Box
            key={category}
            minWidth={"420px"}
            sx={{
              p: 2,
              px: 4,
              borderRadius: "12px",
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Stack
              direction="column"
              spacing={1}
              alignItems="flex-start"
              minWidth={"200px"}
            >
              <Typography
                fontWeight={600}
                sx={{
                  color: color.titleColor,
                  borderRadius: "12px",
                  fontSize: "0.875rem",
                  textAlign: "left",
                }}
              >
                {category}
              </Typography>
              <Typography variant="body2">
                {getQuestionCount(percentages[category] || 0)} Questions
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
                      background:
                        percentages[category] === mark.value
                          ? color.activeButtonBg
                          : "#ffffff22",
                      color:
                        percentages[category] === mark.value
                          ? "white"
                          : "inherit",
                    }}
                  >
                    {mark.label}
                  </span>
                ),
              }))}
              valueLabelDisplay="auto"
              sx={{ color: "#50bcf6", 
               }}
            />
          </Box>
        ))}
      </Box>

      <Box width={'300px'} textAlign={'center'}>
        <Box sx={{m:'auto', position: "relative", width: size, height: size }}>
          <svg width={size} height={size}>
            <circle
              stroke="#2A2D3E"
              fill="transparent"
              strokeWidth={strokeWidth}
              r={radius}
              cx={size / 2}
              cy={size / 2}
            />
            <circle
              stroke={color.newFirstColor}
              fill="transparent"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              r={radius}
              cx={size / 2}
              cy={size / 2}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          </svg>
          <Typography
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: size,
              height: size,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              fontSize: 16,
              fontWeight: 600,
            }}
          >
            {totalPercentage}%
          </Typography>
        </Box>
        <Typography sx={{fontFamily:'montserrat-regular'}} textAlign={'center'} variant="body2" color={totalColor} mt={1}>
          {totalMessage}
        </Typography>
      </Box>
      </Box>
    </Box>
  );
}
