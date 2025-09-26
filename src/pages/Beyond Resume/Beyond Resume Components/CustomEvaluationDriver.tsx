import {
  Autocomplete,
  Box,
  CircularProgress,
  Slider,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { commonFormTextFieldSx } from "../../../components/util/CommonFunctions";
import {
  BeyondResumeButton
} from "../../../components/util/CommonStyle";
import { getUserAnswerFromAi } from "../../../services/services";
import color from "../../../theme/color";

const allPossibleCategories = [
  "Agility & Resilience",
  "Critical Insight",

  "Solution Mindset",

  "Decisive Judgment",

  "People Intelligence",

  "Collaborative Impact",

  "Time Mastery",

  "Creative Ingenuity",
  "Technical Mastery",
  "Cognitive Excellence",
  "Impactful Communication & Collaboration",
  "Leadership & Drive",
  "Cultural Alignment & Integrity",
  "Expertise & Mastery",
  "Strategic Thinking",
  "Collaboration & Influence",
  "Leadership Impact",
  "Values & Integrity",

  "Constructive Resolution",

  "Performance Efficiency",

  "Strategic Visioning",

  "Inspired Drive",

  "Precision & Accuracy",

  "Innovative Mindset",

  "Accountability Mindset",

  "Responsible Leadership",

  "Talent Development",

  "Tech Visionary Leadership",

  "Composure Under Pressure",

  "Customer-Centric Mindset",

  "Future-Driven Vision",

  "Continuous Learning Agility",

  "Strategic Planning",

  "Persuasive Negotiation",

  "Risk Intelligence",

  "Stakeholder Influence",

  "Impact Orientation",

  "Commercial Acumen",

  "Integrity in Action",

  "Influence & Conviction",

  "Focused Prioritization",

  "Synergistic Collaboration",

  "Growth Mindset",

  "Executive Presence",

  "Strategic Influence",

  "Reflective Awareness",

  "Relentless Results Drive",

  "Global Perspective",

  "Operational Excellence",

  "Quality Obsession",

  "Process Excellence",
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
  roundData?: any;
}

export default function CustomEvaluationDriver({
  selectedTabIndex,
  percentages,
  setPercentages,
  setIsTotalValid,
  roundData,
}: CustomEvaluationDriverProps) {
  const selectedDuration = durationTabs[selectedTabIndex] ?? 20;
  const [loading, setLoading] = useState(false);
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
      : "Great balance! Candidates will be scored fairly across your chosen skills.";

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

  const handleGenerateCategories = async () => {
    setLoading(true);
    const fullCommand = `
  Given this interview round:
  - Name: ${roundData?.name || "N/A"}
  - Purpose: ${roundData?.purpose || "N/A"}
  
  Generate exactly 5 evaluation categories relevant to this round. Based upon these categories our system will generate further interview questions.
  So make these categories relevant.
  Return them as a simple JSON object where each key is the category name and each value is 20.
  Make sure total = 100.
  Example:
  {
    "Cognitive Ability": 20,
    "Communication & Collaboration": 20,
    "Cultural Fit & Integrity": 20,
    "Leadership & Initiative": 20,
    "Technical Competence": 20
  }
  `;

    try {
      const aiRes = await getUserAnswerFromAi({ question: fullCommand });
      const rawText =
        aiRes?.data?.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const cleanedText = rawText.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleanedText);
      setSelectedCategories(Object.keys(parsed));
      setLoading(false);
      setPercentages(parsed);
    } catch (err) {
      console.error("Failed to generate categories:", err);
    }
  };

  return (
    <Box textAlign={"center"}>
      <Typography
        gutterBottom
        align="center"
        fontWeight="bold"
        mb={0}
        mt={4}
        // fontFamily={"montserrat-regular"}
      >
        Which skills and qualities matter most for this round? (Pick up to 10)
      </Typography>

      <Box display={"flex"}>
        <Autocomplete
          multiple
          options={allPossibleCategories}
          value={selectedCategories}
          onChange={handleCategoryChange}
          renderInput={(params) => (
            <>
              <TextField {...params} />
            </>
          )}
          sx={{
            ...commonFormTextFieldSx,
            borderRadius: "12px",
            maxWidth: 700,
            margin: "auto",
            mb: 2,
            mt: 2,
            py: 1,
            pt: 1.5,
          }}
        />
      </Box>

      <BeyondResumeButton
        variant="contained"
        onClick={handleGenerateCategories}
        sx={{
          mb: 4,
          mt: 1,
          textTransform: "none",
          fontSize: "12px",
          borderRadius: "999px",
        }}
      >
        {" "}
        {loading ? (
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            color={"white"}
            gap={2}
          >
            Analyzing <CircularProgress sx={{ color: "white" }} size={18} />
          </Box>
        ) : (
          "Let our system generate relevant categories"
        )}
      </BeyondResumeButton>

      <Typography>
        Here’s our recommended scoring split across categories.
      </Typography>

      <Typography
        gutterBottom
        variant="body2"
        fontFamily={"montserrat-regular"}
      >
        Adjust freely to match your hiring priorities, just make sure the total
        equals 100%.
      </Typography>

      <Box
        display={"flex"}
        gap={4}
        alignItems={"center"}
        justifyContent={"center"}
        flexDirection={{ xs: "column", md: "row" }}
      >
        <Box
          width={"100%"}
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
              // minWidth={"420px"}
              flexDirection={{ xs: "column", md: "row" }}
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
                alignItems={{ xs: "center", md: "flex-start" }}
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
                onChange={(e, val) =>
                  handleSliderChange(category, val as number)
                }
                min={0}
                max={100}
                step={1}
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
                // components={{ Thumb: CustomThumbComponent }}
                valueLabelDisplay="auto"
                sx={{
                  color: "#50bcf6",
                  "& .MuiSlider-thumb": {
                    width: 24,
                    height: 24,
                    backgroundColor: "#fff",
                    border: "2px solid #50bcf6",
                  },
                }}
              />
            </Box>
          ))}
        </Box>

        <Box width={"300px"} textAlign={"center"}>
          <Box
            sx={{ m: "auto", position: "relative", width: size, height: size }}
          >
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
                stroke={totalPercentage !== 100 ? "red" : "green"}
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
          <Typography
            sx={{ fontFamily: "montserrat-regular" }}
            textAlign={"center"}
            variant="body2"
            color={totalColor}
            mt={1}
          >
            {totalMessage}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
