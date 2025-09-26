import { Box, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router";
import { searchListDataFromTable } from "../../../../services/services";
import ExamSession from "../../ExamSession";
import { decryptPayload } from "../../../../components/util/CommonFunctions";
import CYS from "../../../../services/Secret";

const BeyondResumePracticeInterviewSession = () => {
 const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const sessionType = queryParams.get("sessionType") ?? undefined;

  const { token } = useParams<{ token: string }>();

  // console.log(token);

  const data = token ? decryptPayload(token, CYS) : null;

  // console.log(data);

  if (!data) return <div>Invalid or expired token</div>;

  const { brJobId, roundId } = data;
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
