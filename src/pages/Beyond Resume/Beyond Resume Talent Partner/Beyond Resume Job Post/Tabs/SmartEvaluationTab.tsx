import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, CircularProgress, Tab, Tabs, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";
import { evaluationCategories } from "../../../../../components/form/data";
import { useSnackbar } from "../../../../../components/shared/SnackbarProvider";
import {
  normalizeHTMLToText,
  readExcelFileAsJson,
} from "../../../../../components/util/CommonFunctions";
import {
  BeyondResumeButton,
  CustomToggleButton,
  CustomToggleButtonGroup,
} from "../../../../../components/util/CommonStyle";
import {
  getUserAnswerFromAi,
  searchDataFromTable,
  updateByIdDataInTable
} from "../../../../../services/services";
import color from "../../../../../theme/color";
import CustomEvaluationDriver from "../../../Beyond Resume Components/CustomEvaluationDriver";
import FileUpload from "../../../Beyond Resume Components/FileUpload";
import BeyondResumeAdaptiveEvaluation from "../BeyondResumeAdaptiveEvaluation";

interface SmartEvaluationTabProps {
  response: string;
  onSave?: (updatedContent: string) => void;
  jobId?: string | null;
  onJobUpdate?: () => void;

  onNext?: (qnResponse: string) => void;
}

