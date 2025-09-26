import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { decryptPayload } from "../../../../components/util/CommonFunctions";
import CYS from "../../../../services/Secret";
import { searchListDataFromTable } from "../../../../services/services";
import ExamSessionWritten from "../../ExamSessionWritten";

const BeyondResumeJobInterviewSessionWritten = () => {
  // const location = useLocation();
  // const queryParams = new URLSearchParams(location.search);
  // const roundId = queryParams.get("roundId");
  // const { brJobId } = useParams<any>();
  const { token } = useParams<{ token: string }>();

  // console.log(token);

  const data = token ? decryptPayload(token, CYS) : null;

  // console.log(data);

  if (!data) return <span >Invalid or expired token</span>;

  const { brJobId, roundId } = data;
  const [jobsData, setJobsData] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [isAdaptive, setIsAdaptive] = useState(false);
  const [roundData, setRoundData] = useState<any>([]);

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
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
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

export default BeyondResumeJobInterviewSessionWritten;
