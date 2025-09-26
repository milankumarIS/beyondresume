import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { decryptPayload } from "../../../../components/util/CommonFunctions";
import CYS from "../../../../services/Secret";
import { searchListDataFromTable } from "../../../../services/services";
import ExamSession from "../../ExamSession";

const BeyondResumeJobInterviewSession = () => {
  // const location = useLocation();
  // const queryParams = new URLSearchParams(location.search);
  // const roundId = queryParams.get("roundId");
  // const { brJobId } = useParams<any>();
  const [jobsData, setJobsData] = useState<any>([]);
  const [roundData, setRoundData] = useState<any>([]);
  const [isAdaptive, setIsAdaptive] = useState(false);

  const { token } = useParams<{ token: string }>();
  const data = token ? decryptPayload(token, CYS) : null;

  if (!data) return <div>Invalid or expired token</div>;

  const { brJobId, roundId } = data;

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
      {jobsData[0] && (
        <ExamSession
          roundData={roundData}
          jobsData={jobsData}
          brJobId={brJobId}
          response={
            jobsData[0]?.roundType === "multiple"
              ? roundData?.jobInterviewQuestions
              : jobsData[0]?.jobInterviewQuestions
          }
          interviewDuration={
            jobsData[0]?.roundType === "multiple"
              ? roundData?.interviewDuration
              : jobsData[0]?.interviewDuration
          }
          isAdaptive={isAdaptive}
        />
      )}
    </Box>
  );
};

export default BeyondResumeJobInterviewSession;
