import { Box, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router";
import { searchListDataFromTable } from "../../../services/services";
import ExamSession from "../ExamSession";

const BeyondResumePracticeInterviewSession = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const sessionType = queryParams.get("sessionType") ?? undefined;
  const { brJobId } = useParams<any>();
  const [jobsData, setJobsData] = useState<any>([]);

  useEffect(() => {
    searchListDataFromTable("brInterviews", {
      brInterviewId: brJobId,
    }).then((result: any) => {
      setJobsData(result?.data?.data);
    });
  }, []);

  //   console.log(jobsData);

  return (
    <Box>
      {jobsData[0] && (
        <ExamSession
          brInterviewId={brJobId}
          sessionType={sessionType}
          response={jobsData[0]?.jobInterviewQuestions}
        />
      )}
    </Box>
  );
};

export default BeyondResumePracticeInterviewSession;
