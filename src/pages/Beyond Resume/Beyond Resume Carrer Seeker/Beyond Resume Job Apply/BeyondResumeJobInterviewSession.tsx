import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { decryptPayload } from "../../../../components/util/CommonFunctions";
import CYS from "../../../../services/Secret";
import {
  getUserAnswerFromAi,
  searchListDataFromTable,
} from "../../../../services/services";
import BeyondResumeLoader from "../../Beyond Resume Components/BeyondResumeLoader";
import ExamSession from "../../ExamSession";

const BeyondResumeJobInterviewSession = () => {
  // const location = useLocation();
  // const queryParams = new URLSearchParams(location.search);
  // const roundId = queryParams.get("roundId");
  // const { brJobId } = useParams<any>();
  const [jobsData, setJobsData] = useState<any>([]);
  const [roundData, setRoundData] = useState<any>([]);
  const [isAdaptive, setIsAdaptive] = useState(false);
  const [dynamicInterviewQuestion, setDynamicInterviewQuestion] = useState("");
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  const { token } = useParams<{ token: string }>();
  const data = token ? decryptPayload(token, CYS) : null;

  if (!data) return <div>Invalid or expired token</div>;

  const { brJobId, roundId } = data;

  useEffect(() => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) elem.requestFullscreen();
    else if ((elem as any).webkitRequestFullscreen)
      (elem as any).webkitRequestFullscreen();
    else if ((elem as any).msRequestFullscreen)
      (elem as any).msRequestFullscreen();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result: any = await searchListDataFromTable("brJobApplicant", {
          brJobApplicantId: brJobId,
        });
        const jobData = result?.data?.data;
        setJobsData(jobData);

        const result1: any = await searchListDataFromTable("brJobRounds", {
          brJobId: jobData[0]?.brJobId,
          roundId: roundId,
        });

        const rawRoundData = result1?.data?.data;

        setRoundData(rawRoundData[0]);

        if (
          jobData?.[0]?.examMode === "Adaptive" ||
          roundData?.examMode === "Adaptive"
        ) {
          setIsAdaptive(true);
        }

        const durationTime =
          jobData[0]?.roundType === "multiple"
            ? rawRoundData[0]?.interviewDuration
            : jobData[0]?.interviewDuration;
        const totalQuestions = durationTime / 2;

        const newFilteredList =
          jobData[0]?.roundType === "multiple"
            ? rawRoundData[0]?.percentageList
            : jobData[0]?.percentageList;

        const fullCommand = `
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
                ${jobData[0]?.jobDescriptions}
                `.trim();

        const aiRes = await getUserAnswerFromAi({ question: fullCommand });
        // console.log(aiRes);
        const generatedText =
          aiRes.data.data.candidates[0].content.parts[0].text;

        setDynamicInterviewQuestion(generatedText);

        setProgress(0);

        let currentProgress = 0;
        const fakeProgressInterval = setInterval(() => {
          currentProgress += Math.floor(Math.random() * 10);
          if (currentProgress >= 90) {
            currentProgress = 90;
            clearInterval(fakeProgressInterval);
          }
          setProgress(currentProgress);
        }, 900);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // console.log(roundData);

  // console.log(jobsData[0]?.jobInterviewQuestions);

  return (
    <Box>
      {loading ? (
        <BeyondResumeLoader open={loading} progress={progress} />
      ) : (
        jobsData[0] && (
          <ExamSession
            roundData={roundData}
            jobsData={jobsData}
            brJobId={brJobId}
            response={dynamicInterviewQuestion}
            interviewDuration={
              jobsData[0]?.roundType === "multiple"
                ? roundData?.interviewDuration
                : jobsData[0]?.interviewDuration
            }
            isAdaptive={isAdaptive}
          />
        )
      )}
    </Box>
  );
};

export default BeyondResumeJobInterviewSession;