const SmartEvaluationTab: React.FC<SmartEvaluationTabProps> = ({
  response,
  onSave,
  jobId,
  onJobUpdate,
  onNext,
}) => {
  const location = useLocation();
  const isJobPage = location.pathname.startsWith("/beyond-resume-jobs");

  const [generatedJd, setGeneratedJd] = useState(response);
  const [editorContent, setEditorContent] = useState("");
  const [displayContent, setDisplayContent] = useState("");

  useEffect(() => {
    setGeneratedJd(response);
  }, [response]);

  useEffect(() => {
    const cleanedResponse = generatedJd
      .replace(/^```html\s*|\s*```$/g, "")
      .trim();

    setEditorContent(cleanedResponse);
    setDisplayContent(cleanedResponse);
  }, [generatedJd]);

  const [loading, setLoading] = useState(false);
  const [qnResponse, setQnResponse] = useState("");
  const [questionFile, setQuestionFile] = useState<File | null>(null);
  const [addQuestionFile, setAddQuestionFile] = useState(false);
  const [simulatorMode, setSimulatorMode] = useState<
    "yes" | "templatised" | "adaptive"
  >("templatised");

  const [jobStatus, setJobStatus] = useState("");
  const [isTotalValid, setIsTotalValid] = useState(true);
  const [selectedTab, setSelectedTab] = useState<number>(2);
  const durationTabs = [20, 40, 60];

  const [percentages, setPercentages] = useState<Record<string, number>>(
    Object.fromEntries(evaluationCategories.map((cat) => [cat, 20]))
  );

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  useEffect(() => {
    const getStatus = async () => {
      const existingRecords = await searchDataFromTable("brJobs", {
        brJobId: jobId,
      });

      setJobStatus(existingRecords?.data?.data?.brJobStatus);
    };
    getStatus();
  }, []);

  let fullCommand = "";

  const handleClick = async () => {
    setLoading(true);
    setQnResponse("");

    try {
      if (addQuestionFile && questionFile) {
        const fileData = await readExcelFileAsJson(questionFile);
        // console.log(`Parsed JSON:\n${JSON.stringify(fileData, null, 2)}`);

        if (Array.isArray(fileData)) {
          const transformed = {
            categories: fileData.map((sheet) => ({
              name: sheet.sheetName,
              qualifyingCriteria: "",
              questions: (sheet.questions || []).map((q: any) => {
                const questionText = q["Question"] || q["question"] || "";
                const complexity = q["Complexity"] || q["complexity"] || "";
                const suggestedAnswer =
                  q["Suggested Answer"] || q["suggestedAnswer"] || "";
                const answerKey = q["Answer Key"] || q["answerKey"] || "";

                const options = Object.entries(q)
                  .filter(([key, _]) => key.startsWith("Option "))
                  .map(([key, value]) => ({
                    label: key,
                    text: value,
                  }));

                return {
                  question: questionText,
                  complexity,
                  suggestedAnswer,
                  answerKey,
                  ...(options.length > 0 ? { options } : {}),
                };
              }),
            })),
          };

          const qnaJsonString = `\`\`\`json\n<pre>${JSON.stringify(
            transformed,
            null,
            2
          )}</pre>\n\`\`\``;

          setQnResponse(qnaJsonString);

          const payload = {
            jobInterviewQuestions: qnaJsonString,
          };

          // console.log(payload);
          

          await updateByIdDataInTable("brJobs", jobId, payload, "brJobId");

        onNext?.(qnaJsonString);


          setTimeout(() => {
            document
              .getElementById("questionSection")
              ?.scrollIntoView({ behavior: "smooth" });
          }, 100);
        }
      } else {
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
        Please analyze the following job description and generate a holistic evaluation questionnaire for candidates, using the time and category weights below.
  
        1. The total interview time is **${durationTime} minutes**, and the average time per question is **2 minutes**, resulting in exact ${totalQuestions} total questions**.
  
        2. Distribute the questions across the following categories based on their specified percentage weights:
  
        ${JSON.stringify(newFilteredList, null, 2)}
  
        3. For each category:
           - Generate the exact number of questions based on the "estimatedQuestions" value.
           - Include a mix of complexity levels: "Beginner", "Intermediate", "Advance" and 'Complex.
           - Each question must have:
             - "question"
             - "complexity" ("Beginner", "Intermediate", "Advance" or "Complex)
             - "suggestedAnswer"
           - Add a "qualifyingCriteria" field for each category explaining how to evaluate responses.
  
        4. Return your response as a static JSON wrapped in a single <pre> tag, and format it like this:
  
        \`\`\`json
        <pre>{"categories": [
            {
              "name": "CategoryName",
              "qualifyingCriteria": "Short evaluation guideline here",
              "questions": [
                {
                  "question": "Your question text here",
                  "complexity": "Beginner | Intermediate | Advance | Complex",
                  "suggestedAnswer": "Expected or acceptable answer points"
                }
              ]
            }
          ]
        }</pre>\`\`\`
  
        Do not include any explanation or extra formatting outside the <pre> block.
  
        Here is the job description:
        ${normalizeHTMLToText(displayContent)}
        `.trim();

        const aiRes = await getUserAnswerFromAi({ question: fullCommand });
        // console.log(aiRes);
        const generatedText =
          aiRes.data.data.candidates[0].content.parts[0].text;

        setQnResponse(generatedText);

        setTimeout(() => {
          document
            .getElementById("questionSection")
            ?.scrollIntoView({ behavior: "smooth" });
        }, 100);

        const payload = {
          jobInterviewQuestions: generatedText,
          interviewDuration: durationTime,
          percentageList: newFilteredList,
        };
        await updateByIdDataInTable("brJobs", jobId, payload, "brJobId");

        onNext?.(generatedText);

        // const updatedRecord = await searchDataFromTable("brJobs", {
        //   brJobId: jobId,
        // });
        // console.log("Updated Record:", updatedRecord?.data?.data);
      }
    } catch (error: any) {
      console.error("Error generating interview questions:", error);
    } finally {
      setLoading(false);
      // if (onJobUpdate) {
      //   onJobUpdate();
      // }
    }
  };



  return (
    <Box id="responseSection">
      {isJobPage && jobStatus !== "INPROGRESS" ? (
        <></>
      ) : (
        <>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              mt: 2,
            }}
          >
            <Typography align="center" gutterBottom mb={2}>
              Choose How You Want to Run the Interview?
            </Typography>
            <CustomToggleButtonGroup
              value={simulatorMode}
              exclusive
              onChange={(_event, newValue) => {
                if (newValue !== null) setSimulatorMode(newValue);
                setAddQuestionFile(newValue === "yes");
              }}
            >
              <CustomToggleButton value="yes">
                Use Your Own Interview Questions
              </CustomToggleButton>
              <CustomToggleButton value="templatised">
                AI-Crafted Question Bank
              </CustomToggleButton>
              <CustomToggleButton value="adaptive">
                Smart, Adaptive Assessment
              </CustomToggleButton>
            </CustomToggleButtonGroup>
          </Box>

          <Box  py={2} mt={4}>
            <Typography
              gutterBottom
              align="center"
              fontWeight="bold"
              mb={2}
              fontFamily={"montserrat-regular"}
            >
              How long should the interview last?
            </Typography>

            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              centered
              sx={{
                m: "auto",
                fontFamily: "montserrat-regular",
                background: "white",
                width: "fit-content",
                borderRadius: "32px",
                p: 1,
                minHeight: "0px",

                "& .MuiTab-root": {
                  color: "black",
                  background: "transparent",
                  borderRadius: "999px",
                  marginRight: "8px",
                  paddingX: "16px",
                  minHeight: "0px",
                  textTransform: "none",
                  border: "1px solid #ffffff44",
                  fontFamily: "montserrat-regular",
                },
                "& .Mui-selected": {
                  background: color.activeButtonBg,
                  color: "white !important",
                },
                "& .MuiButtonBase-root": {
                  p: 0,
                  py: 1,
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
          </Box>

          {simulatorMode === "adaptive" && (
            <>
              <BeyondResumeAdaptiveEvaluation
                jobId={jobId}
                duration={durationTabs[selectedTab]}
              />
            </>
          )}

          {!addQuestionFile && simulatorMode !== "adaptive" && (
            <CustomEvaluationDriver
              selectedTabIndex={selectedTab}
              percentages={percentages}
              setPercentages={setPercentages}
              setIsTotalValid={setIsTotalValid}
            />
          )}

          {addQuestionFile && (
            <Box>
              <Box mb={2}>
                <BeyondResumeButton
                  sx={{
                    ml: "auto",
                    display: "block",

                    border: "solid 1px",
                    fontSize: "12px",
                    px: 3,
                  }}
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href =
                      "https://mydailylives.s3.ap-south-1.amazonaws.com/uploads/1751450761461-InterviewQuestionsTemplate.xlsx";
                    link.download = "SampleFile.xlsx";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  Download Sample File
                  <FontAwesomeIcon
                    style={{ marginLeft: "6px" }}
                    icon={faDownload}
                  />
                </BeyondResumeButton>
              </Box>
              <FileUpload
                questionFile={questionFile}
                setQuestionFile={setQuestionFile}
                acceptFormat=".csv, .xlsx"
                fileFormatNote="Please make sure the file follows the exact column order of the sample file."
              />
            </Box>
          )}

          {simulatorMode !== "adaptive" && (
            <BeyondResumeButton
              onClick={handleClick}
              variant="contained"
              disabled={!isTotalValid}
              color="primary"
              sx={{
                m: "auto",
                display: "flex",
                my: 4,
                alignItems: "center",
              }}
            >
              {loading ? (
                <>
                  Analyzing{" "}
                  <CircularProgress
                    color="inherit"
                    size={18}
                    style={{ marginLeft: "4px" }}
                  />
                </>
              ) : (
                <>
                  Generate Interview Questions
                  {/* <FontAwesomeIcon
                  style={{ marginLeft: "6px" }}
                  icon={faArrowCircleRight}
                /> */}
                </>
              )}
            </BeyondResumeButton>
          )}
        </>
      )}
    </Box>
  );
};

export default SmartEvaluationTab;
