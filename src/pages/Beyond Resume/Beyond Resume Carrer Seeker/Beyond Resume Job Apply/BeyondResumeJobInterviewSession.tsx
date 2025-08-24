import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import { searchListDataFromTable } from "../../../../services/services";
import ExamSession from "../../ExamSession";

const BeyondResumeJobInterviewSession = () => {
  const location = useLocation();

  const { brJobId } = useParams<any>();
  const [jobsData, setJobsData] = useState<any>([]);

  const [isAdaptive, setIsAdaptive] = useState(false);

  useEffect(() => {
    searchListDataFromTable("brJobApplicant", {
      brJobApplicantId: brJobId,
    }).then((result: any) => {
      setJobsData(result?.data?.data);
      if (result?.data?.data[0]?.examMode === "Adaptive") {
        setIsAdaptive(true);
      }
    });
  }, []);

  // console.log(jobsData[0]?.jobInterviewQuestions);

  return (
    <Box>
      {jobsData[0] && (
        <ExamSession
          jobsData={jobsData}
          brJobId={brJobId}
          response={jobsData[0]?.jobInterviewQuestions}
          interviewDuration={jobsData[0]?.interviewDuration}
          isAdaptive={isAdaptive}
        />
      )}
    </Box>
  );
};

export default BeyondResumeJobInterviewSession;
