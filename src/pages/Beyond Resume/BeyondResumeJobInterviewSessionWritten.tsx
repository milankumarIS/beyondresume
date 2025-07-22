import { Box, Typography } from "@mui/material";
import { useLocation, useParams } from "react-router";
import JobDescriptionResponse from "./JobDescriptionResponse";
import { useState, useEffect } from "react";
import { searchListDataFromTable } from "../../services/services";
import ExamSession from "./ExamSession";
import ExamSessionWritten from "./ExamSessionWritten";

const BeyondResumeJobInterviewSessionWritten = () => {
  const location = useLocation();

  const { brJobId } = useParams<any>();
  const [jobsData, setJobsData] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    searchListDataFromTable("brJobApplicant", {
      brJobApplicantId: brJobId,
    }).then((result: any) => {
      setJobsData(result?.data?.data);
      setLoading(false);
    });
  }, []);

    // console.log(jobsData);

  return (
    <Box>
      {loading ? (
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
          <Typography variant="h6" sx={{ mb: 2, color: "inherit" }}>
            Loading
          </Typography>
        </Box>
      ) : (
        <ExamSessionWritten
          brJobId={brJobId}
          response={jobsData[0]?.jobInterviewQuestions}
          interviewDuration={jobsData[0]?.interviewDuration}
        />
      )}
    </Box>
  );
};

export default BeyondResumeJobInterviewSessionWritten;
