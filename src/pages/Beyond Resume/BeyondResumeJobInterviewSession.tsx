import { Box, Typography } from "@mui/material";
import { useLocation, useParams } from "react-router";
import JobDescriptionResponse from "./JobDescriptionResponse";
import { useState, useEffect } from "react";
import { searchListDataFromTable } from "../../services/services";
import ExamSession from "./ExamSession";

const BeyondResumeJobInterviewSession = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const micStatus = queryParams.get("mic") === "true";
  const videoStatus = queryParams.get("video") === "true";

  const { brJobId } = useParams<any>();
  const [jobsData, setJobsData] = useState<any>([]);

  useEffect(() => {
    searchListDataFromTable("brJobApplicant", {
      brJobApplicantId: brJobId,
    }).then((result: any) => {
      setJobsData(result?.data?.data);
    });
  }, []);

    // console.log(jobsData[0]?.jobInterviewQuestions);

  return (
    <Box>
      {jobsData[0] && (
        <ExamSession
          brJobId={brJobId}
          response={jobsData[0]?.jobInterviewQuestions}
          videoStatus={videoStatus}
          micStatus={micStatus}
        />
      )}
    </Box>
  );
};

export default BeyondResumeJobInterviewSession;
