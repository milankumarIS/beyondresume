import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Grid,
    Tab,
    Tabs,
    Typography,
} from "@mui/material";
import { useState } from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    LabelList,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
// import { CustomTooltip } from "../../Daily Education/Components/StudentGraphCanvas";

type MCQOption = {
  [key: string]: string;
};

type Question = {
  categoryName: string;
  question: string;
  suggestedAnswer: string;
  AnswerKey: string;
  userAnswer: string;
  isCorrect?: boolean;
  score?: number;
  options?: { [key: string]: string }[];
};

type GroupedQuestions = {
  [category: string]: Question[];
};

type Props = {
  groupedQuestions: GroupedQuestions;
};

export default function BeyondResumeInterviewOverviewQA({
  groupedQuestions,
}: Props) {
  const [selectedCategory, setSelectedCategory] = useState(
    Object.keys(groupedQuestions)[0]
  );

  const chartData = Object.entries(groupedQuestions).map(
    ([category, questions]) => {
      const totalScore = questions.reduce((acc, q) => acc + (q.score || 0), 0);
      const maxScore = questions.length * 10;
      const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
      return { category, score: Math.round(percentage) };
    }
  );
// console.log(groupedQuestions)
  const handleTabChange = (event, newValue) => {
    setSelectedCategory(newValue);
  };

  const renderScoreSummary = () => {
    const questions = groupedQuestions[selectedCategory] || [];
    const totalQuestions = questions.length;
    const correct = questions.filter((q) => q.isCorrect).length;
    const wrong = questions.filter((q) => q.userAnswer && !q.isCorrect).length;
    const notAnswered = questions.filter((q) => !q.userAnswer).length;

    const pieData = [
      { name: "Correct", value: correct, color: "#00C853" },
      { name: "Wrong", value: wrong, color: "#D32F2F" },
      { name: "Not Answered", value: notAnswered, color: "#FFAB00" },
    ];

    return (
      <Box
        px={2}
        mb={3}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={80}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell
                  style={{ fontFamily: "custom-regular" }}
                  key={`cell-${index}`}
                  fill={entry.color}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <Box
          mt={2}
          color="white"
          minWidth={"300px"}
          display={"flex"}
          flexDirection={"column"}
          gap={1}
        >
          <Typography
            variant="body2"
            sx={{
              background: "linear-gradient(180deg, #50bcf6, #5a81fd)",
              width: "fit-content",
              px: 2,
              borderRadius: "4px",
            }}
          >
            Total Questions: {totalQuestions}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              background: "#00C853",
              width: "fit-content",
              px: 2,
              borderRadius: "4px",
            }}
          >
            Correct Answers: {correct}
          </Typography>
          <Typography
            sx={{
              background: "#D32F2F",
              width: "fit-content",
              px: 2,
              borderRadius: "4px",
            }}
            variant="body2"
          >
            Wrong Answers: {wrong}
          </Typography>
          <Typography
            sx={{
              background: "#FFAB00",
              width: "fit-content",
              px: 2,
              borderRadius: "4px",
            }}
            variant="body2"
          >
            Not Answered: {notAnswered}
          </Typography>
        </Box>
      </Box>
    );
  };

  return (
    <Box mt={4}>
      <Typography variant="h6"  mb={2}>
        Performance Graph
      </Typography>

      <ResponsiveContainer
        width="100%"
        height={300}
        style={{
          background: "linear-gradient(145deg, #0d0d0d, #2D3436)",
          border: "solid 1px",
          padding: "12px 0px",
          borderRadius: "12px",
          paddingTop: "24px",
        }}
      >
        <BarChart
          data={chartData}
          style={{
            margin: "12px",
            marginLeft: "-24px",
          }}
        >
          <CartesianGrid
            stroke="rgba(204, 204, 204, 0.31)"
            vertical={false}
            horizontal={true}
          />
          <XAxis
            dataKey="category"
            stroke="#ffffff"
            tick={{
              fill: "#ffffff",
              fontSize: 12,
              fontFamily: "custom-bold",
            }}
          />
          <YAxis
            stroke="#ffffff"
            domain={[0, 100]}
            tick={{
              fill: "#ffffff",
              fontSize: 12,
              fontFamily: "custom-bold",
            }}
            tickFormatter={(tick) => `${tick}%`}
          />

          {/* <Tooltip content={<CustomTooltip bgColor="#50bcf6" showPercent />} /> */}

          <Bar
            stroke="white"
            strokeWidth={2}
            dataKey="score"
            fill="#50bcf6"
            style={{ fontFamily: "custom-regular" }}
          >
            <LabelList
              dataKey="score"
              position="top"
              content={({ value, x, y, width }) => {
                if (value === 0 || value == null) {
                  const numX = typeof x === "number" ? x : parseFloat(x || "0");
                  const numY = typeof y === "number" ? y : parseFloat(y || "0");
                  const numWidth =
                    typeof width === "number"
                      ? width
                      : parseFloat(width || "0");

                  return (
                    <text
                      x={numX + numWidth / 2}
                      y={numY - 5}
                      fill="white"
                      textAnchor="middle"
                      fontSize={12}
                      fontFamily="custom-regular"
                    >
                      No Data
                    </text>
                  );
                }
                return null;
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <Tabs
        value={selectedCategory}
        onChange={handleTabChange}
        variant="scrollable"
        allowScrollButtonsMobile
        sx={{
          mt: 4,
          mb: 2,
          "& .MuiTab-root": {
            color: "white",
            background: "#2d3436",
            borderRadius: "20px",
            marginRight: "8px",
            paddingX: "16px",
            textTransform: "none",
            border: "1px solid #ffffff44",
          },
          "& .Mui-selected": {
            background: "linear-gradient(180deg, #50bcf6, #5a81fd)",
            color: "white !important",
          },
          "& .MuiTabs-indicator": {
            backgroundColor: "transparent",
          },
        }}
      >
        {Object.keys(groupedQuestions).map((category) => (
          <Tab key={category} value={category} label={category} />
        ))}
      </Tabs>

      <Box px={2}>
        {/* <Typography variant="subtitle1" color="white" mb={1}>
          Total Score:{" "}
          {groupedQuestions[selectedCategory]?.reduce(
            (acc, q) => acc + (q.score || 0),
            0
          ) || 0}{" "}
          / {(groupedQuestions[selectedCategory]?.length || 0) * 10}
        </Typography> */}

        {renderScoreSummary()}

        {groupedQuestions[selectedCategory]?.map((item, index) => {
          let borderColor = "yellow";
          let textColor = "black";
          let statusText = "Ans Not Given";

          if (item.userAnswer) {
            if (item.isCorrect) {
              borderColor = "#00C853";
              statusText = "Right Ans";
              textColor = "#ffffff";
            } else {
              borderColor = "#D32F2F";
              statusText = "Wrong Ans";
              textColor = "#ffffff";
            }
          }

          return (
            <Accordion
              key={index}
              style={{
                marginTop: "12px",
                boxShadow: "none",
                background: "linear-gradient(145deg, #0d0d0d, #2D3436)",
                border: `2px solid ${borderColor}`,
                borderRadius: "12px",
                color: "white",
                padding: "12px",
                position: "relative",
                overflow: "hidden",
              }}
              sx={{
                "&.MuiAccordion-root::before": {
                  content: '""',
                  height: "0px",
                },
              }}
            >
              <AccordionSummary
                sx={{
                  "& .MuiAccordionSummary-content": {
                    margin: 0,
                  },
                  "& .MuiAccordionSummary-content.Mui-expanded": {
                    margin: 0,
                  },
                  "& .MuiAccordionSummary-root": {
                    minHeight: 0,
                  },
                }}
                expandIcon={
                  <FontAwesomeIcon
                    style={{ color: "white" }}
                    icon={faChevronDown}
                  />
                }
              >
                <Typography
                  sx={{
                    position: "absolute",
                    top: -14,
                    right: -14,
                    py: 0.4,
                    fontSize: "10px",
                    background: borderColor,
                    px: 1,
                    borderRadius: "0px 0px 4px 4px",
                    color: textColor,
                  }}
                >
                  {statusText}
                </Typography>
                <Typography fontWeight={600}>
                  {index + 1}. {item.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {item.options && (
                  <Box>
                    <Typography variant="subtitle2">Options:</Typography>
                    <ul style={{ paddingLeft: 16, margin: "4px" }}>
                      {item.options.map((opt, idx) => {
                        const [key, value] = Object.entries(opt)[0];
                        const isCorrect = key === `Option ${item.AnswerKey}`;
                        const isUserAnswer =
                          key === `Option ${item.userAnswer}`;

                        return (
                          <li
                            key={idx}
                            style={{
                              backgroundColor: isCorrect
                                ? "#00C853"
                                : isUserAnswer
                                ? "#FF6F00"
                                : "transparent",
                              padding: "4px 8px",
                              borderRadius: "6px",
                              color:
                                isCorrect || isUserAnswer ? "white" : "inherit",
                              fontWeight: isCorrect ? "bold" : "normal",
                              width: "fit-content",
                            }}
                          >
                            <strong>{key}:</strong> {value}
                          </li>
                        );
                      })}
                    </ul>
                  </Box>
                )}
                <Grid container spacing={2} >
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" mb={0.5}>
                      Suggested Answer:
                    </Typography>
                    <Typography variant="body2">
                      {item.suggestedAnswer}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" mb={0.5}>
                      Your Answer:
                    </Typography>
                    <Typography variant="body2">
                      {item.userAnswer || "No Answer Given"}
                    </Typography>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Box>
    </Box>
  );
}
