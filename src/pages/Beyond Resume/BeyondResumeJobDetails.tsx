import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { searchListDataFromTable } from "../../services/services";
import GeneratedAiQnaResponse from "./GeneratedAiQnaResponse";
import JobDescriptionResponse from "./JobDescriptionResponse";
import { getUserRole } from "../../services/axiosClient";

const BeyondResumeJobDetails = () => {
  const { brJobId } = useParams<any>();
  const [jobsData, setJobsData] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [jobStatus, setJobStatus] = useState("");

  const fetchJobDetails = async () => {
    setLoading(true);
    const result: any = await searchListDataFromTable("brJobs", {
      brJobId: brJobId,
    });
    console.log(result?.data?.data)
    setJobsData(result?.data?.data);
    setJobStatus(result?.data?.data[0]?.brJobStatus);
    setLoading(false);
  };

  useEffect(() => {
    fetchJobDetails();
  }, []);

  return (
    <Box p={2} pt={0}>
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
          <Typography variant="h6" sx={{ mb: 2, color: "black" }}>
            Loading
          </Typography>
        </Box>
      ) : (
        <>
          <JobDescriptionResponse
            jobId={jobsData[0]?.brJobId}
            response={jobsData[0]?.jobDescriptions}
            onJobUpdate={() => window.location.reload()}
          />

          {getUserRole() !== "CAREER SEEKER" && (
            <GeneratedAiQnaResponse
              status={jobStatus}
              response={jobsData[0]?.jobInterviewQuestions}
              jobId={jobsData[0]?.brJobId}
            />
          )}
        </>
      )}
    </Box>
  );
};

export default BeyondResumeJobDetails;
