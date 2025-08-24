import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import { shuffleArray } from "../../../../components/util/CommonFunctions";
import { searchListDataFromTable } from "../../../../services/services";
import ExamSessionWritten from "../../ExamSessionWritten";

const BeyondResumeJobInterviewSessionWritten = () => {
  const location = useLocation();

  const { brJobId } = useParams<any>();
  const [jobsData, setJobsData] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [isAdaptive, setIsAdaptive] = useState(false);

  useEffect(() => {
    searchListDataFromTable("brJobApplicant", {
      brJobApplicantId: brJobId,
    }).then((result: any) => {
      setJobsData(result?.data?.data);
      if (result?.data?.data[0]?.examMode === "Adaptive") {
        setIsAdaptive(true);
      }
      setLoading(false);
    });
  }, []);

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

export default BeyondResumeJobInterviewSessionWritten;
