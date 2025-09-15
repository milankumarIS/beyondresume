import {
  faArrowCircleRight,
  faChevronCircleRight,
  faCopy,
  faDownload,
  faEdit,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Button,
  CircularProgress,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";
import { evaluationCategories, pricingPlans } from "../../../../components/form/data";
import { copyToClipboard } from "../../../../components/shared/Clipboard";
import { useSnackbar } from "../../../../components/shared/SnackbarProvider";
import {
  normalizeHTMLToText,
  readExcelFileAsJson,
} from "../../../../components/util/CommonFunctions";
import {
  BeyondResumeButton,
  BeyondResumeButton2,
  CustomToggleButton,
  CustomToggleButtonGroup,
  StyledTypography,
} from "../../../../components/util/CommonStyle";
import QuillInputEditor from "../../../../components/util/QuilInputEditor";
import { getUserId, getUserRole } from "../../../../services/axiosClient";
import {
  getUserAnswerFromAi,
  getUserAnswerFromAiThroughPdf,
  searchDataFromTable,
  searchListDataFromTable,
  updateByIdDataInTable,
  UploadAuthFile,
} from "../../../../services/services";
import BeyondResumeUpgradeRequiredModal from "../../Beyond Resume Components/BeyondResumeUpgradeRequiredModal";
import CustomEvaluationDriver from "../../Beyond Resume Components/CustomEvaluationDriver";
import FileUpload from "../../Beyond Resume Components/FileUpload";
import GeneratedAiQnaResponse from "./GeneratedAiQnaResponse";
import color from "../../../../theme/color";
import BeyondResumeAdaptiveEvaluation from "./BeyondResumeAdaptiveEvaluation";

interface JobDescriptionResponseProps {
  response: string;
  onSave?: (updatedContent: string) => void;
  jobId?: string | null;
  onJobUpdate?: () => void;
}

const JobDescriptionResponse: React.FC<JobDescriptionResponseProps> = ({
  response,
  onSave,
  jobId,
  onJobUpdate,
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

  const [isEditing, setIsEditing] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [qnResponse, setQnResponse] = useState("");
  const history = useHistory();
  const openSnackBar = useSnackbar();
  const [questionFile, setQuestionFile] = useState<File | null>(null);
  const [addQuestionFile, setAddQuestionFile] = useState(false);
  const [simulatorMode, setSimulatorMode] = useState<
    "yes" | "templatised" | "adaptive"
  >("templatised");
  const [showModal, setShowModal] = useState(false);
  const [jd, setJd] = useState<File | null>(null);
  const [addJd, setAddJd] = useState(false);
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

  useEffect(() => {
    const checkSubscription = async () => {
      const userId = getUserId();

      const [payments, interviews] = await Promise.all([
        searchDataFromTable("brPayments", {
          createdBy: userId,
          brPaymentStatus: "ACTIVE",
        }),
        searchListDataFromTable("brJobs", {
          createdBy: userId,
          brJobStatus: "ACTIVE",
        }),
      ]);
      const subscription = payments?.data?.data;
      const now = new Date();

      if (!subscription || new Date(subscription.endDate) < now) {
        setShowModal(true);
        return;
      }
      const planDetails = pricingPlans.find(
        (plan) => plan.title === subscription.planName
      );

      if (!planDetails) {
        setShowModal(true);
        return;
      }
      const mockFeature = planDetails.features.find((f) =>
        f.label.toLowerCase().includes("job post")
      );

      const allowedMockInterviews = mockFeature
        ? parseInt(mockFeature.label.match(/\d+/)?.[0] || "0")
        : 0;
      const usedMockInterviews = interviews?.data?.data?.length || 0;
      if (usedMockInterviews >= allowedMockInterviews) {
        setShowModal(true);
      }
    };

    checkSubscription();
  }, []);

  const handleCopy = async () => {
    try {
      const normalizedText = normalizeHTMLToText(displayContent);
      await copyToClipboard(normalizedText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      openSnackBar("Job description copied to clipboard!");
    } catch (error) {
      console.error(error);
      openSnackBar("Failed to copy. Please try again.");
    }
  };

  const handleEdit = () => setIsEditing(true);

  const handleSave = () => {
    const cleaned = editorContent
      .replace(/<p><br><\/p>/g, "")
      .replace(/<p>\s*<\/p>/g, "");

    setDisplayContent(cleaned);
    setIsEditing(false);
    onSave?.(cleaned);

    updateByIdDataInTable(
      "brJobs",
      jobId,
      { jobDescriptions: cleaned },
      "brJobId"
    )
      .then((result: any) => {
        openSnackBar(result?.data?.msg);
      })
      .catch((error) => {
        openSnackBar(error?.response?.data?.msg);
      });
  };

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

          await updateByIdDataInTable("brJobs", jobId, payload, "brJobId");

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
        console.log(aiRes);
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

  useEffect(() => {
    if (!jd) return;

    const generateFromFile = async () => {
      setLoading1(true);

      try {
        const formData = new FormData();
        formData.append("file", jd);
        const result = await UploadAuthFile(formData);
        const jdLink = result?.data?.data?.location;
        if (!jdLink) throw new Error("Resume upload failed. No link returned.");

        const prompt =
          `Here I'm attaching a job description link. From the linked PDF, extract the text and give the response in plain innerHTML. 
          Make it look good with by adding HTML Tags`.replace(/\s+/g, " ");

        const res = await getUserAnswerFromAiThroughPdf({
          question: prompt,
          urls: [jdLink],
        });
        const rawText =  res?.data?.data?.candidates[0]?.content?.parts[0].text || "";
        // console.log(res);
        // console.log(rawText);
        setGeneratedJd(rawText);

        const cleaned = editorContent
          .replace(/^```html\s*|\s*```$/g, "")
          .replace(/<p><br><\/p>/g, "")
          .replace(/<p>\s*<\/p>/g, "")
          .trim();

        updateByIdDataInTable(
          "brJobs",
          jobId,
          { jobDescriptions: cleaned },
          "brJobId"
        );

        setTimeout(() => {
          document
            .getElementById("jdSection")
            ?.scrollIntoView({ behavior: "smooth" });
        }, 400);
      } catch (err) {
        console.error("JD extraction failed", err);
      } finally {
        setLoading1(false);
      }
    };

    generateFromFile();
  }, [jd]);

  return (
    <Box id="responseSection">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {/* <Typography
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
          {isJobPage ? "Job Description:" : "Generated Job Description:"}
        </Typography> */}

        {getUserRole() === "TALENT PARTNER" && isJobPage && (
          <Button
            onClick={() => {
              history.push("/beyond-resume-candidate-list", { jobId });
            }}
            sx={{
              width: "fit-content",
              color: "black",
              p: 1,
              px: 2,
              textTransform: "none",
              mb: 4,
              borderRadius: "999px",
              border: "solid 1px",
              height: "fit-content",
            }}
          >
            View Job Applicants{" "}
            <FontAwesomeIcon
              style={{ marginLeft: "6px" }}
              icon={faChevronCircleRight}
            ></FontAwesomeIcon>
          </Button>
        )}
      </Box>

      {getUserRole() === "TALENT PARTNER" && jobStatus !== "COMPLETED" && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            mb: 3,
          }}
        >
          <CustomToggleButtonGroup
            value={addJd ? "yes" : "no"}
            exclusive
            onChange={() => setAddJd((prev) => !prev)}
          >
            <CustomToggleButton value="no">System Generated JD</CustomToggleButton>
            <CustomToggleButton value="yes">
              Upload Custom JD
            </CustomToggleButton>
          </CustomToggleButtonGroup>
        </Box>
      )}

      {addJd && (
        <>
          <FileUpload
            questionFile={jd}
            setQuestionFile={setJd}
            acceptFormat=".pdf"
          />
        </>
      )}

      {loading1 ? (
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <div className="newtons-cradle">
            <div className="newtons-cradle__dot"></div>
            <div className="newtons-cradle__dot"></div>
            <div className="newtons-cradle__dot"></div>
            <div className="newtons-cradle__dot"></div>
          </div>

          <Typography variant="h6" sx={{ mb: 2 }}>
            Fetching Job Description
          </Typography>
        </Box>
      ) : (
        <Box
          id="jdSection"
          // p={3}
          pt={2}
          sx={{
            borderRadius: "12px",
            // boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.16)",
            position: "relative",
          }}
        >
          {!isJobPage && (
            <Box
              sx={{
                display: "flex",
                gap: 1,
                position: "absolute",
                top: 20,
                right: 20,
              }}
            >
              <Button
                variant="contained"
                sx={{
                  color: "white",
                  textTransform: "none",
                  background: color.activeButtonBg,
                  borderRadius: "44px",
                }}
                onClick={handleCopy}
              >
                {isCopied ? "Copied!" : "Copy"}

                <FontAwesomeIcon icon={faCopy} style={{ marginLeft: 8 }} />
              </Button>
              <Button
                variant="outlined"
                onClick={isEditing ? handleSave : handleEdit}
                sx={{
                  color: "white",
                  textTransform: "none",
                  background: color.activeButtonBg,
                  borderRadius: "44px",
                }}
              >
                {isEditing ? "Save" : "Edit"}
                <FontAwesomeIcon
                  icon={isEditing ? faSave : faEdit}
                  style={{ marginLeft: 8 }}
                />
              </Button>
            </Box>
          )}

          {!isEditing ? (
            <StyledTypography
              sx={{ mt: { xs: 8, md: 0 } }}
              dangerouslySetInnerHTML={{
                __html: displayContent,
              }}
            />
          ) : (
            <Box mt={8}>
              <QuillInputEditor
                sx={{ minHeight: "920px" }}
                value={editorContent}
                setValue={(content: string) => setEditorContent(content)}
                placeholder="Write your Response here"
              />
            </Box>
          )}
        </Box>
      )}

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
              Select Simulator Mode
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
                Bring Your Own Question
              </CustomToggleButton>
              <CustomToggleButton value="templatised">
                Templatised Questions
              </CustomToggleButton>
              <CustomToggleButton value="adaptive">
                Adaptive Evaluation
              </CustomToggleButton>
            </CustomToggleButtonGroup>
          </Box>

          <Box px={4} py={2} mt={4}>
            <Typography
              gutterBottom
              align="center"
              fontWeight="bold"
              mb={2}
              fontFamily={"montserrat-regular"}
            >
              What is your preferred duration of the interview?
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
                  background: color.newbg,
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
                acceptFormat=".csv"
                fileFormatNote="Please make sure the CSV follows the exact column order of the sample file."
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

      {qnResponse && simulatorMode !== "adaptive" && (
        <GeneratedAiQnaResponse response={qnResponse} jobId={jobId} />
      )}

      {/* {getUserRole() === "TALENT PARTNER" && !isJobPage && (
        <BeyondResumeUpgradeRequiredModal open={showModal} />
      )} */}
    </Box>
  );
};

export default JobDescriptionResponse;
