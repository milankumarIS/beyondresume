import { faArrowCircleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Button,
  CircularProgress,
  Slider,
  Tab,
  Tabs,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useHistory, useLocation } from "react-router";
import {
  evaluationCategories,
  experienceLevels,
  jobFunctions,
} from "../../components/form/data";
import FormAutocomplete2 from "../../components/form/FormAutocompleteWithoutFiltering";
import { useSnackbar } from "../../components/shared/SnackbarProvider";
import { commonFormTextFieldSx } from "../../components/util/CommonFunctions";
import { BlobAnimation } from "../../components/util/CommonStyle";
import {
  getUserAnswerFromAi,
  insertDataInTable,
  syncDataInTable,
  updateByIdDataInTable,
} from "../../services/services";
import color from "../../theme/color";

const BeyondResumeQuestionBankForm: React.FC = ({}) => {
  const [qnResponse, setQnResponse] = useState("");
  const location = useLocation();
  const isJobPage = location.pathname.startsWith("/beyond-resume-jobdetails/");
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const openSnackBar = useSnackbar();
  const [experience, setExperience] = useState("Fresher");
  const [mockInterviewId, setMockInterviewId] = useState(0);
  const [selectedJobTitle, setSelectedJobTitle] = useState("");
  const [skills, setSkills] = useState("");
  let fullCommand = "";

  const handleClick = async () => {
    setLoading(true);
    setQnResponse("");

    try {
      {
        const durationTime = durationTabs[selectedTab];
        const totalQuestions = Math.floor(durationTime / 2);

        const newFilteredList = Object.entries(percentages)
          .filter(([_, percent]) => percent > 0)
          .map(([name, percent]) => ({
            name,
            percent,
            estimatedQuestions: Math.round((percent / 100) * totalQuestions),
          }));

        fullCommand = `
        Please generate a holistic evaluation questionnaire for candidates with technical skills ${skills} and experience level ${experience}, using the time and category weights below.
  
        1. The total interview time is **${durationTime} minutes**, and the average time per question is **2 minutes**, resulting in exact ${totalQuestions} total questions**.
  
        2. Distribute the questions across the following 5 categories based on their specified percentage weights:
  
        ${JSON.stringify(newFilteredList, null, 2)}
  
        3. For each category:
           - Generate the exact number of questions based on the "estimatedQuestions" value.
           - Include a mix of complexity levels: "Low", "Moderate", and "High".
           - Each question must have:
             - "question"
             - "complexity" ("Low", "Moderate", or "High")
             - "suggestedAnswer"
           - Add a "qualifyingCriteria" field for each category explaining how to evaluate responses.
  
        4. Return your response as a static JSON wrapped in a single <pre> tag, and format it like this:
  
        \`\`\`json
        <pre>
        {
          "categories": [
            {
              "name": "CategoryName",
              "qualifyingCriteria": "Short evaluation guideline here",
              "questions": [
                {
                  "question": "Your question text here",
                  "complexity": "Low | Moderate | High",
                  "suggestedAnswer": "Expected or acceptable answer points"
                }
              ]
            }
          ]
        }
        </pre>
        \`\`\`
  
        Do not include any explanation or extra formatting outside the <pre> block.
  
  
        `.trim();

        const aiRes = await getUserAnswerFromAi({ question: fullCommand });

        // console.log(aiRes)
        const generatedText =
          aiRes.data.data.candidates[0].content.parts[0].text;

        setTimeout(() => {
          document
            .getElementById("questionSection")
            ?.scrollIntoView({ behavior: "smooth" });
        }, 100);

        const payload = {
          jobTitle: skills,
          jobLevel: experience,
          jobInterviewQuestions: generatedText,
          interviewDuration: durationTime,
          percentageList: newFilteredList,
          brMockInterviewStatus: "INPROGRESS",
        };
        // console.log(payload);
        const updatedRecord = await insertDataInTable(
          "brMockInterviews",
          payload
        );
        setQnResponse(generatedText);

        const mockInterviewId = updatedRecord?.data?.data?.brMockInterviewId;
        setMockInterviewId(mockInterviewId);

        // const updatedRecord = await searchDataFromTable("brJobs", {
        //   brJobId: jobId,
        // });
        // console.log("Updated Record:", updatedRecord?.data?.data);
      }
    } catch (error: any) {
      console.error("Error generating interview questions:", error);
      openSnackBar(
        error?.response?.data?.msg || error?.message || "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setQnResponse("");

    // console.log(mockInterviewId);

    try {
      await updateByIdDataInTable(
        "brMockInterviews",
        mockInterviewId,
        {
          brMockInterviewStatus: "ACTIVE",
        },
        "brMockInterviewId"
      );
    } catch (error: any) {
      console.error("Error generating interview questions:", error);
      openSnackBar(
        error?.response?.data?.msg || error?.message || "Something went wrong."
      );
    } finally {
      setLoading(false);
      openSnackBar("Question Pool Added");
      window.location.reload();
    }
  };

  const [selectedTab, setSelectedTab] = useState<number>(0);
  const durationTabs = [20, 40, 60];

  const [percentages, setPercentages] = useState<Record<string, number>>(
    Object.fromEntries(evaluationCategories.map((cat) => [cat, 20]))
  );

  const marks = [
    { value: 0, label: "0%" },
    { value: 20, label: "20%" },
    { value: 40, label: "40%" },
    { value: 60, label: "60%" },
    { value: 80, label: "80%" },
    { value: 100, label: "100%" },
  ];

  const handleSliderChange = (category: string, value: number) => {
    setPercentages((prev) => ({
      ...prev,
      [category]: value,
    }));

    // console.log(`Updated ${category}: ${value}%`);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const isSubmitDisabled = !skills.trim();

  return (
    <Box
      sx={{
        background: color.background2,
        pt: 6,
      }}
    >
      <BlobAnimation />
      <Box
        sx={{
          background: "white",
          maxWidth: "700px",
          p: 4,
          position: "relative",
          borderRadius: "12px",
          // boxShadow: "0px 4px 10px rgba(90, 128, 253, 0.49)",
          mx: "auto",
        }}
      >
        <Typography
          variant="h5"
          align="center"
          sx={{
            width: "fit-content",
            m: "auto",
            fontFamily: "Custom-Bold",
            background: "linear-gradient(180deg, #50bcf6, #50bcf6)",
            color: "white",
            p: 2,
            px: 4,
            mb: 2,
            borderRadius: "44px",
            boxShadow: "0px 4px 10px rgba(90, 128, 253, 0.49)",
          }}
        >
          Interview Settings
        </Typography>

        <Typography gutterBottom align="center" color="black" mt={4} mb={2}>
          For which Skills the question pool is being designed for?
        </Typography>
        <TextField
          // required
          fullWidth
          label="Enter At least One SKill"
          variant="outlined"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          sx={{
            ...commonFormTextFieldSx,
            maxWidth: "80%",
            mx: "auto",
            display: "block",
          }}
        />

        {/* <FormAutocomplete2
          label="Select Job Title"
          options={jobFunctions}
          defaultValue={selectedJobTitle}
          labelProp=""
          primeryKey=""
          setter={setSelectedJobTitle}
          sx={{ ...commonFormTextFieldSx, marginTop: "12px" }}
          mt={2}
          search={""}
        /> */}

        <Typography gutterBottom align="center" color="black" mt={4}>
          What experience level the question pool is for?
        </Typography>
        <ToggleButtonGroup
          value={experience}
          exclusive
          onChange={(e, newExperience) => {
            if (newExperience !== null) setExperience(newExperience);
          }}
          fullWidth
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            justifyContent: "center",
            mt: 2,
          }}
        >
          {experienceLevels.map((level) => (
            <ToggleButton
              key={level}
              value={level}
              style={{
                backgroundColor: experience === level ? "#50bcf6" : "#ffffff22",
                color: experience === level ? "white" : "grey",
                borderRadius: "999px",
                border: "1px solid #ccc",
              }}
              sx={{
                borderRadius: "999px",
                maxWidth: "fit-content",
                textTransform: "none",
                px: 3,
                py: 1,
                transition: "all 0.3s",
                "&.Mui-selected": {
                  backgroundColor: "#50bcf6",
                  color: "white",
                  boxShadow: "-2px -2px 10px rgba(0, 0, 0, 0.1) inset",
                  borderRadius: "999px",
                },
              }}
            >
              {level}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <Box px={4} py={2} mt={2}>
          <Typography
            gutterBottom
            align="center"
            fontWeight="bold"
            color="black"
            mb={2}
          >
            Select Interview Duration
          </Typography>

          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            centered
            sx={{
              "& .MuiTab-root": {
                // border: "1px solid #ccc",
                borderRadius: "999px",
                mx: 1,
                minWidth: 80,
                backgroundColor: "#f5f5f5",
                color: "#555",
                fontWeight: 500,
                px: 4,
              },
              "& .Mui-selected": {
                backgroundColor: "#50bcf6",
                color: "white !important",
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "transparent",
              },
            }}
          >
            {durationTabs.map((min) => (
              <Tab key={min} label={`${min} min`} />
            ))}
          </Tabs>

          <Typography
            gutterBottom
            align="center"
            fontWeight="bold"
            color="black"
            my={2}
            mt={4}
          >
            Allocate Percentage for Each Evaluation Category
          </Typography>

          <Box
            display={"flex"}
            flexWrap={"wrap"}
            // flexDirection={'column'}
            borderRadius={"12px"}
            mt={4}
            gap={1}
            justifyContent={"center"}
            sx={{
              boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.10)",
            }}
          >
            {evaluationCategories.map((category) => (
              <Box
                key={category}
                // mb={4}
                minWidth={"450px"}
                maxWidth={"400px"}
                sx={{
                  p: 3,
                  px: 4,
                  borderRadius: "12px",
                  // boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.10)",
                }}
              >
                <Typography
                  gutterBottom
                  fontWeight={600}
                  color="white"
                  sx={{
                    background: "linear-gradient(180deg, #50bcf6, #5a81fd)",
                    width: "fit-content",
                    borderRadius: "12px",
                    px: 1,
                  }}
                >
                  {category}
                </Typography>
                <Slider
                  value={percentages[category]}
                  onChange={(e, value) =>
                    handleSliderChange(category, value as number)
                  }
                  min={0}
                  max={100}
                  step={5}
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
        </Box>

        <Button
          disabled={isSubmitDisabled}
          onClick={handleClick}
          variant="contained"
          color="primary"
          sx={{
            borderRadius: "44px",
            px: 4,
            py: 1,
            display: "flex",
            alignItems: "center",
            gap: 1,
            m: "auto",
            mt: 3,
            background: "linear-gradient(180deg, #50bcf6, #5a81fd)",
            transition: "all 0.3s",
            textTransform: "none",
            fontSize: "16px",
            "&:hover": {
              transform: "scale(1.08)",
            },
          }}
        >
          {loading ? (
            <>
              Analyzing <CircularProgress color="inherit" size={18} />
            </>
          ) : (
            <>
              Generate Interview Questions
              <FontAwesomeIcon
                style={{ marginLeft: "6px" }}
                icon={faArrowCircleRight}
              />
            </>
          )}
        </Button>

        {qnResponse && (
          <Box m={4} id="questionSection">
            <Typography
              sx={{
                background: "linear-gradient(180deg, #50bcf6, #5a81fd)",
                width: "fit-content",
                color: "white",
                p: 2,
                mb: 4,
                borderRadius: "12px",
                boxShadow: "0px 4px 10px rgba(90, 128, 253, 0.49)",
              }}
              variant="h6"
            >
              Generated AI Question Answer:
            </Typography>

            <Box
              p={3}
              pt={2}
              sx={{
                backgroundColor: "#f5f5f5",
                borderRadius: "12px",
                boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.16)",
                color: "black",
                position: "relative",
              }}
            >
              <HtmlParserExample htmlString={qnResponse} />
            </Box>

            {!isJobPage && (
              <Button
                onClick={handleSave}
                variant="contained"
                color="primary"
                sx={{
                  borderRadius: "44px",
                  px: 4,
                  py: 1,
                  mt: 3,
                  mx: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  ml: "auto",
                  background: "linear-gradient(180deg, #50bcf6, #5a81fd)",
                  transition: "all 0.3s",
                  textTransform: "none",
                  fontSize: "16px",
                  "&:hover": {
                    transform: "scale(1.08)",
                  },
                }}
              >
                Post Job
                <FontAwesomeIcon
                  style={{ marginLeft: "6px" }}
                  icon={faArrowCircleRight}
                />
              </Button>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default BeyondResumeQuestionBankForm;

interface MCQOption {
  [key: string]: string;
}

interface Question {
  question: string;
  options: MCQOption[];
  answerKey: string;
  complexity: string;
  suggestedAnswer: string;
  sheetName: string;
}

interface Category {
  name: string;
  questions: Question[];
}

interface TextContent {
  categories: Category[];
}

const HtmlParserExample = ({ htmlString }: { htmlString: string }) => {
  let parsedData: TextContent | null = null;

  try {
    const match = htmlString.match(/<pre>\s*([\s\S]*?)\s*<\/pre>/);
    const jsonString = match ? match[1] : null;

    if (jsonString) {
      parsedData = JSON.parse(jsonString);
    }
  } catch (err) {
    console.error("Failed to parse JSON", err);
  }

  return (
    <div>
      <Typography my={1}>Interview Questions:</Typography>
      {parsedData ? (
        parsedData.categories.map((category, i) => (
          <div key={i}>
            <Typography variant="h5" mb={2}>
              {category.name}
            </Typography>
            {category.questions.map((q, j) => (
              <div key={j} style={{ marginBottom: "2rem" }}>
                <Typography>
                  Q{j + 1}: {q.question}
                </Typography>
                {q.options && q.options.length > 0 && (
                  <ul style={{ padding: 0, margin: "8px", marginLeft: 0 }}>
                    {q.options.map((opt, k) => {
                      const [label, text] = Object.entries(opt)[0];
                      return (
                        <Typography key={k} sx={{ display: "flex", gap: 1 }}>
                          {label}:{" "}
                          <Typography
                            sx={{
                              fontSize: "16px",
                              fontFamily: "Montserrat-regular",
                            }}
                          >
                            {" "}
                            {text}
                          </Typography>
                        </Typography>
                      );
                    })}
                  </ul>
                )}
                {q?.answerKey && (
                  <Typography
                    sx={{
                      fontSize: "16px",
                      mt: 0.5,
                      fontFamily: "Montserrat-regular",
                    }}
                  >
                    <strong>Answer Key:</strong> {q.answerKey}
                  </Typography>
                )}

                {/* {q?.complexity && (
                  <p>
                    <strong>Complexity:</strong> {q.complexity}
                  </p>
                )} */}

                {q?.suggestedAnswer && (
                  <Typography
                    sx={{
                      fontSize: "16px",
                      mt: 0.5,
                      fontFamily: "Montserrat-regular",
                    }}
                  >
                    <strong>Suggested Answer:</strong> {q.suggestedAnswer}
                  </Typography>
                )}

                {q?.sheetName && (
                  <Typography
                    sx={{
                      fontSize: "16px",
                      mt: 0.5,
                      fontFamily: "Montserrat-regular",
                    }}
                  >
                    <strong>Sheet Name:</strong> {q.sheetName}
                  </Typography>
                )}
              </div>
            ))}
          </div>
        ))
      ) : (
        <p>Error generating interview questions, kindly try again!</p>
      )}
    </div>
  );
};
